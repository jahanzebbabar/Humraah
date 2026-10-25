import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View, type ScrollViewInstance } from 'react-native';
import Animated from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { layoutDirection, useDirection } from '@/components/Screen';
import { ButtonV3, Glass, H1V3, Kicker, LangV3, ScreenV3, T } from '@/design/v3/kit';
import { Object3D, type ObjectKind } from '@/design/v3/Object3D';
import { GUTTER_V3, v3 } from '@/design/v3/tokens';
import { useI18n, type StringKey } from '@/i18n';
import { enter } from '@/theme/motion';

// Each slide's object illustrates its promise: kicks, care from doctors, and never being alone.
const slides: { key: 's1' | 's2' | 's3'; kind: ObjectKind }[] = [
  { key: 's1', kind: 'feet' },
  { key: 's2', kind: 'stethoscope' },
  { key: 's3', kind: 'heart' },
];

/** Start + intro, Design 3: an editorial cover per idea, with a soft 3D form breaking out of each glass panel. */
export default function WelcomeV3() {
  const router = useRouter();
  const { t } = useI18n();
  const dir = useDirection();
  const { width } = useWindowDimensions();
  const pager = useRef<ScrollViewInstance>(null);
  const [page, setPage] = useState(0);
  const last = page === slides.length - 1;

  const next = () => {
    if (last) return router.push('/sign-up');
    pager.current?.scrollTo({ x: (page + 1) * width, animated: true });
    setPage(page + 1);
  };

  return (
    <ScreenV3 edges={['top', 'bottom']} orbs="a">
      <Animated.View entering={enter.fade()} style={styles.top}>
        <T size={22} weight="light" style={{ letterSpacing: -0.4 }}>
          {t('brand')}
        </T>
        <LangV3 />
      </Animated.View>

      {/* The pager always scrolls left to right; the text in each slide follows the language. */}
      <View style={[{ flex: 1 }, layoutDirection('ltr')]}>
        <ScrollView
          ref={pager}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
        >
          {slides.map((s, i) => (
            <View key={s.key} style={[styles.slide, dir, { width }]}>
              <Glass
                wrapStyle={{ flex: 1, marginTop: 70 }}
                style={styles.panel}
                breakout={<Object3D kind={s.kind} size={170} style={styles.shape} />}
              >
                <Kicker>{`0${i + 1} / 0${slides.length}`}</Kicker>
                <H1V3 size={40}>
                  {t(`welcome.${s.key}lead` as StringKey)}
                  {t(`welcome.${s.key}accent` as StringKey)}
                  {t(`welcome.${s.key}tail` as StringKey)}
                </H1V3>
                <T size={15} color={v3.muted} style={{ lineHeight: 23 }}>
                  {t(`welcome.${s.key}body` as StringKey)}
                </T>
              </Glass>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {/* Editorial page marker: hairlines, with the current page drawn in black. */}
        <View style={[styles.marks, layoutDirection('ltr')]}>
          {slides.map((s, i) => (
            <View key={s.key} style={[styles.mark, i === page && styles.markOn]} />
          ))}
        </View>
        <ButtonV3 label={last ? t('welcome.begin') : t('welcome.next')} icon={ArrowRight} onPress={next} />
        <View style={styles.links}>
          <PressableScale onPress={() => router.push('/login')} style={{ padding: 8 }}>
            <T size={14} color={v3.muted}>
              {t('welcome.have')}
              <T size={14} weight="medium">
                {t('common.signIn')}
              </T>
            </T>
          </PressableScale>
          {!last && (
            <PressableScale onPress={() => router.push('/login')} style={{ padding: 8 }}>
              <T size={14} weight="medium">
                {t('welcome.skip')}
              </T>
            </PressableScale>
          )}
        </View>
      </View>
    </ScreenV3>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: GUTTER_V3, paddingTop: 8 },
  slide: { paddingHorizontal: GUTTER_V3, paddingBottom: 16 },
  panel: { flex: 1, justifyContent: 'flex-end', gap: 14, paddingTop: 120, paddingBottom: 30 },
  shape: { position: 'absolute', top: -70, end: 26 },
  footer: { paddingHorizontal: GUTTER_V3, paddingBottom: 8, gap: 16 },
  marks: { flexDirection: 'row', gap: 8 },
  mark: { flex: 1, height: 2, borderRadius: 1, backgroundColor: 'rgba(0,0,0,0.12)' },
  markOn: { backgroundColor: v3.black },
  links: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
