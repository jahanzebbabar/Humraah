/**
 * The Humraah wellbeing library: 88 topics across 8 information areas, plus the journal guides that
 * walk through each exercise in the Humraah journal. Content is English only for now.
 */
import journalJson from './journal.json';
import topicsJson from './topics.json';

export type Block =
  | { h: string }
  | { p: string }
  | { note: string }
  | { ul: string[] }
  | { ol: string[] }
  | { myth: [string, string][] }
  | { flags: { soon: string[]; urgent: string[] } };

export type TopicStage = 'pregnancy' | 'postpartum' | 'both';

export type Topic = {
  id: string;
  title: string;
  section: string;
  stage: TopicStage;
  description: string;
  glance: string[];
  blocks: Block[];
  takeaway: string;
  prompt: string;
  sources: [string, string][];
  slug: string;
  minutes: number;
};

export type JournalGuide = { num: string; title: string; page: string; minutes: number; desc: string; blocks: Block[]; refs: string[] };
export type JournalStage = { key: 't1' | 't2' | 't3' | 'pp'; label: string; live: boolean; intro?: string; guides?: JournalGuide[] };
export type JournalCategory = { id: string; slug: string; title: string; overview: string; section: string; stages: JournalStage[] };

export type Area = { name: string; slug: string; topics: Topic[]; journal?: JournalCategory };

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const norm = (s: string) => s.toLowerCase().replace(/\*\*/g, '').replace(/[’‘]/g, "'");

export function blockText(b: Block): string {
  if ('h' in b) return b.h;
  if ('p' in b) return b.p;
  if ('note' in b) return b.note;
  if ('ul' in b) return b.ul.join(' ');
  if ('ol' in b) return b.ol.join(' ');
  if ('myth' in b) return b.myth.flat().join(' ');
  return b.flags.soon.concat(b.flags.urgent).join(' ');
}

const words = (s: string) => s.split(/\s+/).length;
export const readMinutes = (wordCount: number) => Math.max(2, Math.round(wordCount / 200));

type RawTopic = Omit<Topic, 'slug' | 'minutes'>;

export const topics: Topic[] = (topicsJson as unknown as RawTopic[]).map((x) => {
  const text = [x.title, x.description, x.glance.join(' '), x.blocks.map(blockText).join(' '), x.takeaway, x.prompt].join(' ');
  return {
    ...x,
    // PubMed links are research papers rather than reader-friendly guides.
    sources: x.sources.filter((s) => !/pubmed\.ncbi/.test(s[1])),
    slug: slugify(x.title),
    minutes: readMinutes(words(text)),
  };
});

export const journal = journalJson as unknown as JournalCategory[];

export const areas: Area[] = [...new Set(topics.map((t) => t.section))].map((name) => ({
  name,
  slug: slugify(name),
  topics: topics.filter((t) => t.section === name),
  journal: journal.find((c) => c.section === name),
}));

export const topicBySlug = (slug: string) => topics.find((t) => t.slug === slug);
export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug);
export const areaByName = (name: string) => areas.find((a) => a.name === name);

export const STAGE_SLUG: Record<JournalStage['key'], string> = { t1: 'first-trimester', t2: 'second-trimester', t3: 'third-trimester', pp: 'postpartum' };

/** Every journal guide that is published, in reading order. */
export const liveGuides = journal.flatMap((c) => c.stages.filter((s) => s.live && s.guides).map((s) => ({ c, s })));

export function findGuide(catSlug: string, stageSlug: string) {
  const c = journal.find((j) => j.slug === catSlug);
  const s = c?.stages.find((st) => STAGE_SLUG[st.key] === stageSlug);
  return c && s ? { c, s } : undefined;
}

export const guideMinutes = (s: JournalStage) =>
  readMinutes(words((s.guides ?? []).map((g) => [g.desc, ...g.blocks.map(blockText)].join(' ')).join(' ')));

export const stageLabel = (s: TopicStage) => ({ pregnancy: 'Pregnancy', postpartum: 'Postpartum', both: 'Pregnancy & postpartum' })[s];

/* ------------------------------------------------------------------ search */

const topicIndex = topics.map((t) => ({ t, s: norm([t.title, t.section, t.description, t.glance.join(' '), t.blocks.map(blockText).join(' '), t.takeaway, t.prompt].join(' ')) }));

const guideIndex = liveGuides.flatMap(({ c, s }) =>
  (s.guides ?? []).map((g) => ({ c, s, g, text: norm([g.num, g.title, g.page, g.desc, c.section, s.label, ...g.blocks.map(blockText)].join(' ')) })),
);

export type StageFilter = 'all' | TopicStage;

const stageOk = (t: Topic, st: StageFilter) => st === 'all' || (st === 'both' ? t.stage === 'both' : t.stage === st || t.stage === 'both');

export const filterByStage = (list: Topic[], st: StageFilter) => list.filter((t) => stageOk(t, st));

/** Ranks title matches first, then title-or-summary, then body matches, as the web library does. */
export function searchLibrary(query: string, st: StageFilter = 'all') {
  const terms = norm(query).split(/\s+/).filter(Boolean);
  const hits = topicIndex.filter(({ t, s }) => stageOk(t, st) && terms.every((w) => s.includes(w)));
  const score = (t: Topic) => {
    const title = norm(t.title);
    const desc = norm(t.description);
    if (terms.every((w) => title.includes(w))) return 3;
    if (terms.every((w) => `${title} ${desc}`.includes(w))) return 2;
    return 1;
  };
  const ranked = terms.length ? hits.map((h, i) => ({ h, i, sc: score(h.t) })).sort((a, b) => b.sc - a.sc || a.i - b.i).map((r) => r.h.t) : hits.map((h) => h.t);
  const guides = terms.length ? guideIndex.filter((r) => terms.every((w) => r.text.includes(w))) : [];
  return { topics: ranked, guides };
}

/**
 * Loose matching for the chatbot: score every topic by how many meaningful words of the question it
 * contains, weighting titles. Returns the best few, or nothing for small talk.
 */
const STOP = new Set('a an and are am be but by can do does for from have how i if in is it its me my of on or so that the this to was what when where which who why will with you your im ive dont should could would about after before during get got feel feeling'.split(' '));

export function suggestTopics(question: string, limit = 3): Topic[] {
  const terms = norm(question)
    .replace(/[^a-z0-9' ]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
  if (!terms.length) return [];
  const scored = topicIndex
    .map(({ t, s }) => {
      const title = norm(t.title);
      let sc = 0;
      for (const w of terms) {
        const stem = w.length > 5 ? w.slice(0, -1) : w;
        if (title.includes(stem)) sc += 4;
        if (s.includes(stem)) sc += 1;
      }
      return { t, sc };
    })
    .filter((r) => r.sc >= 2)
    .sort((a, b) => b.sc - a.sc);
  return scored.slice(0, limit).map((r) => r.t);
}
