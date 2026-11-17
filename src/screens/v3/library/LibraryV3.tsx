import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, ChevronRight, NotebookPen, Search } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View, type ScrollViewInstance } from 'react-native';
import Animated from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { areaBySlug, areas, filterByStage, liveGuides, searchLibrary, topics, type Area, type StageFilter } from '@/data/library';
import { FieldV3, Glass, H1V3, Kicker, ScreenV3, T, TagV3 } from '@/design/v3/kit';
import { GUTTER_V3, radiusV3, v3 } from '@/design/v3/tokens';
import { useI18n, type StringKey } from '@/i18n';
import { NAV_CLEARANCE } from '@/theme';
import { enter } from '@/theme/motion';
import { AreaIcon, Disclaimer, Grid, GuideCard, guideHref, LTR, SectionLabel, TopicCard } from './LibraryKit';

const STAGES: { key: StageFilter; label: StringKey }[] = [
  { key: 'all', label: 'lib.stage.all' },
  { key: 'pregnancy', label: 'lib.stage.pregnancy' },
  { key: 'postpartum', label: 'lib.stage.postpartum' },
  { key: 'both', label: 'lib.stage.both' },
];

/** Sidebar appears beside the content from this width; below it, areas become a chip row. */
const SIDEBAR_AT = 980;
const MAX_W = 1200;

/**
 * The wellbeing library: every topic from Ask Humraah organised into eight information areas, with
 * the Humraah journal guides alongside. Search spans everything; the stage filter narrows an area.
 */
