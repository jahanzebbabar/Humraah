// Copied from the Humraah server (server/ai/knowledgeBase.ts) for the Vercel chat function in api/ai/chat.ts.
export interface KnowledgeSnippet {
  id: string;
  stage: 'preconception' | 'pregnancy' | 'postpartum' | 'parenting' | 'general';
  category: 'nutrition' | 'symptoms' | 'warning_signs' | 'supplements' | 'care' | 'mental_health';
  title: string;
  keywords: string[];
  summary: string;
  guidelineSource: string;
}

export const HUMRAAH_KNOWLEDGE_BASE: KnowledgeSnippet[] = [
  // PRECONCEPTION
  {
    id: 'kb-pre-folic',
    stage: 'preconception',
    category: 'supplements',
    title: 'Preconceptional Folic Acid Supplementation',
    keywords: ['folic acid', 'planning', 'conceive', 'conception', 'neural tube', 'folate'],
    summary: 'WHO and SOGP recommend starting 400 mcg (0.4 mg) of Folic Acid daily at least 1–3 months before conception to prevent neural tube defects such as spina bifida. Continue through the 12th week of pregnancy.',
    guidelineSource: 'WHO & Society of Obstetricians & Gynaecologists of Pakistan (SOGP)',
  },
  {
    id: 'kb-pre-nutrition',
    stage: 'preconception',
    category: 'nutrition',
    title: 'Preconception Iron and Balanced Nutrition in Pakistan',
    keywords: ['iron', 'anemia', 'spinach', 'palak', 'meat', 'dates', 'khajoor', 'diet'],
    summary: 'Maternal anemia affects over 40% of Pakistani women. Incorporate iron-rich foods (lean meat, lentils, daal, palak) paired with vitamin C (lemons, oranges) for maximum absorption. Avoid chai/coffee immediately after meals as tannins inhibit iron absorption.',
    guidelineSource: 'National Maternal Nutrition Guidelines, Pakistan',
  },

  // PREGNANCY
  {
    id: 'kb-preg-redflags',
    stage: 'pregnancy',
    category: 'warning_signs',
    title: 'Obstetric Danger Signs Requiring Immediate Emergency Care',
    keywords: ['bleeding', 'severe headache', 'blurred vision', 'swelling', 'reduced kicks', 'water broken', 'fever', 'chills', 'danger', 'emergency'],
    summary: 'Red-flag danger signs require emergency hospital evaluation: heavy vaginal bleeding, severe persistent fronto-temporal headache with vision flashes/blurring (preeclampsia warning), sudden swelling of hands/face, fever > 101°F, reduced fetal movements (< 10 kicks in 2 hours), or gush of fluid.',
    guidelineSource: 'WHO & SOGP Emergency Obstetric Protocols',
  },
  {
    id: 'kb-preg-kicks',
    stage: 'pregnancy',
    category: 'care',
    title: 'Fetal Movement Counting (Kick Counts)',
    keywords: ['kicks', 'baby movement', 'fetal kick', 'kick count', 'count kicks', 'inactive'],
    summary: 'From 28 weeks onward, monitor fetal movements daily. Count kicks in a relaxed side-lying posture after a light meal. The target is at least 10 distinct movements within 2 hours. If fewer than 10 movements or a sudden marked decrease is felt, contact your doctor immediately.',
    guidelineSource: 'SOGP Clinical Protocol on Antenatal Care',
  },
  {
    id: 'kb-preg-nutrition',
    stage: 'pregnancy',
    category: 'nutrition',
    title: 'Pregnancy Nutrition, Hydration & Traditional Herbs',
    keywords: ['food', 'zafran', 'saffron', 'milk', 'hydration', 'acidity', 'nausea', 'vomiting', 'almonds', 'badam'],
    summary: 'Hydrate with 8–10 glasses of clean water daily. Saffron (zafran) in warm milk is safe in small pinches during the 2nd and 3rd trimesters. Eat small frequent meals to relieve heartburn. Avoid raw papaya, unpasteurized milk, and unregulated herbal decoctions (joshanda/heavy desi totkay).',
    guidelineSource: 'UNICEF & SOGP Maternal Nutrition Protocol',
  },

  // POSTPARTUM
  {
    id: 'kb-post-chilla',
    stage: 'postpartum',
    category: 'care',
    title: 'The Sacred 40-Day Postpartum Healing (Chilla / Sava Mahina)',
    keywords: ['chilla', 'postpartum', 'lochia', 'recovery', 'wound', 'c-section', 'bleeding', 'stitches', 'perineal'],
    summary: 'Chilla (first 40 days) is a period of vital physiologic involution. Lochia progresses from Rubra (red flow, days 1–4) to Serosa (pink/brown, days 5–14) to Alba (yellow/white, up to 6 weeks). Keep C-section or episiotomy wounds clean and dry. Avoid lifting heavy weights.',
    guidelineSource: 'SOGP Postnatal Care Guidelines & WHO Postpartum Model',
  },
  {
    id: 'kb-post-lactation',
    stage: 'postpartum',
    category: 'nutrition',
    title: 'Exclusive Breastfeeding & Galactagogues',
    keywords: ['breastfeeding', 'milk supply', 'latch', 'colostrum', 'panjeeri', 'dalia', 'fennel', 'saunf', 'cumin', 'zeera'],
    summary: 'WHO recommends exclusive breastfeeding for the first 6 months. Colostrum (first yellow milk) is the baby’s first vaccine rich in IgA antibodies. Traditional Pakistani galactagogues (panjeeri, dalia, cumin/zeera, saunf, ample water) provide nourishing calories and stimulate oxytocin and prolactin.',
    guidelineSource: 'WHO & UNICEF Exclusive Breastfeeding Protocol',
  },
  {
    id: 'kb-post-mental-health',
    stage: 'postpartum',
    category: 'mental_health',
    title: 'Baby Blues vs. Postpartum Depression (PPD)',
    keywords: ['crying', 'sad', 'ppd', 'depression', 'anxiety', 'baby blues', 'overwhelmed', 'hopeless', 'exhausted'],
    summary: 'Baby Blues (tearfulness, fatigue, emotional swings) occurs in up to 80% of mothers due to abrupt hormonal drops and resolves by days 10–14 with rest. Postpartum Depression (persistent numbness, crying spells, disconnection, intrusive thoughts beyond 2 weeks) is a recognized clinical condition requiring empathetic professional counseling without shame.',
    guidelineSource: 'Perinatal Mental Health Society & SOGP Guidelines',
  },

  // PARENTING & NEWBORN
  {
    id: 'kb-baby-vaccines',
    stage: 'parenting',
    category: 'care',
    title: 'Pakistan EPI Immunization Schedule',
    keywords: ['vaccine', 'vaccination', 'epi', 'polio', 'bcg', 'pentavalent', 'immunization', 'shots'],
    summary: 'Vaccinations are free and lifesaving across Pakistan under the Expanded Programme on Immunization (EPI). Birth: BCG (Tuberculosis) + OPV-0 (Polio) + Hepatitis B. 6, 10, and 14 weeks: Pentavalent, PCV, OPV, Rotavirus. 9 and 15 months: Measles-Rubella.',
    guidelineSource: 'Expanded Programme on Immunization (EPI), Ministry of National Health Services, Pakistan',
  },
  {
    id: 'kb-baby-colic',
    stage: 'parenting',
    category: 'care',
    title: 'Soothing Newborn Colic, Tummy Gas & Sleep Rhythm',
    keywords: ['colic', 'gas', 'crying', 'burp', 'tummy', 'sleep', 'newborn', 'night'],
    summary: 'Colic commonly peaks between 6–8 weeks. Always burp baby over your shoulder after feeds. Practice gentle bicycle legs and upright holding. Avoid giving unprescribed gripe waters containing sugar or alcohol.',
    guidelineSource: 'Pakistan Paediatric Association (PPA) Newborn Guidelines',
  }
];

export function findRelevantKnowledge(query: string, stage?: string): KnowledgeSnippet[] {
  const lower = query.toLowerCase();
  const tokens = lower.split(/\s+/).filter((t) => t.length > 2);

  const matched = HUMRAAH_KNOWLEDGE_BASE.filter((k) => {
    // Stage affinity check
    const matchesStage = !stage || k.stage === stage || k.stage === 'general';
    // Keyword matching
    const matchesKeywords = k.keywords.some((kw) => lower.includes(kw));
    const matchesTitle = tokens.some((t) => k.title.toLowerCase().includes(t));
    return (matchesStage && (matchesKeywords || matchesTitle)) || matchesKeywords;
  });

  return matched.slice(0, 2);
}
