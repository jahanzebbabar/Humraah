import { useRouter } from 'expo-router';
import { ChevronRight, Pill, Plus, Wind, type LucideIcon } from 'lucide-react-native';
import { useEffect, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { layoutDirection, useFlip } from '@/components/Screen';
import { useSmartGreeting } from '@/components/SmartGreeting';
import { babyObjectSize, babySizeForWeek, formatCm, formatG } from '@/data/babySize';
import { doctors, dueOptions } from '@/data/mock';
import { Cells, CheckV3, Figure, Glass, H1V3, HRule, IconGlass, Kicker, LineRow, PortraitV3, ScreenV3, Stat, T, TagV3 } from '@/design/v3/kit';
import { Object3D } from '@/design/v3/Object3D';
import { GUTTER_V3, radiusV3, v3 } from '@/design/v3/tokens';
import { useI18n, type StringKey } from '@/i18n';
import { useAppStore } from '@/store/AppStore';
import { NAV_CLEARANCE } from '@/theme';
import { ease, enter, layout } from '@/theme/motion';

const trimesterOf = (week: number) => (week < 14 ? 1 : week < 28 ? 2 : 3);
const KICK_GOAL = 10;
const drift = Easing.inOut(Easing.sin);

/** Slow, endless bob for the 3D forms, so the page feels alive without anything demanding attention. */
function Float({ children, style, distance = 8, period = 2800, delay = 0 }: { children: ReactNode; style?: StyleProp<ViewStyle>; distance?: number; period?: number; delay?: number }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(delay, withRepeat(withTiming(-distance, { duration: period, easing: drift }), -1, true));
  }, [delay, distance, period, y]);
  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View pointerEvents="none" style={[style, anim]}>
      {children}
    </Animated.View>
  );
}

/** A hairline that fills to `progress` (0 to 1), easing to each new value. */
function Track({ progress, delay = 0, style }: { progress: number; delay?: number; style?: StyleProp<ViewStyle> }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withTiming(Math.min(progress, 1), { duration: 900, easing: ease }));
  }, [delay, p, progress]);
  const fill = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));
  return (
    <View style={[styles.track, layoutDirection('ltr'), style]}>
      <Animated.View style={[styles.trackFill, fill]} />
    </View>
  );
}

/**
 * Landing page, Design 3: an editorial cover (date, a vast light "Week 32", the day's note), then
 * glass panels whose data sits in a hairline grid, with soft 3D forms drifting out of the frames.
 */