export default function LibraryV3() {
  const router = useRouter();
  const { t } = useI18n();
  const params = useLocalSearchParams<{ area?: string }>();
  const { width } = useWindowDimensions();
  const scroll = useRef<ScrollViewInstance>(null);
  const [areaSlug, setAreaSlug] = useState(params.area && areaBySlug(params.area) ? params.area : areas[0].slug);
  const [query, setQuery] = useState('');
  const [stage, setStage] = useState<StageFilter>('all');
  const [mainW, setMainW] = useState(0);

  // A link into a specific area (from an article's "Back to…") switches the page to that area.
  const [seenArea, setSeenArea] = useState(params.area);
  if (params.area !== seenArea) {
    setSeenArea(params.area);
    if (params.area && areaBySlug(params.area)) {
      setAreaSlug(params.area);
      setQuery('');
    }
  }

  const area = areaBySlug(areaSlug) ?? areas[0];
  const searching = query.trim().length > 0;
  const results = useMemo(() => (searching ? searchLibrary(query, stage) : null), [query, searching, stage]);
  const list = useMemo(() => filterByStage(area.topics, stage), [area, stage]);

  const sidebar = width >= SIDEBAR_AT;
  const pageW = Math.min(width, MAX_W);
  const cols = mainW >= 1000 ? 3 : mainW >= 600 ? 2 : 1;

  const pick = (a: Area) => {
    setAreaSlug(a.slug);
    setQuery('');
    if (!sidebar) scroll.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <ScreenV3 orbs="b">
      <ScrollView ref={scroll} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={[styles.page, { maxWidth: MAX_W }]}>
          {/* Hero */}
          <Glass index={0} wrapStyle={{ marginTop: 22 }} style={[styles.hero, pageW >= 700 && { padding: 34 }]}>
            <View style={styles.heroRow}>
              <View style={{ flex: 1, gap: 10, minWidth: 260 }}>
                <Kicker>{t('lib.kicker')}</Kicker>
                <H1V3 size={pageW >= 700 ? 52 : 38}>{t('lib.title')}</H1V3>
                <T size={17.5} weight="light" style={{ lineHeight: 27, maxWidth: 680 }}>
                  {t('lib.lead')}
                </T>
              </View>
              <View style={[styles.stats, pageW < 700 && { width: '100%' }]}>
                {[
                  [topics.length, t('lib.topics')],
                  [areas.length, t('lib.areas')],
                  [liveGuides.length, t('lib.guides')],
                ].map(([n, label]) => (
                  <View key={String(label)} style={styles.stat}>
                    <T size={30} weight="extraLight" style={{ lineHeight: 34 }}>
                      {n}
                    </T>
                    <T size={14} color={v3.muted}>
                      {label}
                    </T>
                  </View>
                ))}
              </View>
            </View>
          </Glass>

          {/* Search and stage filter */}
          <Animated.View entering={enter.rise(1)} style={[styles.toolbar, pageW >= 760 && { flexDirection: 'row', alignItems: 'center' }]}>
            <View style={{ flex: 1 }}>
              <FieldV3 icon={Search} placeholder={t('lib.search')} value={query} onChangeText={setQuery} returnKeyType="search" autoCorrect={false} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, alignItems: 'center' }}>
              {STAGES.map((s) => (
                <TagV3 key={s.key} label={t(s.label)} active={stage === s.key} onPress={() => setStage(s.key)} />
              ))}
            </ScrollView>
          </Animated.View>

          {/* Area chips on phones and tablets */}
          {!sidebar && !searching && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -GUTTER_V3 }} contentContainerStyle={styles.chips}>
              {areas.map((a) => (
                <TagV3 key={a.slug} label={a.name} active={a.slug === area.slug} count={filterByStage(a.topics, stage).length} onPress={() => pick(a)} />
              ))}
            </ScrollView>
          )}

          <View style={[styles.body, sidebar && { flexDirection: 'row', alignItems: 'flex-start' }]}>
            {sidebar && (
              <View style={styles.sidebar}>
                <View style={{ paddingHorizontal: 10, paddingBottom: 8 }}>
                  <Kicker>{t('lib.explore')}</Kicker>
                </View>
                {areas.map((a) => {
                  const active = a.slug === area.slug && !searching;
                  return (
                    <View key={a.slug}>
                      <PressableScale scaleTo={0.98} onPress={() => pick(a)} style={[styles.navRow, LTR, active && styles.navActive]}>
                        <AreaIcon name={a.name} size={30} />
                        <T latin size={15.5} weight={active ? 'medium' : 'regular'} style={{ flex: 1 }} numberOfLines={2}>
                          {a.name}
                        </T>
                        <T latin size={14} color={v3.muted}>
                          {filterByStage(a.topics, stage).length}
                        </T>
                      </PressableScale>
                      {active && a.journal && (
                        <View style={styles.subnav}>
                          {a.journal.stages.map((s) => (
                            <PressableScale key={s.key} disabled={!s.live} onPress={() => router.push(guideHref(a.journal!, s))} style={[styles.subRow, LTR, !s.live && { opacity: 0.45 }]}>
                              <NotebookPen size={14} color={v3.black} strokeWidth={1.5} />
                              <T latin size={14.5} style={{ flex: 1 }}>
                                {s.label} guide
                              </T>
                              <T latin size={12.5} color={v3.muted}>
                                {s.live ? 'read' : 'soon'}
                              </T>
                            </PressableScale>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            <View style={{ flex: 1, minWidth: 0 }} onLayout={(e) => setMainW(e.nativeEvent.layout.width)}>
              {results ? (
                <View style={{ gap: 14 }}>
                  <View style={[styles.areaHead, LTR]}>
                    <View style={{ flex: 1, gap: 4 }}>
                      <T size={26} weight="light">
                        {`${t('lib.results')}: “${query.trim()}”`}
                      </T>
                      <T latin size={15} color={v3.muted}>
                        {`${results.topics.length} topic${results.topics.length === 1 ? '' : 's'}${results.guides.length ? ` · ${results.guides.length} journal guide section${results.guides.length === 1 ? '' : 's'}` : ''}`}
                      </T>
                    </View>
                    <TagV3 label={t('lib.clear')} onPress={() => setQuery('')} />
                  </View>
                  {results.guides.length > 0 && (
                    <>
                      <SectionLabel>{t('lib.fromGuides')}</SectionLabel>
                      <Grid cols={cols} width={mainW}>
                        {results.guides.map((r) => (
                          <GuideCard key={`${r.c.id}${r.g.num}`} c={r.c} s={r.s} g={r.g} />
                        ))}
                      </Grid>
                    </>
                  )}
                  {results.topics.length > 0 && (
                    <Grid cols={cols} width={mainW}>
                      {results.topics.map((tp) => (
                        <TopicCard key={tp.id} topic={tp} showArea />
                      ))}
                    </Grid>
                  )}
                  {!results.topics.length && !results.guides.length && (
                    <View style={styles.empty}>
                      <BookOpen size={26} color={v3.muted} strokeWidth={1.4} />
                      <T size={16} color={v3.muted} align="center">
                        {t('lib.empty')}
                      </T>
                    </View>
                  )}
                </View>
              ) : (
                <View key={area.slug} style={{ gap: 16 }}>
                  <Animated.View entering={enter.fade(0)} style={[styles.areaHead, LTR]}>
                    <AreaIcon name={area.name} size={48} />
                    <View style={{ flex: 1, gap: 2 }}>
                      <T latin size={pageW >= 700 ? 28 : 23} weight="light" style={{ lineHeight: pageW >= 700 ? 34 : 29, letterSpacing: -0.5 }}>
                        {area.name}
                      </T>
                      <T latin size={15} color={v3.muted}>
                        {`${list.length} topic${list.length === 1 ? '' : 's'} · Select a topic to read it`}
                      </T>
                    </View>
                  </Animated.View>

                  {area.journal && (
                    <View style={[styles.journal, LTR]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <NotebookPen size={16} color={v3.black} strokeWidth={1.5} />
                        <SectionLabel>Your journal guide, by stage</SectionLabel>
                      </View>
                      <View style={styles.stageRow}>
                        {area.journal.stages.map((s) =>
                          s.live ? (
                            <PressableScale key={s.key} onPress={() => router.push(guideHref(area.journal!, s))} style={[styles.stagePill, styles.stageLive]}>
                              <T latin size={15} weight="medium" color={v3.white}>
                                {`${s.label} guide`}
                              </T>
                              <ChevronRight size={14} color={v3.white} strokeWidth={1.8} />
                            </PressableScale>
                          ) : (
                            <View key={s.key} style={[styles.stagePill, { opacity: 0.55 }]}>
                              <T latin size={15}>{`${s.label} · coming soon`}</T>
                            </View>
                          ),
                        )}
                      </View>
                    </View>
                  )}

                  {list.length ? (
                    <Grid cols={cols} width={mainW}>
                      {list.map((tp) => (
                        <TopicCard key={tp.id} topic={tp} />
                      ))}
                    </Grid>
                  ) : (
                    <View style={styles.empty}>
                      <T size={16} color={v3.muted} align="center">
                        {t('lib.empty')}
                      </T>
                    </View>
                  )}
                </View>
              )}

              <View style={{ marginTop: 22 }}>
                <Disclaimer>{t('lib.disclaimer')}</Disclaimer>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenV3>
  );
}

const styles = StyleSheet.create({
  page: { width: '100%', alignSelf: 'center', paddingHorizontal: GUTTER_V3 },
  hero: { padding: 24 },
  heroRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', gap: 22 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, minWidth: 92, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: v3.edge },
  toolbar: { marginTop: 18, gap: 12 },
  chips: { gap: 8, paddingHorizontal: GUTTER_V3, paddingTop: 14, alignItems: 'center' },
  body: { marginTop: 22, gap: 22 },
  sidebar: { width: 290, padding: 12, borderRadius: radiusV3.inner, backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: v3.white, gap: 2 },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 8, borderRadius: 14 },
  navActive: { backgroundColor: v3.white },
  subnav: { marginStart: 24, marginVertical: 4, paddingStart: 10, borderStartWidth: 2, borderStartColor: v3.hairline, gap: 2 },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, paddingHorizontal: 8, borderRadius: 10 },
  areaHead: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  journal: { padding: 16, borderRadius: radiusV3.inner, backgroundColor: 'rgba(207, 198, 230, 0.32)', borderWidth: 1, borderColor: v3.edge, gap: 12 },
  stageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stagePill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radiusV3.pill, backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: v3.hairline },
  stageLive: { backgroundColor: v3.black, borderColor: v3.black },
  empty: { alignItems: 'center', gap: 10, padding: 34, borderRadius: radiusV3.inner, backgroundColor: 'rgba(255,255,255,0.5)' },
});
