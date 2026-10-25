import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Cells, CheckV3, Glass, H1V3, LineRow, ScreenV3, Stat, T, TopBarV3 } from '@/design/v3/kit';
import { GUTTER_V3, v3 } from '@/design/v3/tokens';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/AppStore';
import { enter } from '@/theme/motion';

/** Supplements, Design 3: today's doses to tick off. Tests and vaccines live in the planner. */
export default function SupplementsV3() {
  const router = useRouter();
  const { t, L } = useI18n();
  const { supplements, toggleSupplement } = useAppStore();
  const taken = supplements.filter((s) => s.taken).length;

  return (
    <ScreenV3 edges={['top', 'bottom']} orbs="c">
      <TopBarV3 onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter.rise(0)} style={styles.cover}>
          <H1V3 size={44}>{t('supp.title')}</H1V3>
        </Animated.View>

        <Glass index={1} wrapStyle={[styles.gutter, { marginTop: 22 }]}>
          <Cells>
            <Stat label={t('supp.takenToday')} value={taken} />
            <Stat label={t('supp.toDo')} value={supplements.length - taken} />
          </Cells>
        </Glass>

        <Glass index={2} wrapStyle={[styles.gutter, { marginTop: 18 }]} style={{ paddingVertical: 6 }}>
          {supplements.map((s, i) => (
            <LineRow key={s.id} first={i === 0}>
              <CheckV3 checked={s.taken} onPress={() => toggleSupplement(s.id)} />
              <View style={{ flex: 1, gap: 3 }}>
                <T size={16} style={s.taken && styles.struck}>
                  {L(s.name)}
                </T>
                <T size={13} weight="medium">
                  {`${L(s.dose)} · ${L(s.timing)}`}
                </T>
                <T size={13} color={v3.muted}>
                  {L(s.purpose)}
                </T>
                {s.tip && (
                  <T size={13} color={v3.muted} style={{ fontStyle: 'italic' }}>
                    {L(s.tip)}
                  </T>
                )}
              </View>
            </LineRow>
          ))}
        </Glass>

        <T size={12} color={v3.muted} align="center" style={{ marginTop: 18, paddingHorizontal: GUTTER_V3 }}>
          {t('supp.disclaimer')}
        </T>
      </ScrollView>
    </ScreenV3>
  );
}

const styles = StyleSheet.create({
  cover: { paddingHorizontal: GUTTER_V3, marginTop: 18 },
  gutter: { marginHorizontal: GUTTER_V3 },
  struck: { textDecorationLine: 'line-through', color: v3.muted },
});
