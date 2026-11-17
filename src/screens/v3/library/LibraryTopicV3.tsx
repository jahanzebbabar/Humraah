import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { ChevronLeft, ChevronRight, Clock, ExternalLink, NotebookPen } from 'lucide-react-native';
import { Linking, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { areaByName, stageLabel, topicBySlug } from '@/data/library';
import { ScreenV3, T } from '@/design/v3/kit';
import { GUTTER_V3, radiusV3, v3 } from '@/design/v3/tokens';
import { NAV_CLEARANCE } from '@/theme';
import { enter } from '@/theme/motion';
import { BackLink, BlockView, Disclaimer, Grid, guideHref, ink, LTR, Pill, Rich, SectionLabel, TopicCard } from './LibraryKit';

const ARTICLE_W = 780;

/** One library topic, laid out as a readable article: summary first, then detail, then where to go next. */
export default function LibraryTopicV3() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { width } = useWindowDimensions();
  const topic = topicBySlug(String(slug));
  const area = topic && areaByName(topic.section);

  const back = () => (router.canGoBack() ? router.back() : router.navigate({ pathname: '/library', params: area ? { area: area.slug } : {} }));

  if (!topic || !area)
    return (
      <ScreenV3 orbs="c">
        <View style={[styles.article, { paddingTop: 30, gap: 16 }]}>
          <BackLink label="Back to the library" onPress={() => router.navigate('/library')} />
          <T latin size={20}>
            This topic could not be found.
          </T>
        </View>
      </ScreenV3>
    );

  const wide = width >= 720;
  const i = area.topics.indexOf(topic);
  const prev = area.topics[i - 1];
  const next = area.topics[i + 1];
  const others = area.topics.filter((x) => x !== topic);
  const related = others.slice(i).concat(others.slice(0, i)).slice(0, 2);
  const live = area.journal?.stages.find((s) => s.live);
  const open = (href: Href) => router.push(href);

  return (
    <ScreenV3 orbs="c">
      <ScrollView contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }} showsVerticalScrollIndicator={false}>
        <View style={[styles.article, LTR]}>
          <View style={{ paddingTop: 22 }}>
            <BackLink label={`Back to ${area.name}`} onPress={back} />
          </View>

          <Animated.View entering={enter.rise(0)} style={{ gap: 12, marginTop: 18 }}>
            <View style={styles.pills}>
              <Pill label={stageLabel(topic.stage)} />
              <Pill label={topic.section} kind="area" />
            </View>
            <T latin size={wide ? 42 : 32} weight="light" style={{ lineHeight: wide ? 48 : 38, letterSpacing: -1 }}>
              {topic.title}
            </T>
            <Rich text={topic.description} size={wide ? 20 : 18.5} color="#4B5A53" />
            <View style={styles.meta}>
              <Clock size={14} color={v3.muted} strokeWidth={1.6} />
              <T latin size={14.5} color={v3.muted}>
                {`About ${topic.minutes} min read`}
              </T>
            </View>
          </Animated.View>

          {topic.glance.length > 0 && (
            <Animated.View entering={enter.rise(1)} style={styles.glance}>
              <SectionLabel>In short</SectionLabel>
              {topic.glance.map((g, k) => (
                <View key={k} style={styles.li}>
                  <View style={styles.tick} />
                  <View style={{ flex: 1 }}>
                    <Rich text={g} size={17} />
                  </View>
                </View>
              ))}
            </Animated.View>
          )}

          <View style={{ gap: 12, marginTop: 6 }}>
            {topic.blocks.map((b, k) => (
              <BlockView key={k} b={b} />
            ))}
          </View>

          <View style={styles.takeaway}>
            <SectionLabel>What to take away</SectionLabel>
            <Rich text={topic.takeaway} size={17.5} color={v3.black} />
          </View>

          <View style={styles.reflect}>
            <SectionLabel>A question to reflect on</SectionLabel>
            <T latin size={21} weight="light" style={{ lineHeight: 31 }}>
              {topic.prompt}
            </T>
          </View>

          {live && area.journal && (
            <PressableScale scaleTo={0.985} onPress={() => open(guideHref(area.journal!, live))} style={styles.jcall}>
              <NotebookPen size={22} color={v3.black} strokeWidth={1.5} />
              <View style={{ flex: 1, gap: 3 }}>
                <T latin size={17} weight="semibold">
                  Writing in your Humraah journal?
                </T>
                <T latin size={15.5} color="#52645C" style={{ lineHeight: 23 }}>
                  {`The ${live.label.toLowerCase()} guide for ${area.name} walks you through every exercise in that part of the journal.`}
                </T>
              </View>
              <ChevronRight size={18} color={v3.black} strokeWidth={1.6} />
            </PressableScale>
          )}

          {related.length > 0 && (
            <View style={{ gap: 10, marginTop: 26 }}>
              <SectionLabel>{`Related in ${area.name}`}</SectionLabel>
              <Grid cols={wide ? 2 : 1} width={Math.min(width, ARTICLE_W) - GUTTER_V3 * 2}>
                {related.map((r) => (
                  <TopicCard key={r.id} topic={r} />
                ))}
              </Grid>
            </View>
          )}

          <View style={[styles.pager, !wide && { flexDirection: 'column' }]}>
            {prev ? (
              <PressableScale onPress={() => router.replace(`/library/topic/${prev.slug}` as Href)} style={styles.pageBtn}>
                <View style={styles.pageLbl}>
                  <ChevronLeft size={14} color={v3.muted} strokeWidth={1.6} />
                  <T latin size={14} color={v3.muted}>
                    Previous
                  </T>
                </View>
                <T latin size={16} weight="medium">
                  {prev.title}
                </T>
              </PressableScale>
            ) : (
              <View style={{ flex: 1 }} />
            )}
            {next ? (
              <PressableScale onPress={() => router.replace(`/library/topic/${next.slug}` as Href)} style={[styles.pageBtn, { alignItems: 'flex-end' }]}>
                <View style={styles.pageLbl}>
                  <T latin size={14} color={v3.muted}>
                    Next
                  </T>
                  <ChevronRight size={14} color={v3.muted} strokeWidth={1.6} />
                </View>
                <T latin size={16} weight="medium" align="right">
                  {next.title}
                </T>
              </PressableScale>
            ) : (
              <PressableScale onPress={() => router.navigate({ pathname: '/library', params: { area: area.slug } })} style={[styles.pageBtn, { alignItems: 'flex-end' }]}>
                <T latin size={14} color={v3.muted}>
                  Back to
                </T>
                <T latin size={16} weight="medium" align="right">
                  {`All ${area.name} topics`}
                </T>
              </PressableScale>
            )}
          </View>

          {topic.sources.length > 0 && (
            <View style={styles.sources}>
              <T latin size={17} weight="semibold">
                Further reading
              </T>
              <T latin size={15} color={v3.muted} style={{ lineHeight: 22 }}>
                These organisations offer reliable, more detailed information. Some are based outside Pakistan, so services and phone numbers may differ from those near you.
              </T>
              {topic.sources.map(([label, url]) => (
                <PressableScale key={url} scaleTo={0.98} onPress={() => Linking.openURL(url).catch(() => {})} style={styles.source}>
                  <T latin size={15.5} color="#426A59" weight="medium" style={{ flex: 1 }}>
                    {label}
                  </T>
                  <ExternalLink size={14} color="#426A59" strokeWidth={1.6} />
                </PressableScale>
              ))}
            </View>
          )}

          <View style={{ marginTop: 18 }}>
            <Disclaimer>
              <T latin size={14.5} weight="semibold" color="#655B49">
                Reminder:{' '}
              </T>
              This guide is educational, not a diagnosis or treatment plan. Contact a qualified professional for advice about your own health or symptoms. Seek urgent care for emergency symptoms.
            </Disclaimer>
          </View>
        </View>
      </ScrollView>
    </ScreenV3>
  );
}

