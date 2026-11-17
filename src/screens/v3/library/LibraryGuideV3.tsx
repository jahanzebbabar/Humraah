import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';
import { PressableScale } from '@/components/PressableScale';
import { findGuide, guideMinutes, liveGuides } from '@/data/library';
import { ScreenV3, T } from '@/design/v3/kit';
import { GUTTER_V3, radiusV3, v3 } from '@/design/v3/tokens';
import { NAV_CLEARANCE } from '@/theme';
import { BackLink, BlockView, guideHref, LTR, Pill, Rich, SectionLabel } from './LibraryKit';

const ARTICLE_W = 820;

/**
 * A journal guide for one stage of one journal section: every exercise in order, with a table of
 * contents that stays pinned while you read and highlights the exercise on screen.
 */
export default function LibraryGuideV3() {
  const router = useRouter();
  const { cat, stage, at } = useLocalSearchParams<{ cat: string; stage: string; at?: string }>();
  const { width } = useWindowDimensions();
  const found = findGuide(String(cat), String(stage));
  const scroll = useRef<ScrollViewInstance>(null);
  const offsets = useRef<number[]>([]);
  const sectionsTop = useRef(0);
  const [tocH, setTocH] = useState(56);
  const [active, setActive] = useState(-1);
  const [ready, setReady] = useState(false);
  const wide = width >= 720;

  const guides = found?.s.guides ?? [];
  const sectionY = (i: number) => sectionsTop.current + (offsets.current[i] ?? 0) - tocH - 8;
  const jump = (i: number, animated = true) => scroll.current?.scrollTo({ y: Math.max(0, sectionY(i)), animated });

  // Deep links name an exercise (e.g. "1.2"): scroll to it once every section has been measured.
  useEffect(() => {
    if (!ready || !at) return;
    const i = guides.findIndex((g) => g.num === at);
    if (i >= 0) setTimeout(() => jump(i, false), 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, at]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    let cur = -1;
    guides.forEach((_, i) => {
      if (y >= sectionY(i) - 30) cur = i;
    });
    if (cur !== active) setActive(cur);
  };

  if (!found)
    return (
      <ScreenV3 orbs="a">
        <View style={[styles.article, { paddingTop: 30, gap: 16 }]}>
          <BackLink label="Back to the library" onPress={() => router.navigate('/library')} />
          <T latin size={20}>
            This guide could not be found.
          </T>
        </View>
      </ScreenV3>
    );

  const { c, s } = found;
  const backToArea = () => router.navigate({ pathname: '/library', params: { area: c.slug } });
  const back = () => (router.canGoBack() ? router.back() : backToArea());

  if (!s.live || !guides.length) {
    const first = c.stages.find((x) => x.live);
    return (
      <ScreenV3 orbs="a">
        <ScrollView contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
          <View style={[styles.article, LTR, { paddingTop: 22, gap: 16 }]}>
            <BackLink label={`Back to ${c.section}`} onPress={back} />
            <Pill label="Journal guide" kind="journal" />
            <T latin size={wide ? 40 : 30} weight="light" style={{ lineHeight: wide ? 46 : 36 }}>
              {`${s.label} guide`}
            </T>
            <View style={styles.soon}>
              <Rich text={`The ${s.label.toLowerCase()} guide for ${c.title.toLowerCase()} is coming soon. The first trimester guide is ready to read now.`} />
              {first && (
                <PressableScale onPress={() => router.replace(guideHref(c, first))} style={styles.cta}>
                  <T latin size={16} weight="medium" color={v3.white}>
                    {`Read the ${first.label.toLowerCase()} guide`}
                  </T>
                  <ChevronRight size={16} color={v3.white} strokeWidth={1.8} />
                </PressableScale>
              )}
            </View>
          </View>
        </ScrollView>
      </ScreenV3>
    );
  }

  const refs = [...new Set(guides.flatMap((g) => g.refs))];
  const k = liveGuides.findIndex((r) => r.c === c && r.s === s);
  const pv = liveGuides[k - 1];
  const nx = liveGuides[k + 1];

  return (
    <ScreenV3 orbs="a">
      <ScrollView ref={scroll} stickyHeaderIndices={[1]} onScroll={onScroll} scrollEventThrottle={32} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }} showsVerticalScrollIndicator={false}>
        {/* 0: intro */}
        <View style={[styles.article, LTR, { paddingTop: 22, paddingBottom: 18, gap: 12 }]}>
          <BackLink label={`Back to ${c.section}`} onPress={back} />
          <View style={styles.pills}>
            <Pill label="Journal guide" kind="journal" />
            <Pill label={c.section} kind="area" />
          </View>
          <T latin size={wide ? 44 : 32} weight="light" style={{ lineHeight: wide ? 50 : 38, letterSpacing: -1 }}>
            {`${s.label} guide`}
          </T>
          {s.intro && <Rich text={s.intro} size={wide ? 20 : 18.5} color="#4B5A53" />}
          <Rich text={c.overview} />
          <T latin size={14.5} color={v3.muted}>
            {`Covers all ${guides.length} ${s.label.toLowerCase()} exercises in this part of your journal · about ${guideMinutes(s)} min read`}
          </T>
        </View>

        {/* 1: table of contents, pinned while scrolling */}
        <View onLayout={(e) => setTocH(e.nativeEvent.layout.height)} style={styles.tocWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.toc, LTR]}>
            {guides.map((g, i) => {
              const on = i === active;
              return (
                <PressableScale key={g.num} onPress={() => jump(i)} scaleTo={0.96} style={[styles.tocBtn, on && styles.tocOn]}>
                  <T latin size={15} weight="semibold" color={on ? v3.white : v3.black}>
                    {g.num}
                  </T>
                  <T latin size={15} color={on ? v3.white : v3.black}>
                    {g.title}
                  </T>
                </PressableScale>
              );
            })}
          </ScrollView>
        </View>

        {/* 2: the exercises */}
        <View
          style={[styles.article, LTR]}
          onLayout={(e) => {
            sectionsTop.current = e.nativeEvent.layout.y;
          }}
        >
          {guides.map((g, i) => (
            <View
              key={g.num}
              style={styles.section}
              onLayout={(e) => {
                offsets.current[i] = e.nativeEvent.layout.y;
                if (offsets.current.filter((o) => o !== undefined).length === guides.length) setReady(true);
              }}
            >
              <Pill label={`Journal ${g.num} · about ${g.minutes} minutes`} kind="plain" />
              <T latin size={wide ? 30 : 25} weight="light" style={{ lineHeight: wide ? 36 : 31, letterSpacing: -0.5 }}>
                {`${g.num} ${g.title}`}
              </T>
              {g.page && g.page !== g.title && (
                <T latin size={15} color={v3.muted}>
                  {`On the journal page “${g.page}”`}
                </T>
              )}
              <Rich text={g.desc} size={18.5} color="#4B5A53" />
              <View style={{ gap: 12 }}>
                {g.blocks.map((b, j) => (
                  <BlockView key={j} b={b} />
                ))}
              </View>
              <PressableScale onPress={() => scroll.current?.scrollTo({ y: 0, animated: true })} style={styles.top}>
                <ArrowUp size={14} color={v3.black} strokeWidth={1.8} />
                <T latin size={15} weight="medium">
                  Back to top of guide
                </T>
              </PressableScale>
            </View>
          ))}
        </View>

        {/* 3: what's next and sources */}
        <View style={[styles.article, LTR]}>
          <View style={[styles.pager, !wide && { flexDirection: 'column' }]}>
            {pv ? (
              <PressableScale onPress={() => router.replace(guideHref(pv.c, pv.s))} style={styles.pageBtn}>
                <View style={styles.pageLbl}>
                  <ChevronLeft size={14} color={v3.muted} strokeWidth={1.6} />
                  <T latin size={14} color={v3.muted}>
                    Previous guide
                  </T>
                </View>
                <T latin size={16} weight="medium">
                  {pv.c.section}
                </T>
              </PressableScale>
            ) : (
              <View style={{ flex: 1 }} />
            )}
            {nx ? (
              <PressableScale onPress={() => router.replace(guideHref(nx.c, nx.s))} style={[styles.pageBtn, { alignItems: 'flex-end' }]}>
                <View style={styles.pageLbl}>
                  <T latin size={14} color={v3.muted}>
                    Next guide
                  </T>
                  <ChevronRight size={14} color={v3.muted} strokeWidth={1.6} />
                </View>
                <T latin size={16} weight="medium" align="right">
                  {nx.c.section}
                </T>
              </PressableScale>
            ) : (
              <PressableScale onPress={backToArea} style={[styles.pageBtn, { alignItems: 'flex-end' }]}>
                <T latin size={14} color={v3.muted}>
                  Back to
                </T>
                <T latin size={16} weight="medium" align="right">
                  {`${c.section} topics`}
                </T>
              </PressableScale>
            )}
          </View>

          {refs.length > 0 && (
            <View style={styles.sources}>
              <T latin size={17} weight="semibold">
                Sources
              </T>
              {refs.map((r) => (
                <View key={r} style={styles.ref}>
                  <View style={styles.dot} />
                  <T latin size={14.5} color={v3.muted} style={{ flex: 1, lineHeight: 22 }}>
                    {r}
                  </T>
                </View>
              ))}
              <View style={{ marginTop: 6 }}>
                <SectionLabel>Educational only</SectionLabel>
              </View>
              <T latin size={14.5} color={v3.muted} style={{ lineHeight: 22 }}>
                This guide does not diagnose and is not a substitute for care from your doctor, midwife, Lady Health Visitor or a mental health professional.
              </T>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenV3>
  );
}

