import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { insightForWeek } from '@/data/weeklyInsights';
import { useI18n } from '@/i18n';
import type { StringKey } from '@/i18n/strings';
import { useAppStore } from '@/store/AppStore';
import { colors } from '@/theme';
import { enter } from '@/theme/motion';
import { AppText } from './AppText';

type Period = 'morning' | 'afternoon' | 'evening' | 'night';

function periodAt(date: Date): Period {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

/** Follows the device clock, re-checking once a minute so the greeting turns over on its own. */
function usePeriod() {
  const [period, setPeriod] = useState(() => periodAt(new Date()));
  useEffect(() => {
    const id = setInterval(() => setPeriod(periodAt(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);
  return period;
}

/**
 * Home's quiet "smart context" line: local time of day, the user's name, and one
 * practical tip for their exact week. Plain text by design, so it reads as care, not tech.
 */
export function useSmartGreeting() {
  const { t, L } = useI18n();
  const { user } = useAppStore();
  const period = usePeriod();
  const isDay = period === 'morning' || period === 'afternoon';

  const greeting = t(`smart.${period}` as StringKey, { name: L(user.firstName) });
  let insight: string;
  if (user.stage === 'New mom') insight = t(isDay ? 'smart.newMomDay' : 'smart.newMomNight');
  else {
    const tips = insightForWeek(user.week);
    insight = t('smart.week', { week: user.week, tip: L(isDay ? tips.day : tips.night) });
  }
  return { period, greeting, insight };
}

export function SmartGreeting() {
  const { period, greeting, insight } = useSmartGreeting();

  return (
    <Animated.View key={period} entering={enter.fade(1)} style={styles.wrap} accessibilityRole="text">
      <AppText variant="body" color={colors.textSecondary} style={styles.text}>
        <AppText variant="body" weight="medium" style={styles.text}>
          {greeting}
        </AppText>{' '}
        {insight}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 14, marginTop: -4, marginBottom: 16 },
  text: { fontSize: 15, lineHeight: 22 },
});
