import { useRouter, type Href } from 'expo-router';
import { ArrowUp, BookOpen, ChevronRight, MessageCircle, Stethoscope, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions, View, type ScrollViewInstance } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInRight, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInputFont } from '@/components/Controls';
import { PressableScale } from '@/components/PressableScale';
import { useDirection, useFlip } from '@/components/Screen';
import { suggestTopics, type Topic } from '@/data/library';
import { chatKeywords, chatReplies, chatSuggestions, type ReplyTopic } from '@/data/mock';
import { HRule, Kicker, noWebOutline, T } from '@/design/v3/kit';
import { floatShadow, radiusV3, v3 } from '@/design/v3/tokens';
import { useI18n, type Loc } from '@/i18n';
import { askHumraahAI, type HumraahTurn } from '@/lib/humraahAI';
import { useAppStore } from '@/store/AppStore';
import { duration, ease } from '@/theme/motion';

type Message = { id: string; from: 'me' | 'humraah'; text: Loc; topics?: Topic[] };

function topicFor(text: string): ReplyTopic {
  const lower = text.toLowerCase();
  for (const [topic, words] of Object.entries(chatKeywords)) {
    if (words.some((w) => lower.includes(w))) return topic as ReplyTopic;
  }
  return 'default';
}

function Dot({ delay }: { delay: number }) {
  const o = useSharedValue(0.25);
  useEffect(() => {
    o.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 300 }), withTiming(0.25, { duration: 300 })), -1));
  }, [delay, o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[styles.dot, style]} />;
}

/** Above this width the chat opens as a floating card; below it, as a full-screen panel. */
const CARD_MIN = 700;

/**
 * "Ask Humraah": a chat bubble pinned to the bottom-right corner of every main section. Answers stay
 * general and point to matching library topics, so a question always leads somewhere to read more.
 */