const styles = StyleSheet.create({
  article: { width: '100%', maxWidth: ARTICLE_W, alignSelf: 'center', paddingHorizontal: GUTTER_V3 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tocWrap: { backgroundColor: 'rgba(244, 243, 240, 0.94)', borderBottomWidth: 1, borderBottomColor: v3.hairline },
  toc: { gap: 8, paddingVertical: 10, paddingHorizontal: GUTTER_V3, minWidth: '100%', justifyContent: 'center' },
  tocBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radiusV3.pill, backgroundColor: v3.white, borderWidth: 1, borderColor: v3.hairline },
  tocOn: { backgroundColor: v3.black, borderColor: v3.black },
  section: { gap: 12, marginTop: 30, paddingTop: 26, borderTopWidth: 1, borderTopColor: v3.hairline },
  top: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 10, paddingVertical: 8 },
  pager: { flexDirection: 'row', gap: 12, marginTop: 30 },
  pageBtn: { flex: 1, gap: 4, padding: 14, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.66)', borderWidth: 1, borderColor: v3.white },
  pageLbl: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sources: { marginTop: 22, padding: 18, gap: 8, borderRadius: radiusV3.inner, backgroundColor: '#FAF9F4', borderWidth: 1, borderColor: v3.hairline },
  ref: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: v3.muted, marginTop: 8 },
  soon: { gap: 14, padding: 18, borderRadius: radiusV3.inner, backgroundColor: 'rgba(255,255,255,0.66)', borderWidth: 1, borderColor: v3.white },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 11, borderRadius: radiusV3.pill, backgroundColor: v3.black },
});
