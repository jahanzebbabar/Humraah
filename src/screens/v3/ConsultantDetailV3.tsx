import { useLocalSearchParams, useRouter } from 'expo-router';
import { CalendarDays, Check } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { bookingDays, bookingTimes, cityKey, doctors, specialtyKey, type Doctor } from '@/data/mock';
import { ButtonV3, Cells, ChoiceV3, ErrorV3, FieldV3, Glass, H1V3, HRule, Kicker, PortraitV3, ScreenV3, SegmentedV3, Stat, T, TagV3, TopBarV3, type ShapeTone } from '@/design/v3/kit';
import { Object3D } from '@/design/v3/Object3D';
import { GUTTER_V3, v3 } from '@/design/v3/tokens';
import { useI18n, type StringKey } from '@/i18n';
import { useAppStore } from '@/store/AppStore';
import { NAV_CLEARANCE } from '@/theme';
import { enter } from '@/theme/motion';

type Day = (typeof bookingDays)[number];
type Mode = 'online' | 'clinic';
const tones: ShapeTone[] = ['lavender', 'rose', 'sage'];

export default function ConsultantDetailV3() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = doctors.find((d) => d.id === id) ?? doctors[0];
  // Keyed by doctor so the form starts fresh whenever a different consultant is opened.
  return <Booking key={doctor.id} doctor={doctor} />;
}

function Booking({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const { t, L } = useI18n();
  const { savePlanner } = useAppStore();
  const [mode, setMode] = useState<Mode>('online');
  const [day, setDay] = useState<Day>();
  const [time, setTime] = useState<string>();
  const [reason, setReason] = useState('');
  const [error, setError] = useState(false);
  const [booked, setBooked] = useState(false);

  const tone = tones[Math.max(0, doctors.indexOf(doctor)) % tones.length];
  const back = () => router.navigate('/consultants');
  const modeLabel = t(mode === 'online' ? 'consult.online' : 'consult.clinic');
  const dayLabel = (d: Day) => t(`day.${d}` as StringKey);

  const confirm = () => {
    if (!day || !time) {
      setError(true);
      return;
    }
    savePlanner({ title: `${L(doctor.name)} · ${dayLabel(day)} ${time}`, category: 'Appointments', priority: 'High', due: 'This week' });
    setBooked(true);
  };

  if (booked) {
    return (
      <ScreenV3 orbs="a">
        <TopBarV3 onBack={back} />
        <Animated.View entering={enter.fade()} style={styles.success}>
          <Glass wrapStyle={{ alignSelf: 'stretch', marginTop: 90 }} style={{ paddingTop: 90, gap: 12, alignItems: 'center' }} breakout={<Object3D kind="calendar" tone={tone} size={140} style={styles.successShape} />}>
            <View style={styles.tick}>
              <Check size={22} color={v3.white} strokeWidth={2} />
            </View>
            <H1V3 size={38} align="center">
              {t('consult.bookedTitle')}
            </H1V3>
            <T size={15} color={v3.muted} align="center">
              {t('consult.bookedBody', { doctor: L(doctor.name), day: day ? dayLabel(day) : '', time: time ?? '', mode: modeLabel })}
            </T>
          </Glass>
          <ButtonV3
            label={t('week.ctaPlanner')}
            icon={CalendarDays}
            onPress={() => router.navigate({ pathname: '/planner', params: { category: 'Appointments', at: String(Date.now()) } })}
            style={{ alignSelf: 'stretch', marginTop: 10 }}
          />
          <ButtonV3 label={t('consult.backToList')} variant="glass" onPress={back} style={{ alignSelf: 'stretch' }} />
        </Animated.View>
      </ScreenV3>
    );
  }

  return (
    <ScreenV3 orbs="b">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TopBarV3 onBack={back} />
        <ScrollView contentContainerStyle={{ paddingBottom: NAV_CLEARANCE + 10 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* A large portrait rises out of the profile panel. */}
          <Glass index={0} wrapStyle={[styles.gutter, { marginTop: 80 }]} style={{ paddingTop: 84, gap: 14 }} breakout={<PortraitV3 initials={L(doctor.initials)} size={132} tone={tone} style={styles.portrait} />}>
            <H1V3 size={36} align="center">
              {L(doctor.name)}
            </H1V3>
            <T size={13} color={v3.muted} align="center">
              {L(doctor.hospital)}
            </T>
            <View style={styles.tags}>
              <TagV3 label={t(cityKey(doctor.city))} />
              <TagV3 label={t(specialtyKey(doctor.specialty))} />
            </View>
            <HRule style={{ marginTop: 6 }} />
            <Cells style={{ marginHorizontal: -14 }}>
              <Stat label={t('v2.consult.rating')} value={doctor.rating.split('/')[0]} size={30} />
              <Stat label={t('v2.consult.years')} value={doctor.years} size={30} />
              <Stat label={t('v3.consult.fee')} value={doctor.fee} size={30} />
            </Cells>
          </Glass>

          <Glass index={1} wrapStyle={[styles.gutter, { marginTop: 18 }]} style={{ gap: 10 }}>
            <Kicker>{t('consult.bio')}</Kicker>
            <T size={16} weight="light" style={{ lineHeight: 25 }}>
              {L(doctor.bio)}
            </T>
            <HRule style={{ marginVertical: 6 }} />
            <T size={13} color={v3.muted}>
              {L(doctor.credentials)}
            </T>
          </Glass>

          <View style={[styles.gutter, { marginTop: 40, marginBottom: 16 }]}>
            <H1V3 size={36}>{t('consult.confirm')}</H1V3>
          </View>

          <Glass index={2} wrapStyle={styles.gutter} style={{ gap: 22 }}>
            <Group label={t('consult.mode')}>
              <SegmentedV3
                options={[
                  { key: 'online' as Mode, label: t('consult.online') },
                  { key: 'clinic' as Mode, label: t('consult.clinic') },
                ]}
                value={mode}
                onChange={setMode}
              />
            </Group>
            <HRule />
            <Group label={t('consult.day')}>
              <ChoiceV3 options={bookingDays} value={day} onChange={(d) => (setDay(d), setError(false))} format={dayLabel} />
            </Group>
            <HRule />
            <Group label={t('consult.time')}>
              <ChoiceV3 options={bookingTimes} value={time} onChange={(v) => (setTime(v), setError(false))} />
            </Group>
            <HRule />
            <Group label={t('consult.reason')}>
              <FieldV3 multiline placeholder={t('consult.reasonPh')} value={reason} onChangeText={setReason} />
            </Group>
            <ErrorV3>{error && t('consult.pickBoth')}</ErrorV3>
            <View style={{ gap: 10 }}>
              <ButtonV3 label={t('consult.confirm')} onPress={confirm} />
              <ButtonV3 label={t('common.cancel')} variant="glass" onPress={back} />
            </View>
          </Glass>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenV3>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ gap: 12 }}>
      <Kicker>{label}</Kicker>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  gutter: { marginHorizontal: GUTTER_V3 },
  portrait: { position: 'absolute', top: -66, alignSelf: 'center' },
  tags: { flexDirection: 'row', gap: 8, justifyContent: 'center', flexWrap: 'wrap' },
  success: { flex: 1, paddingHorizontal: GUTTER_V3, gap: 12, alignItems: 'center' },
  successShape: { position: 'absolute', top: -70, alignSelf: 'center' },
  tick: { width: 44, height: 44, borderRadius: 22, backgroundColor: v3.black, alignItems: 'center', justifyContent: 'center' },
});