export function AskHumraahBot() {
  const router = useRouter();
  const { t, L, lang, isRTL } = useI18n();
  const { user } = useAppStore();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const dir = useDirection();
  const flip = useFlip();
  const inputFont = useInputFont();
  const scroll = useRef<ScrollViewInstance>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const card = width >= CARD_MIN;

  const send = (body: string, topic?: ReplyTopic) => {
    const value = body.trim();
    if (!value || typing) return;
    const history: HumraahTurn[] = messages.map((m) => ({ sender: m.from === 'me' ? 'user' : 'ai', text: L(m.text) }));
    setMessages((m) => [...m, { id: `${Date.now()}`, from: 'me', text: { en: value, ur: value } }]);
    setText('');
    setTyping(true);
    const related = suggestTopics(value, 3);
    // Keep the typing dots up briefly so instant replies don't feel abrupt.
    const minDelay = new Promise((r) => setTimeout(r, 600));
    const ask = askHumraahAI(value, history, { userId: user.uid, userName: L(user.firstName), language: lang === 'ur' ? 'ur' : 'en', stage: user.stage, week: user.week });
    Promise.all([ask, minDelay]).then(([ai]) => {
      // Gemini's answer when the server is reachable; otherwise the built-in canned reply.
      const reply: Loc = ai ? { en: ai, ur: ai } : chatReplies[topic ?? topicFor(value)];
      setMessages((m) => [...m, { id: `${Date.now()}r`, from: 'humraah', text: reply, topics: related }]);
      setTyping(false);
    });
  };

  const leave = (href: Href) => {
    Keyboard.dismiss();
    setOpen(false);
    router.navigate(href);
  };

  const mineEnter = isRTL ? FadeInLeft : FadeInRight;
  const theirsEnter = isRTL ? FadeInRight : FadeInLeft;
  const last = messages[messages.length - 1];
  const fabBottom = Math.max(insets.bottom, 0) + 20;

  const panel = (
    <View style={[styles.panel, dir, card ? [styles.card, { height: Math.min(760, height - fabBottom - 100), bottom: fabBottom + 74 }, isRTL ? { left: 20 } : { right: 20 }] : [StyleSheet.absoluteFill, { paddingTop: insets.top, paddingBottom: insets.bottom }]]}>
      <View style={styles.head}>
        <View style={styles.avatar}>
          <Image source={require('../../assets/logo.png')} style={styles.avatarImg} resizeMode="contain" accessibilityIgnoresInvertColors />
        </View>
        <View style={{ flex: 1 }}>
          <T size={16} weight="semibold">
            {t('chatbot.open')}
          </T>
          <T size={12} color={v3.muted}>
            {t('chat.subtitle')}
          </T>
        </View>
        <PressableScale onPress={() => setOpen(false)} accessibilityLabel={t('chatbot.close')} style={styles.close}>
          <X size={18} color={v3.black} strokeWidth={1.8} />
        </PressableScale>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={styles.thread} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.theirs}>
            <T size={14} weight="light" style={{ lineHeight: 21 }}>
              {t('chat.hello', { name: L(user.firstName), week: user.week })}
            </T>
          </View>

          {messages.map((m) =>
            m.from === 'me' ? (
              <Animated.View key={`${m.id}-${lang}`} entering={mineEnter.duration(duration.base).easing(ease)} style={styles.mine}>
                <T size={14} color={v3.white} style={{ lineHeight: 21 }}>
                  {L(m.text)}
                </T>
              </Animated.View>
            ) : (
              <Animated.View key={`${m.id}-${lang}`} entering={theirsEnter.duration(duration.base).easing(ease)} style={{ gap: 8, alignSelf: 'stretch' }}>
                <View style={styles.theirs}>
                  <T size={14} weight="light" style={{ lineHeight: 21 }}>
                    {L(m.text)}
                  </T>
                </View>
                {!!m.topics?.length && (
                  <View style={styles.related}>
                    <Kicker>{t('chatbot.fromLibrary')}</Kicker>
                    {m.topics.map((tp) => (
                      <PressableScale key={tp.slug} scaleTo={0.98} onPress={() => leave(`/library/topic/${tp.slug}` as Href)} style={styles.topicRow}>
                        <BookOpen size={15} color={v3.black} strokeWidth={1.6} />
                        <T size={13} weight="medium" latin style={{ flex: 1 }} numberOfLines={2}>
                          {tp.title}
                        </T>
                        <ChevronRight size={15} color={v3.black} strokeWidth={1.6} style={flip} />
                      </PressableScale>
                    ))}
                  </View>
                )}
              </Animated.View>
            ),
          )}

          {last?.from === 'humraah' && !typing && (
            <PressableScale onPress={() => leave('/consultants')} style={styles.doctorBtn}>
              <Stethoscope size={16} color={v3.black} strokeWidth={1.6} />
              <T size={13} weight="medium">
                {t('week.ctaDoctor')}
              </T>
            </PressableScale>
          )}

          {typing && (
            <View style={styles.typing}>
              {[0, 1, 2].map((i) => (
                <Dot key={i} delay={i * 150} />
              ))}
            </View>
          )}

          {messages.length === 0 && !typing && (
            <View style={styles.suggestBox}>
              <Kicker>{t('chat.suggestLabel')}</Kicker>
              {chatSuggestions.map((s, i) => (
                <View key={s.topic}>
                  {i > 0 && <HRule />}
                  <PressableScale onPress={() => send(L(s.text), s.topic)} scaleTo={0.99} style={styles.suggestion}>
                    <T size={14} weight="light" style={{ flex: 1 }}>
                      {L(s.text)}
                    </T>
                    <ArrowUp size={15} color={v3.black} strokeWidth={1.5} style={{ transform: [{ rotate: '45deg' }] }} />
                  </PressableScale>
                </View>
              ))}
            </View>
          )}

          <T size={11} color={v3.muted} align="center" style={{ marginTop: 6 }}>
            {t('chat.disclaimer')}
          </T>
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t('chat.placeholder')}
            placeholderTextColor={v3.muted}
            style={[styles.input, noWebOutline, inputFont]}
            onSubmitEditing={() => send(text)}
            returnKeyType="send"
          />
          <PressableScale onPress={() => send(text)} scaleTo={0.85} style={[styles.send, !text.trim() && { opacity: 0.3 }]} accessibilityLabel={t('common.send')}>
            <ArrowUp size={19} color={v3.white} strokeWidth={1.8} />
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </View>
  );

  return (
    <>
      <View pointerEvents="box-none" style={[styles.fabWrap, { bottom: fabBottom }, isRTL ? { left: 20 } : { right: 20 }]}>
        <PressableScale onPress={() => setOpen((o) => !o)} scaleTo={0.92} accessibilityLabel={open ? t('chatbot.close') : t('chatbot.open')} style={[styles.fab, card && styles.fabWide, Platform.OS !== 'android' && floatShadow]}>
          {open ? <X size={22} color={v3.white} strokeWidth={1.8} /> : <MessageCircle size={22} color={v3.white} strokeWidth={1.7} />}
          {card && !open && (
            <T size={14} weight="medium" color={v3.white}>
              {t('chatbot.open')}
            </T>
          )}
        </PressableScale>
      </View>

      <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        {card && (
          <Animated.View entering={FadeIn.duration(duration.fast)} style={StyleSheet.absoluteFill}>
            <Pressable accessibilityLabel={t('chatbot.close')} onPress={() => setOpen(false)} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20,16,14,0.08)' }]} />
          </Animated.View>
        )}
        <Animated.View entering={FadeInDown.duration(duration.base).easing(ease)} style={card ? StyleSheet.absoluteFill : [StyleSheet.absoluteFill, { backgroundColor: v3.bone }]} pointerEvents="box-none">
          {panel}
        </Animated.View>
        {/* Keep the toggle reachable above the card so it can be closed where it was opened. */}
        {card && (
          <View pointerEvents="box-none" style={[styles.fabWrap, { bottom: fabBottom }, isRTL ? { left: 20 } : { right: 20 }]}>
            <PressableScale onPress={() => setOpen(false)} scaleTo={0.92} accessibilityLabel={t('chatbot.close')} style={[styles.fab, Platform.OS !== 'android' && floatShadow]}>
              <X size={22} color={v3.white} strokeWidth={1.8} />
            </PressableScale>
          </View>
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fabWrap: { position: 'absolute', zIndex: 20 },
  fab: { height: 60, minWidth: 60, borderRadius: 30, backgroundColor: v3.black, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  fabWide: { paddingHorizontal: 22 },
  panel: { backgroundColor: v3.bone, overflow: 'hidden' },
  card: { position: 'absolute', width: 480, maxWidth: '92%', borderRadius: radiusV3.card, borderWidth: 1, borderColor: v3.white, ...floatShadow, shadowOpacity: 0.16 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: v3.hairline, backgroundColor: 'rgba(255,255,255,0.5)' },
  avatar: { width: 40, height: 40, borderRadius: 14, backgroundColor: v3.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: v3.edge },
  avatarImg: { width: 30, height: 30 },
  close: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: v3.glassStrong, borderWidth: 1, borderColor: v3.edge },
  thread: { padding: 16, gap: 10, flexGrow: 1 },
  theirs: { alignSelf: 'flex-start', maxWidth: '90%', backgroundColor: v3.white, borderRadius: radiusV3.inner, borderTopLeftRadius: 8, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: v3.hairline },
  mine: { alignSelf: 'flex-end', maxWidth: '82%', backgroundColor: v3.black, borderRadius: radiusV3.inner, borderTopRightRadius: 8, paddingHorizontal: 16, paddingVertical: 11 },
  related: { alignSelf: 'stretch', gap: 6, padding: 12, borderRadius: radiusV3.inner, backgroundColor: 'rgba(197, 214, 192, 0.35)' },
  topicRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.7)' },
  doctorBtn: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radiusV3.pill, backgroundColor: v3.glassStrong, borderWidth: 1, borderColor: v3.hairline },
  typing: { flexDirection: 'row', gap: 6, paddingVertical: 10, paddingHorizontal: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: v3.black },
  suggestBox: { marginTop: 8, padding: 16, borderRadius: radiusV3.inner, backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1, borderColor: v3.hairline, gap: 4 },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  composer: { flexDirection: 'row', alignItems: 'center', margin: 12, paddingStart: 18, paddingEnd: 5, height: 54, borderRadius: radiusV3.pill, backgroundColor: v3.white, borderWidth: 1, borderColor: v3.hairline },
  input: { flex: 1, alignSelf: 'stretch', color: v3.black },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: v3.black, alignItems: 'center', justifyContent: 'center' },
});
