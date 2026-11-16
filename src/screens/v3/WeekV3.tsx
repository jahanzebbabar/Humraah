import { useRouter } from 'expo-router';
import { CalendarDays, Stethoscope } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ButtonV3, Cells, Glass, H1V3, HRule, Kicker, LineRow, ScreenV3, Stat, T, TopBarV3 } from '@/design/v3/kit';
import { babyObjectSize, babySizeForWeek, formatCm, formatG } from '@/data/babySize';
import { Object3D } from '@/design/v3/Object3D';
import { GUTTER_V3, v3 } from '@/design/v3/tokens';
import { useI18n, type StringKey } from '@/i18n';
import { useAppStore } from '@/store/AppStore';

const tips: { title: StringKey; body: StringKey }[] = [
  { title: 'week.tip1Title', body: 'week.tip1' },
  { title: 'week.tip2Title', body: 'week.tip2' },
  { title: 'week.tip3Title', body: 'week.tip3' },
];

/** Week detail, Design 3: an editorial feature with numbered sections and a 3D form breaking out of the cover panel. */
export default function WeekV3() {
  const router = useRouter();
  const { t, L } = useI18n();
  const { user } = useAppStore();
  const baby = babySizeForWeek(user.week);

  return (
    <ScreenV3 edges={['top', 'bottom']} orbs="b">
      <TopBarV3 onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.cover}>
          <Kicker>{t('week.sizeOf')}</Kicker>
          <H1V3 size={48}>{L(baby.fruit)}</H1V3>
        </View>

        <Glass wrapStyle={[styles.gutter, { marginTop: 70 }]} style={{ paddingTop: 70 }} breakout={<Object3D kind="corn" size={babyObjectSize(user.week, 150)} style={styles.shape} />}>
          <Cells>
            <Stat label={t('week.length')} value={formatCm(baby.cm)} note={L({ en: 'centimetres', ur: 'سینٹی میٹر' })} />
            <Stat label={t('week.weight')} value={formatG(baby.g)} note={L({ en: 'grams', ur: 'گرام' })} />
            <Stat label={t('home.timeline')} value={user.week} note={L({ en: 'of 40 weeks', ur: '40 ہفتوں میں سے' })} />
          </Cells>
        </Glass>

        <Section number="01" title={t('week.babyTitle')} items={['week.baby1', 'week.baby2', 'week.baby3']} />
        <Section number="02" title={t('week.bodyTitle')} items={['week.body1', 'week.body2', 'week.body3']} />

        <View style={styles.sectionHead}>
          <Kicker>{`03 · ${t('week.tipsTitle')}`}</Kicker>
        </View>
        <Glass wrapStyle={styles.gutter} style={{ paddingVertical: 8 }}>
          {tips.map((tip, i) => (
            <LineRow key={tip.title} first={i === 0}>
              <View style={{ flex: 1, gap: 4 }}>
                <T size={17} weight="regular">
                  {t(tip.title)}
                </T>
                <T size={14} color={v3.muted}>
                  {t(tip.body)}
                </T>
              </View>
            </LineRow>
          ))}
        </Glass>

        <View style={[styles.gutter, { gap: 12, marginTop: 30 }]}>
          <ButtonV3 label={t('week.ctaPlanner')} icon={CalendarDays} onPress={() => router.navigate('/planner')} />
          <ButtonV3 label={t('week.ctaDoctor')} icon={Stethoscope} variant="glass" onPress={() => router.navigate('/consultants')} />
        </View>
      </ScrollView>
    </ScreenV3>
  );
}

function Section({ number, title, items }: { number: string; title: string; items: StringKey[] }) {
  const { t } = useI18n();
  return (
    <>
      <View style={styles.sectionHead}>
        <Kicker>{`${number} · ${title}`}</Kicker>
      </View>
      <Glass wrapStyle={styles.gutter} style={{ paddingVertical: 8 }}>
        {items.map((k, i) => (
          <View key={k}>
            {i > 0 && <HRule />}
            <View style={styles.item}>
              <T size={13} weight="medium" color={v3.muted} style={{ width: 22 }}>
                {i + 1}
              </T>
              <T size={16} weight="light" style={{ flex: 1, lineHeight: 24 }}>
                {t(k)}
              </T>
            </View>
          </View>
        ))}
      </Glass>
    </>
  );
}

const styles = StyleSheet.create({
  cover: { paddingHorizontal: GUTTER_V3, marginTop: 18, gap: 8 },
  gutter: { marginHorizontal: GUTTER_V3 },
  shape: { position: 'absolute', top: -92, alignSelf: 'center' },
  sectionHead: { paddingHorizontal: GUTTER_V3 + 4, marginTop: 34, marginBottom: 14 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 16 },
});
