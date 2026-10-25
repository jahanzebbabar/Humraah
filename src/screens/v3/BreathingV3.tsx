import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Pause, Play, RotateCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ButtonV3, Figure, Glass, H1V3, Kicker, ScreenV3, T, TopBarV3 } from '@/design/v3/kit';
import { Object3D } from '@/design/v3/Object3D';
import { GUTTER_V3, v3 } from '@/design/v3/tokens';
import { useI18n, type StringKey } from '@/i18n';
import { enter } from '@/theme/motion';

/** 4-7-8 breathing: the orb swells on the in-breath, rests on the hold and settles on the long out-breath. */
const PHASES: { label: StringKey; secs: number; scale: number }[] = [
  { label: 'breath.in', secs: 4, scale: 1 },
  { label: 'breath.hold', secs: 7, scale: 1 },
  { label: 'breath.out', secs: 8, scale: 0.6 },
];
const ROUNDS = 4;
const REST = 0.6;
const breathe = Easing.inOut(Easing.sin);

type Status = 'idle' | 'running' | 'paused' | 'done';
type State = { status: Status; step: number; left: number; round: number };
const fresh: State = { status: 'idle', step: 0, left: PHASES[0].secs, round: 1 };

function tick(s: State): State {
  if (s.left > 1) return { ...s, left: s.left - 1 };
  const next = s.step + 1;
  if (next < PHASES.length) return { ...s, step: next, left: PHASES[next].secs };
  if (s.round >= ROUNDS) return { ...s, status: 'done', left: 0 };
  return { ...s, step: 0, left: PHASES[0].secs, round: s.round + 1 };
}

/** Guided breathing, Design 3: one pearl at the centre of the page that breathes with you. */
export default function BreathingV3() {
  const router = useRouter();
  const { t } = useI18n();
  const [s, setS] = useState<State>(fresh);
  const scale = useSharedValue(REST);

  useEffect(() => {
    if (s.status !== 'running') return;
    const id = setInterval(() => setS(tick), 1000);
    return () => clearInterval(id);
  }, [s.status]);

  // A soft tick on every phase change, so the exercise can be followed with eyes closed.
  useEffect(() => {
    if (s.status === 'running') Haptics.selectionAsync().catch(() => {});
  }, [s.step, s.round, s.status]);

  useEffect(() => {
    if (s.status === 'running') scale.value = withTiming(PHASES[s.step].scale, { duration: s.left * 1000, easing: breathe });
    else if (s.status === 'paused') cancelAnimation(scale);
    else scale.value = withTiming(REST, { duration: 600, easing: breathe });
    // `left` is read only when a phase starts or resumes; re-running every second would restart the easing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.step, s.round, s.status, scale]);

  const orb = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const running = s.status === 'running';
  const phase = PHASES[s.step];
  const headline = s.status === 'idle' ? t('breath.ready') : s.status === 'done' ? t('breath.done') : t(phase.label);

  const primary =
    s.status === 'done'
      ? { label: t('breath.again'), icon: RotateCcw, onPress: () => setS({ ...fresh, status: 'running' }) }
      : running
        ? { label: t('breath.pause'), icon: Pause, onPress: () => setS((p) => ({ ...p, status: 'paused' })) }
        : { label: t(s.status === 'paused' ? 'breath.resume' : 'breath.start'), icon: Play, onPress: () => setS((p) => ({ ...p, status: 'running' })) };

  return (
    <ScreenV3 edges={['top', 'bottom']} orbs="b">
      <TopBarV3 onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter.rise(0)} style={styles.cover}>
          <Kicker>4 · 7 · 8</Kicker>
          <H1V3 size={44}>{t('breath.title')}</H1V3>
          <T size={15} weight="light" color={v3.muted} style={{ lineHeight: 23 }}>
            {t('breath.intro')}
          </T>
        </Animated.View>

        <View style={styles.stage}>
          <View style={styles.ring} />
          <Animated.View style={orb}>
            <Object3D kind="lotus" size={ORB} />
          </Animated.View>
        </View>

        <Glass index={2} wrapStyle={styles.gutter} style={styles.panel}>
          <Kicker>{t('breath.round', { n: s.round, total: ROUNDS })}</Kicker>
          <T size={22} weight="light" align="center">
            {headline}
          </T>
          {(running || s.status === 'paused') && <Figure value={s.left} size={56} />}
        </Glass>

        <View style={[styles.gutter, { gap: 12, marginTop: 22 }]}>
          <ButtonV3 label={primary.label} icon={primary.icon} onPress={primary.onPress} />
          {s.status === 'paused' && <ButtonV3 label={t('breath.again')} icon={RotateCcw} variant="glass" onPress={() => setS(fresh)} />}
          <T size={12} color={v3.muted} align="center">
            {t('breath.note')}
          </T>
        </View>
      </ScrollView>
    </ScreenV3>
  );
}

const ORB = 220;

const styles = StyleSheet.create({
  cover: { paddingHorizontal: GUTTER_V3, marginTop: 18, gap: 10 },
  gutter: { marginHorizontal: GUTTER_V3 },
  stage: { height: ORB + 60, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  // A hairline circle marks the full in-breath, so you can see how far the pearl has to grow.
  ring: { position: 'absolute', width: ORB + 24, height: ORB + 24, borderRadius: (ORB + 24) / 2, borderWidth: 1, borderColor: v3.hairline },
  panel: { alignItems: 'center', gap: 8, paddingVertical: 22 },
});