export default function HomeV3() {
  const router = useRouter();
  const { t, L, lang } = useI18n();
  const { user, kicks, addKick, care, toggleCare, planner, supplements } = useAppStore();
  const { greeting, insight } = useSmartGreeting();
  const today = new Date().toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  // The soonest open appointment in the planner, so a booking made in the app shows up here.
  const visits = planner
    .filter((p) => p.category === 'Appointments' && !p.done)
    .sort((a, b) => dueOptions.indexOf(a.due) - dueOptions.indexOf(b.due));
  const visit = visits[0];
  const visitDoctor = visit && doctors.find((d) => visit.title.en.includes(d.name.en.split(' ')[1]));
  const openVisits = () => router.navigate({ pathname: '/planner', params: { category: 'Appointments', at: String(Date.now()) } });

  const taken = supplements.filter((s) => s.taken).length;
  const baby = babySizeForWeek(user.week);
  const kicksLeft = Math.max(KICK_GOAL - kicks, 0);

  return (
    <ScreenV3 orbs="a">
      <ScrollView contentContainerStyle={{ paddingBottom: NAV_CLEARANCE + 10 }} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <Kicker>{today}</Kicker>
        </View>

        <Animated.View entering={enter.rise(0)} style={styles.cover}>
          <H1V3 size={64} style={{ letterSpacing: -2.5 }}>
            {t('week.title', { week: user.week })}
          </H1V3>
          <T size={17} weight="light" style={{ lineHeight: 26 }}>
            <T size={17} weight="medium">
              {greeting}
            </T>{' '}
            {insight}
          </T>
        </Animated.View>

        {/* Hero: the pregnancy at a glance in a 2 by 2 hairline grid. */}
        <Glass
          index={1}
          onPress={() => router.push('/week')}
          wrapStyle={[styles.gutter, { marginTop: 54 }]}
          style={{ paddingTop: 30 }}
          breakout={
            <Float style={styles.heroShape}>
              <Object3D kind="corn" size={babyObjectSize(user.week, 132)} />
            </Float>
          }
        >
          <Cells>
            <Stat label={t('v2.home.weeksAlong')} value={user.week} />
            <Stat label={t('v2.home.weeksToGo')} value={40 - user.week} />
          </Cells>
          <HRule style={{ marginVertical: 18 }} />
          <Cells>
            <Stat label={t('v3.home.trimester')} value={trimesterOf(user.week)} />
            <View style={{ gap: 6 }}>
              <Kicker>{t('v3.home.baby')}</Kicker>
              <T size={20} weight="light" style={{ lineHeight: 26 }}>
                {L(baby.fruit)}
              </T>
              <T size={12} color={v3.muted}>
                {t('home.babyMeasure', { cm: formatCm(baby.cm), g: formatG(baby.g) })}
              </T>
            </View>
          </Cells>
          <Track progress={user.week / 40} delay={250} style={{ marginTop: 22 }} />
        </Glass>

        {/* Kick counter: the figure pops on every kick and a hairline fills toward the day's goal. */}
        <Glass index={2} wrapStyle={[styles.gutter, { marginTop: 18 }]}>
          <Cells>
            <View style={{ gap: 4 }}>
              <Kicker>{t('v2.home.kicksToday')}</Kicker>
              <Animated.View key={kicks} entering={kicks > 0 ? enter.pop() : undefined}>
                <Figure value={kicks} size={64} />
              </Animated.View>
            </View>
            <View style={{ flex: 1, justifyContent: 'space-between', gap: 14 }}>
              <T size={13} color={v3.muted}>
                {kicksLeft > 0 ? t('home.kicksLeft', { n: kicksLeft }) : t('home.kickGoalMet')}
              </T>
              <PressableScale onPress={addKick} scaleTo={0.92} accessibilityLabel={t('home.addKick')} style={styles.kickButton}>
                <Plus size={18} color={v3.white} strokeWidth={1.8} />
                <T size={14} weight="medium" color={v3.white}>
                  {t('home.addKick')}
                </T>
              </PressableScale>
            </View>
          </Cells>
          <Track progress={kicks / KICK_GOAL} style={{ marginTop: 18 }} />
        </Glass>

        {/* Quick ways to look after yourself today. */}
        <View style={styles.sectionHead}>
          <Kicker>{t('home.forYou')}</Kicker>
        </View>
        <View style={[styles.gutter, styles.pair]}>
          <Tile
            index={3}
            icon={Wind}
            title={t('breath.tile')}
            body={t('breath.tileBody')}
            onPress={() => router.push('/breathing')}
            shape={
              <Float style={styles.tileShape} distance={6} period={4000}>
                <Object3D kind="lotus" size={66} />
              </Float>
            }
          />
          <Tile
            index={4}
            icon={Pill}
            title={t('supp.tile')}
            body={t('supp.tileBody', { n: taken, total: supplements.length })}
            onPress={() => router.push('/supplements')}
            shape={
              <Float style={styles.tileShape} distance={6} period={3400} delay={700}>
                <Object3D kind="capsule" size={66} />
              </Float>
            }
          />
        </View>

        <View style={styles.sectionHead}>
          <Kicker>{t('home.nextVisit')}</Kicker>
          {visit && <SeeAll label={t('home.allVisits')} onPress={openVisits} />}
        </View>
        {visit ? (
          // The portrait overlaps the panel edge for depth.
          <Glass
            index={5}
            onPress={openVisits}
            wrapStyle={[styles.gutter, { marginStart: GUTTER_V3 + 30 }]}
            style={{ paddingStart: 70, gap: 10 }}
            breakout={
              visitDoctor ? (
                <PortraitV3 initials={L(visitDoctor.initials)} size={84} style={styles.portrait} />
              ) : (
                <Object3D kind="calendar" size={84} style={styles.portrait} />
              )
            }
          >
            <T size={20} weight="light">
              {L(visit.title)}
            </T>
            <View style={styles.tags}>
              <TagV3 label={t(`due.${visit.due}` as StringKey)} active />
              {visits.length > 1 && <TagV3 label={t('home.allVisits')} count={visits.length} />}
            </View>
          </Glass>
        ) : (
          <Glass index={5} onPress={() => router.navigate('/consultants')} wrapStyle={styles.gutter} style={styles.emptyVisit}>
            <T size={18} weight="light" style={{ flex: 1 }}>
              {t('home.noVisit')}
            </T>
            <SeeAll label={t('home.findDoctor')} />
          </Glass>
        )}

        <View style={styles.sectionHead}>
          <Kicker>{t('home.careTitle')}</Kicker>
          <SeeAll label={t('home.viewPlanner')} onPress={() => router.navigate('/planner')} />
        </View>
        <Glass index={6} wrapStyle={styles.gutter} style={{ paddingVertical: 6 }}>
          {care.map((task, i) => (
            <Animated.View key={task.id} layout={layout}>
              <LineRow first={i === 0}>
                <CheckV3 checked={task.done} onPress={() => toggleCare(task.id)} />
                <View style={{ flex: 1, gap: 2 }}>
                  <T size={16} style={task.done && { textDecorationLine: 'line-through', color: v3.muted }}>
                    {L(task.title)}
                  </T>
                  <T size={13} color={v3.muted}>
                    {task.done ? t('home.careDone') : L(task.detail)}
                  </T>
                </View>
              </LineRow>
            </Animated.View>
          ))}
        </Glass>
      </ScrollView>
    </ScreenV3>
  );
}

