import { CalendarDays, Check, CheckCheck, Monitor, Building2, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ButtonV3, Glass, H1V3, HRule, Kicker, PortraitV3, ScreenV3, SegmentedV3, T, TagV3, type ShapeTone } from '@/design/v3/kit';
import { GUTTER_V3, v3 } from '@/design/v3/tokens';
import { useI18n, type StringKey } from '@/i18n';
import type { Appointment, AppointmentStatus } from '@/lib/accounts';
import { useAppStore } from '@/store/AppStore';
import { NAV_CLEARANCE } from '@/theme';
import { enter, exit, layout } from '@/theme/motion';

type Filter = 'upcoming' | 'past';
const upcoming: AppointmentStatus[] = ['pending', 'confirmed'];
const tones: ShapeTone[] = ['rose', 'lavender', 'sage'];

/** Specialist home: every booking request sent to this doctor, with the actions to answer it. */
export default function DoctorAppointmentsV3() {
  const { t, L } = useI18n();
  const { user, appointments } = useAppStore();
  const [filter, setFilter] = useState<Filter>('upcoming');

  const list = useMemo(
    () => appointments.filter((a) => upcoming.includes(a.status) === (filter === 'upcoming')),
    [appointments, filter],
  );
  const waiting = appointments.filter((a) => a.status === 'pending').length;

  return (
    <ScreenV3 orbs="c">
      <ScrollView contentContainerStyle={{ paddingBottom: NAV_CLEARANCE + 10 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter.rise(0)} style={styles.head}>
          <Kicker>{L(user.fullName)}</Kicker>
          <H1V3 size={48}>{t('doc.appts.h1')}</H1V3>
          {waiting > 0 && (
            <T size={15} color={v3.muted}>
              {t('doc.waiting', { n: waiting })}
            </T>
          )}
          <SegmentedV3<Filter>
            options={[
              { key: 'upcoming', label: t('doc.upcoming') },
              { key: 'past', label: t('doc.past') },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </Animated.View>

        <View style={{ gap: 16, marginHorizontal: GUTTER_V3, marginTop: 24 }}>
          {list.map((a, i) => (
            <Animated.View key={a.id} entering={enter.slide(1 + i)} exiting={exit.fade} layout={layout}>
              <AppointmentCard appointment={a} tone={tones[i % tones.length]} />
            </Animated.View>
          ))}
          {list.length === 0 && (
            <Glass style={{ gap: 6, paddingVertical: 30 }}>
              <T size={20} weight="light" align="center">
                {t('doc.emptyTitle')}
              </T>
              <T size={14} color={v3.muted} align="center">
                {t('doc.emptyBody')}
              </T>
            </Glass>
          )}
        </View>
      </ScrollView>
    </ScreenV3>
  );
}

function AppointmentCard({ appointment: a, tone }: { appointment: Appointment; tone: ShapeTone }) {
  const { t } = useI18n();
  const { setAppointmentStatus } = useAppStore();
  const [busy, setBusy] = useState(false);
  const initials = a.motherName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const stage =
    a.motherStage === 'Expecting'
      ? t('doc.expecting', { n: a.motherWeek ?? '—' })
      : a.postpartumWeeks != null
        ? t('doc.postpartum', { n: a.postpartumWeeks })
        : t('doc.postpartumNew');

  const set = async (status: AppointmentStatus) => {
    setBusy(true);
    try {
      await setAppointmentStatus(a.id, status);
    } catch (e) {
      console.warn('[appointment]', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Glass style={{ gap: 14 }}>
      <View style={styles.row}>
        <PortraitV3 initials={initials} size={52} tone={tone} />
        <View style={{ flex: 1, gap: 2 }}>
          <T size={20} weight="light" numberOfLines={1}>
            {a.motherName}
          </T>
          <T size={13} color={v3.muted}>
            {stage}
          </T>
        </View>
        <TagV3 label={t(`doc.status.${a.status}` as StringKey)} active={a.status === 'pending'} />
      </View>

      <HRule />
      <View style={styles.facts}>
        <Fact icon={CalendarDays} label={`${t(`day.${a.day}` as StringKey)} · ${a.time}`} />
        <Fact icon={a.mode === 'online' ? Monitor : Building2} label={t(a.mode === 'online' ? 'consult.online' : 'consult.clinic')} />
      </View>
      <T size={14} color={a.reason ? v3.black : v3.muted} style={{ lineHeight: 21 }}>
        {a.reason || t('doc.noReason')}
      </T>
      {!!a.conditions?.length && (
        <View style={styles.tags}>
          {a.conditions.map((c) => (
            <TagV3 key={c} label={t(`cond.${c}` as StringKey)} />
          ))}
        </View>
      )}

      {a.status === 'pending' && (
        <View style={styles.row}>
          <ButtonV3 label={t('doc.decline')} icon={X} variant="glass" disabled={busy} onPress={() => set('declined')} style={styles.action} />
          <ButtonV3 label={t('doc.confirm')} icon={Check} disabled={busy} onPress={() => set('confirmed')} style={styles.action} />
        </View>
      )}
      {a.status === 'confirmed' && <ButtonV3 label={t('doc.complete')} icon={CheckCheck} variant="glass" disabled={busy} onPress={() => set('completed')} />}
    </Glass>
  );
}

function Fact({ icon: Icon, label }: { icon: typeof CalendarDays; label: string }) {
  return (
    <View style={styles.fact}>
      <Icon size={16} color={v3.black} strokeWidth={1.5} />
      <T size={14}>{label}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: GUTTER_V3, paddingTop: 22, gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  fact: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  action: { flex: 1, minHeight: 46 },
});
