import { useRouter, type Href } from 'expo-router';
import { ArrowLeft, Baby, Brain, CalendarHeart, Clock, Flower2, HeartPulse, Milk, Sparkles, Users, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { PressableScale } from '@/components/PressableScale';
import { layoutDirection } from '@/components/Screen';
import { stageLabel, type Block, type JournalCategory, type JournalGuide, type JournalStage, type Topic, STAGE_SLUG } from '@/data/library';
import { T } from '@/design/v3/kit';
import { radiusV3, v3 } from '@/design/v3/tokens';

/** Library content is written in English, so it always reads left to right even in the Urdu UI. */
export const LTR = layoutDirection('ltr');

export const ink = '#33403A';

/** One icon and soft tone per information area, so each area is recognisable at a glance. */
export const areaLook: Record<string, { icon: LucideIcon; tint: string }> = {
  'Understanding Your Pregnancy': { icon: Baby, tint: 'rgba(197, 214, 192, 0.55)' },
  'Your Body and Confidence': { icon: Sparkles, tint: 'rgba(232, 191, 196, 0.5)' },
  'Mental and Emotional Wellbeing': { icon: Brain, tint: 'rgba(207, 198, 230, 0.6)' },
  'Preparing for Childbirth and Motherhood': { icon: CalendarHeart, tint: 'rgba(232, 191, 196, 0.5)' },
  'Postpartum Recovery and Wellbeing': { icon: HeartPulse, tint: 'rgba(197, 214, 192, 0.55)' },
  'Feeding, Bonding and Early Motherhood': { icon: Milk, tint: 'rgba(207, 198, 230, 0.6)' },
  'Relationships, Identity and Social Wellbeing': { icon: Users, tint: 'rgba(197, 214, 192, 0.55)' },
  'Everyday Self-Care and Personal Wellbeing': { icon: Flower2, tint: 'rgba(232, 191, 196, 0.5)' },
};

export function AreaIcon({ name, size = 38 }: { name: string; size?: number }) {
  const look = areaLook[name] ?? { icon: Sparkles, tint: v3.glassStrong };
  const Icon = look.icon;
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.34, backgroundColor: look.tint, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: v3.edge }}>
      <Icon size={size * 0.48} color={v3.black} strokeWidth={1.5} />
    </View>
  );
}

/* ------------------------------------------------------------------ text */

/** Text with `**bold**` spans, the markup the library content is written in. */
export function Rich({ text, size = 15.5, color = ink, weight = 'regular', style }: { text: string; size?: number; color?: string; weight?: 'light' | 'regular' | 'medium'; style?: object }) {
  const parts = text.split(/\*\*(.+?)\*\*/);
  return (
    <T latin size={size} color={color} weight={weight} style={[{ lineHeight: Math.round(size * 1.62) }, style]}>
      {parts.map((p, i) =>
        i % 2 ? (
          <T key={i} latin size={size} weight="semibold" color={v3.black}>
            {p}
          </T>
        ) : (
          p
        ),
      )}
    </T>
  );
}

export function Pill({ label, kind = 'stage' }: { label: string; kind?: 'stage' | 'area' | 'journal' | 'plain' }) {
  const bg = { stage: 'rgba(197, 214, 192, 0.6)', area: 'rgba(232, 191, 196, 0.45)', journal: 'rgba(207, 198, 230, 0.6)', plain: v3.glassStrong }[kind];
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <T latin size={10.5} weight="semibold" style={{ letterSpacing: 0.6, textTransform: 'uppercase' }}>
        {label}
      </T>
    </View>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <T latin size={11} weight="semibold" color={v3.muted} style={{ letterSpacing: 1.3, textTransform: 'uppercase' }}>
      {children}
    </T>
  );
}

/* ---------------------------------------------------------------- blocks */

export function BlockView({ b }: { b: Block }) {
  if ('h' in b)
    return (
      <T latin size={19} weight="semibold" style={{ marginTop: 22, lineHeight: 26 }}>
        {b.h}
      </T>
    );
  if ('p' in b) return <Rich text={b.p} />;
  if ('note' in b)
    return (
      <View style={styles.note}>
        <Rich text={b.note} />
      </View>
    );
  if ('ul' in b || 'ol' in b) {
    const ordered = 'ol' in b;
    const list = ordered ? b.ol : b.ul;
    return (
      <View style={{ gap: 8 }}>
        {list.map((item, i) => (
          <View key={i} style={styles.li}>
            {ordered ? (
              <View style={styles.num}>
                <T latin size={12} weight="semibold" color={v3.white}>
                  {i + 1}
                </T>
              </View>
            ) : (
              <View style={styles.bullet} />
            )}
            <View style={{ flex: 1 }}>
              <Rich text={item} />
            </View>
          </View>
        ))}
      </View>
    );
  }
  if ('myth' in b)
    return (
      <View style={{ gap: 10, marginVertical: 4 }}>
        {b.myth.map(([m, r], i) => (
          <View key={i} style={styles.myth}>
            <View style={[styles.mythHalf, { backgroundColor: '#FAF4EC' }]}>
              <SectionLabel>You may hear</SectionLabel>
              <Rich text={m} size={14.5} color="#6F5F45" />
            </View>
            <View style={styles.mythHalf}>
              <SectionLabel>What we know</SectionLabel>
              <Rich text={r} size={14.5} />
            </View>
          </View>
        ))}
      </View>
    );
  const f = b.flags;
  return (
    <View style={{ gap: 12, marginVertical: 10 }}>
      {f.soon.length > 0 && (
        <View style={[styles.flag, styles.soon]}>
          <T latin size={15} weight="semibold" color="#5F5234">
            Contact your doctor, midwife or Lady Health Visitor soon if:
          </T>
          {f.soon.map((x, i) => (
            <View key={i} style={styles.li}>
              <View style={[styles.bullet, { backgroundColor: '#5F5234' }]} />
              <View style={{ flex: 1 }}>
                <Rich text={x} size={14.5} color="#5F5234" />
              </View>
            </View>
          ))}
        </View>
      )}
      {f.urgent.length > 0 && (
        <View style={[styles.flag, styles.urgent]}>
          <T latin size={15} weight="semibold" color="#6E2F26">
            Get urgent care now if:
          </T>
          {f.urgent.map((x, i) => (
            <View key={i} style={styles.li}>
              <View style={[styles.bullet, { backgroundColor: '#6E2F26' }]} />
              <View style={{ flex: 1 }}>
                <Rich text={x} size={14.5} color="#6E2F26" />
              </View>
            </View>
          ))}
          <T latin size={12.5} color="#6E2F26" style={{ marginTop: 4 }}>
            Go to the nearest hospital emergency department or call an ambulance (such as Rescue 1122, where available). Don’t wait for a routine appointment.
          </T>
        </View>
      )}
    </View>
  );
}