const styles = StyleSheet.create({
  article: { width: '100%', maxWidth: ARTICLE_W, alignSelf: 'center', paddingHorizontal: GUTTER_V3 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  glance: { marginTop: 22, marginBottom: 6, padding: 18, gap: 10, borderRadius: radiusV3.inner, backgroundColor: 'rgba(255,255,255,0.72)', borderWidth: 1, borderColor: v3.white },
  li: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  tick: { width: 8, height: 8, borderRadius: 4, backgroundColor: v3.sage, borderWidth: 1.5, borderColor: ink, marginTop: 9 },
  takeaway: { marginTop: 26, padding: 18, gap: 8, borderRadius: radiusV3.inner, backgroundColor: 'rgba(197, 214, 192, 0.5)', borderStartWidth: 3, borderStartColor: v3.black },
  reflect: { marginTop: 14, padding: 18, gap: 8, borderRadius: radiusV3.inner, backgroundColor: 'rgba(232, 191, 196, 0.3)', borderWidth: 1, borderColor: v3.edge },
  jcall: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14, padding: 18, borderRadius: radiusV3.inner, backgroundColor: 'rgba(207, 198, 230, 0.45)', borderWidth: 1, borderColor: v3.edge },
  pager: { flexDirection: 'row', gap: 12, marginTop: 22 },
  pageBtn: { flex: 1, gap: 4, padding: 14, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.66)', borderWidth: 1, borderColor: v3.white },
  pageLbl: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sources: { marginTop: 22, padding: 18, gap: 8, borderRadius: radiusV3.inner, backgroundColor: '#FAF9F4', borderWidth: 1, borderColor: v3.hairline },
  source: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
});
