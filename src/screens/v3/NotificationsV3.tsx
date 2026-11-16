import { useRouter, type Href } from 'expo-router';
import { Baby, Droplet, Heart, Pill, Stethoscope, type LucideIcon } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { notifications, type NotificationKind } from '@/data/mock';
import { Glass, H1V3, IconGlass, Kicker, LineRow, ScreenV3, T, TopBarV3 } from '@/design/v3/kit';
import { GUTTER_V3, radiusV3, v3 } from '@/design/v3/tokens';
import { useI18n, type StringKey } from '@/i18n';
import { useAppStore } from '@/store/AppStore';
import { enter } from '@/theme/motion';

const icons: Record<NotificationKind, LucideIcon> = { pill: Pill, baby: Baby, doctor: Stethoscope, water: Droplet, heart: Heart };

/** Where each reminder takes you when tapped. */
const destinations: Record<NotificationKind, () => Href> = {
  pill: () => '/planner',
  baby: () => '/week',
  // A visit reminder opens the booked appointments, not a new booking form.
  // `at` makes a repeat tap re-open Appointments even if the planner was left on another category.
  doctor: () => ({ pathname: '/planner', params: { category: 'Appointments', at: String(Date.now()) } }),
  water: () => '/',
  heart: () => '/library',
};

/** Reminders, Design 3: one glass panel per day, entries as an editorial list with the time in the margin. */
export default function NotificationsV3() {
  const router = useRouter();
  const { t, L } = useI18n();
  const { readNotifications, markRead } = useAppStore();
  const groups = [...new Set(notifications.map((n) => n.when))];
  const unread = notifications.filter((n) => !readNotifications.includes(n.id)).length;

  return (
    <ScreenV3 edges={['top', 'bottom']} orbs="c">
      <TopBarV3
        onBack={() => router.back()}
        right={
          <PressableScale onPress={() => markRead(notifications.map((n) => n.id))} disabled={!unread} style={[styles.markAll, !unread && { opacity: 0.4 }]}>
            <T size={13} weight="medium" color={v3.white}>
              {t('notif.markAll')}
            </T>
          </PressableScale>
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter.rise(0)} style={styles.head}>
          <H1V3 size={48}>{t('v3.notif.h1')}</H1V3>
        </Animated.View>

        {groups.map((g, gi) => (
          <View key={g} style={{ marginTop: 30 }}>
            <View style={{ marginHorizontal: GUTTER_V3 + 4, marginBottom: 12 }}>
              <Kicker>{t(`notif.${g}` as StringKey)}</Kicker>
            </View>
            <Glass index={1 + gi} wrapStyle={{ marginHorizontal: GUTTER_V3 }} style={{ paddingVertical: 4 }}>
              {notifications
                .filter((n) => n.when === g)
                .map((n, i) => {
                  const isUnread = !readNotifications.includes(n.id);
                  return (
                    <LineRow
                      key={n.id}
                      first={i === 0}
                      onPress={() => {
                        markRead([n.id]);
                        router.push(destinations[n.kind]());
                      }}
                    >
                      <IconGlass icon={icons[n.kind]} size={40} dark={isUnread} />
                      <View style={{ flex: 1, gap: 3 }}>
                        <T size={16} weight={isUnread ? 'medium' : 'light'}>
                          {L(n.title)}
                        </T>
                        <T size={13} color={v3.muted}>
                          {L(n.body)}
                        </T>
                      </View>
                      <T size={12} color={v3.muted} style={{ alignSelf: 'flex-start', marginTop: 2 }}>
                        {L(n.time)}
                      </T>
                    </LineRow>
                  );
                })}
            </Glass>
          </View>
        ))}
      </ScrollView>
    </ScreenV3>
  );
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: GUTTER_V3, marginTop: 16 },
  markAll: { height: 38, paddingHorizontal: 16, borderRadius: radiusV3.pill, backgroundColor: v3.black, justifyContent: 'center' },
});