/** Section action: a label with a chevron; static when the whole card is already the button. */
function SeeAll({ label, onPress }: { label: string; onPress?: () => void }) {
  const flip = useFlip();
  const body = (
    <>
      <T size={13} weight="medium">
        {label}
      </T>
      <ChevronRight size={14} color={v3.black} strokeWidth={1.6} style={flip} />
    </>
  );
  if (!onPress) return <View style={styles.link}>{body}</View>;
  return (
    <PressableScale onPress={onPress} style={styles.link}>
      {body}
    </PressableScale>
  );
}

function Tile({ index, icon, title, body, onPress, shape }: { index: number; icon: LucideIcon; title: string; body: string; onPress: () => void; shape: ReactNode }) {
  return (
    <Glass index={index} onPress={onPress} radius={radiusV3.inner + 4} wrapStyle={{ flex: 1 }} style={styles.tile} breakout={shape}>
      <IconGlass icon={icon} size={38} />
      <View style={{ gap: 4 }}>
        <T size={16} weight="medium">
          {title}
        </T>
        <T size={12} color={v3.muted}>
          {body}
        </T>
      </View>
    </Glass>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: GUTTER_V3, paddingTop: 8 },
  cover: { paddingHorizontal: GUTTER_V3, marginTop: 18, gap: 14 },
  gutter: { marginHorizontal: GUTTER_V3 },
  heroShape: { position: 'absolute', top: -64, end: 18 },
  track: { height: 1, backgroundColor: v3.hairline },
  trackFill: { height: 1, backgroundColor: v3.black },
  kickButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 46, borderRadius: radiusV3.pill, backgroundColor: v3.black, paddingHorizontal: 16 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: GUTTER_V3 + 4, marginTop: 34, marginBottom: 14 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  pair: { flexDirection: 'row', gap: 14 },
  tile: { gap: 18, padding: 18, minHeight: 150, justifyContent: 'space-between' },
  tileShape: { position: 'absolute', top: -22, end: 12 },
  portrait: { position: 'absolute', start: -34, top: 18 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emptyVisit: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
