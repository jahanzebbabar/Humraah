import { useRouter } from 'expo-router';
import { ArrowRight, Search } from 'lucide-react-native';
import { useMemo, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { cityKey, cityOptions, specialtyKey, specialtyOptions, type City, type Doctor, type Specialty } from '@/data/mock';
import { ButtonV3, Cells, FieldV3, Glass, H1V3, HRule, Kicker, PortraitV3, ScreenV3, Stat, T, TagV3, type ShapeTone } from '@/design/v3/kit';
import { GUTTER_V3, v3 } from '@/design/v3/tokens';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/AppStore';
import { NAV_CLEARANCE } from '@/theme';
import { enter, exit, layout } from '@/theme/motion';

const tones: ShapeTone[] = ['lavender', 'rose', 'sage'];

/** Doctor directory, Design 3: each portrait breaks out above its glass card; facts sit in a hairline grid. */
export default function ConsultantsV3() {
  const { t } = useI18n();
  const { specialists, user } = useAppStore();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState<'all' | City>('all');
  const [specialty, setSpecialty] = useState<'all' | Specialty>('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = specialists.filter(
      (d) =>
        (!q || [d.name.en, d.name.ur, d.hospital.en, d.hospital.ur].some((s) => s.toLowerCase().includes(q))) &&
        (city === 'all' || d.city === city) &&
        (specialty === 'all' || d.specialty === specialty),
    );
    // The mother's chosen doctor leads the list.
    return [...list.filter((d) => d.id === user.myDoctorId), ...list.filter((d) => d.id !== user.myDoctorId)];
  }, [specialists, query, city, specialty, user.myDoctorId]);

  return (
    <ScreenV3 orbs="c">
      <ScrollView contentContainerStyle={{ paddingBottom: NAV_CLEARANCE + 10 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter.rise(0)} style={styles.head}>
          <H1V3 size={48}>{t('v3.consult.h1')}</H1V3>
          <FieldV3 icon={Search} placeholder={t('consult.search')} value={query} onChangeText={setQuery} returnKeyType="search" />
        </Animated.View>

        <TagRow>
          {cityOptions.map((c) => (
            <TagV3 key={c} label={t(cityKey(c))} active={c === city} onPress={() => setCity(c)} />
          ))}
        </TagRow>
        <TagRow>
          {specialtyOptions.map((s) => (
            <TagV3 key={s} label={t(specialtyKey(s))} active={s === specialty} onPress={() => setSpecialty(s)} />
          ))}
        </TagRow>

        <View style={styles.count}>
          <Kicker>{`${t('consult.results')} · ${results.length}`}</Kicker>
          <T size={12} color={v3.muted} style={{ marginTop: 4 }}>
            {t('consult.registeredOnly')}
          </T>
        </View>

        <View style={{ gap: 30, marginHorizontal: GUTTER_V3, marginTop: 58 }}>
          {results.map((d, i) => (
            <Animated.View key={d.id} entering={enter.slide(1 + i)} exiting={exit.fade} layout={layout}>
              <DoctorCard doctor={d} mine={d.id === user.myDoctorId} tone={tones[specialists.indexOf(d) % tones.length]} />
            </Animated.View>
          ))}
          {results.length === 0 && (
            <Glass style={{ gap: 6, paddingVertical: 30 }}>
              <T size={20} weight="light" align="center">
                {t('consult.emptyTitle')}
              </T>
              <T size={14} color={v3.muted} align="center">
                {t('consult.emptyBody')}
              </T>
            </Glass>
          )}
        </View>
      </ScrollView>
    </ScreenV3>
  );
}

function TagRow({ children }: { children: ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagRow}>
      {children}
    </ScrollView>
  );
}

function DoctorCard({ doctor: d, tone, mine }: { doctor: Doctor; tone: ShapeTone; mine: boolean }) {
  const router = useRouter();
  const { t, L } = useI18n();
  const open = () => router.navigate({ pathname: '/consultants/[id]', params: { id: d.id } });
  return (
    <Glass style={{ paddingTop: 56, gap: 16 }} breakout={<PortraitV3 initials={L(d.initials)} size={88} tone={tone} style={styles.portrait} />}>
      {/* Body and button are sibling pressables; nesting buttons is invalid on web. */}
      <PressableScale onPress={open} scaleTo={0.99} haptic={false} style={{ gap: 16 }}>
        <View style={{ gap: 4 }}>
          <T size={24} weight="light" style={{ letterSpacing: -0.5, lineHeight: 30 }}>
            {L(d.name)}
          </T>
          <T size={13} color={v3.muted} numberOfLines={1}>
            {L(d.hospital)}
          </T>
        </View>
        <View style={styles.tags}>
          {mine && <TagV3 label={t('consult.isMine')} active />}
          <TagV3 label={t(cityKey(d.city))} />
          <TagV3 label={t(specialtyKey(d.specialty))} />
        </View>
        <HRule />
        <Cells style={{ marginHorizontal: -14 }}>
          <Stat label={t('v2.consult.rating')} value={d.rating.split('/')[0]} size={30} />
          <Stat label={t('v2.consult.years')} value={d.years} size={30} />
          <Stat label={t('v3.consult.fee')} value={d.fee} size={30} />
        </Cells>
        <HRule />
      </PressableScale>
      <View style={styles.foot}>
        <T size={13} color={v3.muted} style={{ flex: 1 }}>
          {t('consult.next', { when: L(d.next) })}
        </T>
        <ButtonV3 label={t('consult.viewProfile')} icon={ArrowRight} onPress={open} style={{ minHeight: 46, paddingHorizontal: 20 }} />
      </View>
    </Glass>
  );
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: GUTTER_V3, paddingTop: 22, gap: 20 },
  tagRow: { gap: 8, paddingHorizontal: GUTTER_V3, paddingTop: 12 },
  count: { paddingHorizontal: GUTTER_V3 + 4, marginTop: 24 },
  portrait: { position: 'absolute', top: -38, start: 20 },
  tags: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  foot: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
