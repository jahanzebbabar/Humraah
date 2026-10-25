import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { ArrowUp, Stethoscope } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View, type ScrollViewInstance } from 'react-native';
import Animated, { FadeInLeft, FadeInRight, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInputFont } from '@/components/Controls';
import { PressableScale } from '@/components/PressableScale';
import { chatKeywords, chatReplies, chatSuggestions, type ReplyTopic } from '@/data/mock';
import { ButtonV3, Glass, H1V3, HRule, Kicker, noWebOutline, ScreenV3, T } from '@/design/v3/kit';
import { GUTTER_V3, radiusV3, v3 } from '@/design/v3/tokens';
import { useI18n, type Loc } from '@/i18n';
import { useAppStore } from '@/store/AppStore';
import { duration, ease, enter } from '@/theme/motion';

type Message = { id: string; from: 'me' | 'humraah'; text: Loc };

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

/** Chat, Design 3: a quiet editorial thread. Replies sit on glass, the user's words on black. */
export default function ChatV3() {
  const router = useRouter();
  const { t, L, lang, isRTL } = useI18n();
  const { user } = useAppStore();
  const insets = useSafeAreaInsets();
  const inputFont = useInputFont();
  const scroll = useRef<ScrollViewInstance>(null);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const a = Keyboard.addListener('keyboardDidShow', () => setKeyboard(true));
    const b = Keyboard.addListener('keyboardDidHide', () => setKeyboard(false));
    return () => {
      a.remove();
      b.remove();
    };
  }, []);

  const send = (body: string, topic?: ReplyTopic) => {
    const value = body.trim();
    if (!value || typing) return;
    setMessages((m) => [...m, { id: `${Date.now()}`, from: 'me', text: { en: value, ur: value } }]);
    setText('');
    setTyping(true);
    const reply = chatReplies[topic ?? topicFor(value)];
    setTimeout(() => {
      setMessages((m) => [...m, { id: `${Date.now()}r`, from: 'humraah', text: reply }]);
      setTyping(false);
    }, 900);
  };

  const bottomGap = keyboard ? 10 : Math.max(insets.bottom, 16) + 86;
  const mineEnter = isRTL ? FadeInLeft : FadeInRight;
  const theirsEnter = isRTL ? FadeInRight : FadeInLeft;

  return (
    <ScreenV3 orbs="c">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View entering={enter.rise(0)} style={styles.head}>
          <H1V3 size={44}>
            {t('chat.pre')}
            {t('chat.accent')}
            {t('chat.post')}
          </H1V3>
          <T size={14} color={v3.muted}>
            {t('chat.subtitle')} {t('chat.disclaimer')}
          </T>
        </Animated.View>

        <ScrollView
          ref={scroll}
          style={{ flex: 1 }}
          contentContainerStyle={styles.thread}
          onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={theirsEnter.duration(duration.base).easing(ease)} style={styles.theirsWrap}>
            <Glass radius={radiusV3.inner} intensity={30} style={styles.bubbleBody}>
              <T size={15} weight="light" style={{ lineHeight: 23 }}>
                {t('chat.hello', { name: L(user.firstName), week: user.week })}
              </T>
            </Glass>
          </Animated.View>

          {messages.map((m) =>
            m.from === 'me' ? (
              <Animated.View key={`${m.id}-${lang}`} entering={mineEnter.duration(duration.base).easing(ease)} style={[styles.mine]}>
                <T size={15} color={v3.white} style={{ lineHeight: 22 }}>
                  {L(m.text)}
                </T>
              </Animated.View>
            ) : (
              <Animated.View key={`${m.id}-${lang}`} entering={theirsEnter.duration(duration.base).easing(ease)} style={styles.theirsWrap}>
                <Glass radius={radiusV3.inner} intensity={30} style={styles.bubbleBody}>
                  <T size={15} weight="light" style={{ lineHeight: 23 }}>
                    {L(m.text)}
                  </T>
                </Glass>
              </Animated.View>
            ),
          )}

          {messages.length > 0 && !typing && messages[messages.length - 1].from === 'humraah' && (
            <Animated.View entering={enter.drop()} style={{ alignSelf: 'flex-start' }}>
              <ButtonV3 label={t('week.ctaDoctor')} icon={Stethoscope} variant="glass" onPress={() => router.navigate('/consultants')} style={{ minHeight: 46 }} />
            </Animated.View>
          )}

          {typing && (
            <Animated.View entering={enter.drop()} style={styles.typing}>
              {[0, 1, 2].map((i) => (
                <Dot key={i} delay={i * 150} />
              ))}
            </Animated.View>
          )}

          {messages.length === 0 && !typing && (
            <Glass index={2} wrapStyle={{ marginTop: 18 }} style={{ paddingVertical: 10 }}>
              <View style={{ paddingVertical: 8 }}>
                <Kicker>{t('chat.suggestLabel')}</Kicker>
              </View>
              {chatSuggestions.map((s) => (
                <View key={s.topic}>
                  <HRule />
                  <PressableScale onPress={() => send(L(s.text), s.topic)} scaleTo={0.99} style={styles.suggestion}>
                    <T size={16} weight="light" style={{ flex: 1 }}>
                      {L(s.text)}
                    </T>
                    <ArrowUp size={16} color={v3.black} strokeWidth={1.5} style={{ transform: [{ rotate: '45deg' }] }} />
                  </PressableScale>
                </View>
              ))}
            </Glass>
          )}
        </ScrollView>

        <View style={[styles.composer, { marginBottom: bottomGap }]}>
          {/* The glass layers are decoration only: they must never take taps meant for the input. */}
          <BlurView pointerEvents="none" intensity={45} tint="light" style={[StyleSheet.absoluteFill, styles.composerRound]} />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.composerRound, { backgroundColor: v3.glass, borderWidth: 1, borderColor: v3.edge }]} />
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
            <ArrowUp size={20} color={v3.white} strokeWidth={1.8} />
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </ScreenV3>
  );
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: GUTTER_V3, paddingTop: 20, gap: 10 },
  thread: { paddingHorizontal: GUTTER_V3, paddingVertical: 22, gap: 12, flexGrow: 1 },
  theirsWrap: { alignSelf: 'flex-start', maxWidth: '86%' },
  bubbleBody: { paddingHorizontal: 18, paddingVertical: 14 },
  mine: { alignSelf: 'flex-end', maxWidth: '82%', backgroundColor: v3.black, borderRadius: radiusV3.inner, paddingHorizontal: 18, paddingVertical: 13 },
  typing: { flexDirection: 'row', gap: 6, paddingVertical: 10, paddingHorizontal: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: v3.black },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15 },
  composer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: GUTTER_V3, paddingStart: 22, paddingEnd: 6, height: 60 },
  composerRound: { borderRadius: radiusV3.pill, overflow: 'hidden' },
  // On web an unpositioned input paints beneath the absolutely positioned glass, so lift it above.
  input: { flex: 1, alignSelf: 'stretch', color: v3.black, position: 'relative', zIndex: 1 },
  send: { width: 46, height: 46, borderRadius: 23, backgroundColor: v3.black, alignItems: 'center', justifyContent: 'center' },
});