/* ----------------------------------------------------------------- cards */

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n).replace(/\s+\S*$/, '')}…` : s);

export function TopicCard({ topic, showArea, style }: { topic: Topic; showArea?: boolean; style?: StyleProp<ViewStyle> }) {
  const router = useRouter();
  return (
    <PressableScale scaleTo={0.985} onPress={() => router.push(`/library/topic/${topic.slug}` as Href)} style={[styles.card, LTR, style]}>
      <View style={styles.pills}>
        <Pill label={stageLabel(topic.stage)} />
        {showArea && <Pill label={topic.section} kind="area" />}
      </View>
      <T latin size={17} weight="medium" style={{ lineHeight: 23 }}>
        {topic.title}
      </T>
      <T latin size={13.5} color={v3.muted} style={{ lineHeight: 20, flex: 1 }}>
        {clip(topic.description, 170)}
      </T>
      <View style={styles.cardFoot}>
        <Clock size={13} color={v3.muted} strokeWidth={1.6} />
        <T latin size={12} color={v3.muted}>
          {topic.minutes} min read
        </T>
      </View>
    </PressableScale>
  );
}

export const guideHref = (c: JournalCategory, s: JournalStage, at?: string) =>
  ({ pathname: '/library/guide/[cat]/[stage]', params: at ? { cat: c.slug, stage: STAGE_SLUG[s.key], at } : { cat: c.slug, stage: STAGE_SLUG[s.key] } }) as Href;

export function GuideCard({ c, s, g, style }: { c: JournalCategory; s: JournalStage; g: JournalGuide; style?: StyleProp<ViewStyle> }) {
  const router = useRouter();
  return (
    <PressableScale scaleTo={0.985} onPress={() => router.push(guideHref(c, s, g.num))} style={[styles.card, LTR, style]}>
      <View style={styles.pills}>
        <Pill label="Journal guide" kind="journal" />
        <Pill label={c.section} kind="area" />
      </View>
      <T latin size={17} weight="medium" style={{ lineHeight: 23 }}>
        {`${s.label} · ${g.num} ${g.title}`}
      </T>
      <T latin size={13.5} color={v3.muted} style={{ lineHeight: 20 }}>
        {clip(g.desc, 150)}
      </T>
    </PressableScale>
  );
}

/** Lays children out in an even grid of `cols` columns that share `width`. */
export function Grid({ children, cols, width, gap = 12 }: { children: ReactNode[]; cols: number; width: number; gap?: number }) {
  const w = cols > 1 ? Math.floor((width - gap * (cols - 1)) / cols) : undefined;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
      {children.map((child, i) => (
        <View key={i} style={w ? { width: w } : { width: '100%' }}>
          {child}
        </View>
      ))}
    </View>
  );
}

export function BackLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.97} style={[styles.back, LTR]}>
      <ArrowLeft size={16} color={v3.black} strokeWidth={1.8} />
      <T latin size={14} weight="medium">
        {label}
      </T>
    </PressableScale>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <View style={styles.disclaimer}>
      <T latin size={12.5} color="#655B49" style={{ lineHeight: 19 }}>
        {children}
      </T>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: radiusV3.pill, alignSelf: 'flex-start' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  note: { padding: 16, borderRadius: 16, borderStartWidth: 3, borderStartColor: v3.black, backgroundColor: 'rgba(197, 214, 192, 0.42)', marginVertical: 6 },
  li: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: v3.black, marginTop: 10 },
  num: { width: 22, height: 22, borderRadius: 11, backgroundColor: v3.black, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  myth: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: v3.hairline, backgroundColor: v3.white },
  mythHalf: { padding: 14, gap: 4 },
  flag: { borderRadius: 18, padding: 16, gap: 8, borderWidth: 1 },
  soon: { backgroundColor: '#FBF6EA', borderColor: '#ECDCB4' },
  urgent: { backgroundColor: '#FBEEEC', borderColor: '#EFC6BF' },
  card: { flex: 1, minHeight: 170, gap: 9, padding: 18, borderRadius: radiusV3.inner, backgroundColor: 'rgba(255, 255, 255, 0.66)', borderWidth: 1, borderColor: v3.white },
  cardFoot: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 14, borderRadius: radiusV3.pill, backgroundColor: v3.glassStrong, borderWidth: 1, borderColor: v3.edge },
  disclaimer: { padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#EADFCA', backgroundColor: '#FBF7EF' },
});
