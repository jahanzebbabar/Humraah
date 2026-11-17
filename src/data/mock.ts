import type { Loc } from '@/i18n';
import type { StringKey } from '@/i18n/strings';
import type { Tone } from '@/theme';

export type City = 'Lahore' | 'Karachi' | 'Islamabad';
export type Specialty = 'Gynecologist' | 'Pediatrician' | 'Lactation' | 'Nutritionist' | 'Psychologist' | 'Physiotherapist' | 'Yoga';

export type Doctor = {
  id: string;
  name: Loc;
  initials: Loc;
  hospital: Loc;
  city: City;
  specialty: Specialty;
  years: number;
  fee: string;
  rating: string;
  reviews: number;
  credentials: Loc;
  next: Loc;
  bio: Loc;
  tone: Tone;
};

export const doctors: Doctor[] = [
  {
    id: 'sara-ahmed',
    name: { en: 'Dr. Sara Ahmed', ur: 'ڈاکٹر سارہ احمد' },
    initials: { en: 'SA', ur: 'س ا' },
    hospital: { en: 'Hameed Latif Hospital & Doctors Hospital', ur: 'حمید لطیف ہسپتال اور ڈاکٹرز ہسپتال' },
    city: 'Lahore',
    specialty: 'Gynecologist',
    years: 15,
    fee: '3,500',
    rating: '4.6/5.0',
    reviews: 210,
    credentials: {
      en: 'Specialist Obstetrician & Gynecologist • MBBS, FCPS (OBGYN), MRCOG (UK), Fellowship in Fetal Medicine',
      ur: 'ماہرِ امراضِ نسواں و زچگی • MBBS، FCPS (OBGYN)، MRCOG (UK)، فیٹل میڈیسن میں فیلوشپ',
    },
    next: { en: 'Tomorrow, 10:00 AM', ur: 'کل، صبح 10:00' },
    bio: {
      en: 'Guides mothers through pregnancy and birth with patience, with particular expertise in fetal medicine and growth scans.',
      ur: 'حمل اور زچگی کے دوران ماؤں کی صبر سے رہنمائی کرتی ہیں، اور فیٹل میڈیسن اور گروتھ اسکین میں خاص مہارت رکھتی ہیں۔',
    },
    tone: 'sky',
  },
  {
    id: 'ayesha-malik',
    name: { en: 'Dr. Ayesha Malik', ur: 'ڈاکٹر عائشہ ملک' },
    initials: { en: 'AM', ur: 'ع م' },
    hospital: { en: 'Aga Khan University Hospital (AKUH)', ur: 'آغا خان یونیورسٹی ہسپتال (AKUH)' },
    city: 'Karachi',
    specialty: 'Gynecologist',
    years: 18,
    fee: '3,500',
    rating: '4.3/5.0',
    reviews: 420,
    credentials: {
      en: 'Associate Professor & Gynecologist • MBBS, FCPS, MCPS (Obs & Gynae)',
      ur: 'ایسوسی ایٹ پروفیسر و ماہرِ امراضِ نسواں • MBBS، FCPS، MCPS (زچہ و بچہ)',
    },
    next: { en: 'Thursday, 3:30 PM', ur: 'جمعرات، سہ پہر 3:30' },
    bio: {
      en: 'Specialises in high-risk pregnancies and takes time to explain each step, so you always know what comes next.',
      ur: 'پُرسکون انداز میں ہر بات سمجھاتے ہوئے ہائی رسک حمل کی ماہر، تاکہ آپ ہمیشہ جانیں کہ آگے کیا ہونا ہے۔',
    },
    tone: 'lavender',
  },
  {
    id: 'usman-farooqi',
    name: { en: 'Dr. Usman Farooqi', ur: 'ڈاکٹر عثمان فاروقی' },
    initials: { en: 'UF', ur: 'ع ف' },
    hospital: { en: 'The Children’s Hospital & Chughtai Medical Center', ur: 'چلڈرن ہسپتال اور چغتائی میڈیکل سینٹر' },
    city: 'Lahore',
    specialty: 'Pediatrician',
    years: 16,
    fee: '3,500',
    rating: '4.7/5.0',
    reviews: 127,
    credentials: {
      en: 'Specialist Pediatrician & Neonatologist • MBBS, FCPS (Pediatrics), Fellowship Neonatology (USA)',
      ur: 'ماہرِ امراضِ اطفال و نوزائیدہ • MBBS، FCPS (اطفال)، نیونیٹولوجی میں فیلوشپ (امریکہ)',
    },
    next: { en: 'Tomorrow, 2:00 PM', ur: 'کل، دوپہر 2:00' },
    bio: {
      en: 'Cares for newborns from their very first breath, including feeding, jaundice, sleep and every small worry in between.',
      ur: 'پہلی سانس سے ہی نومولود کی دیکھ بھال، جس میں دودھ، یرقان، نیند اور ہر چھوٹی بڑی فکر شامل ہے۔',
    },
    tone: 'peach',
  },
  {
    id: 'hina-qureshi',
    name: { en: 'Dr. Hina Qureshi', ur: 'ڈاکٹر حنا قریشی' },
    initials: { en: 'HQ', ur: 'ح ق' },
    hospital: { en: 'Shifa International Hospital', ur: 'شفا انٹرنیشنل ہسپتال' },
    city: 'Islamabad',
    specialty: 'Lactation',
    years: 11,
    fee: '3,000',
    rating: '4.8/5.0',
    reviews: 96,
    credentials: {
      en: 'Lactation Specialist • MBBS, IBCLC, Diploma in Maternal Nutrition',
      ur: 'ماہرِ رضاعت • MBBS، IBCLC، زچگی غذائیت میں ڈپلومہ',
    },
    next: { en: 'Today, 6:00 PM', ur: 'آج، شام 6:00' },
    bio: {
      en: 'Warm, practical support for every way of feeding, whether breast, bottle or both.',
      ur: 'دودھ پلانے کے ہر طریقے کے لیے گرمجوش اور عملی مدد، چاہے ماں کا دودھ ہو، بوتل ہو یا دونوں۔',
    },
    tone: 'sage',
  },
  {
    id: 'farah-siddiqui',
    name: { en: 'Dr. Farah Siddiqui', ur: 'ڈاکٹر فرح صدیقی' },
    initials: { en: 'FS', ur: 'ف ص' },
    hospital: { en: 'Liaquat National Hospital', ur: 'لیاقت نیشنل ہسپتال' },
    city: 'Karachi',
    specialty: 'Nutritionist',
    years: 9,
    fee: '2,800',
    rating: '4.5/5.0',
    reviews: 158,
    credentials: { en: 'Maternal Nutritionist • MSc Clinical Nutrition, RD', ur: 'ماہرِ غذائیت برائے حاملہ خواتین • MSc کلینیکل نیوٹریشن، RD' },
    next: { en: 'Monday, 11:00 AM', ur: 'پیر، صبح 11:00' },
    bio: {
      en: 'Builds simple meal plans around desi home cooking to keep you and your baby well nourished in every trimester.',
      ur: 'سادہ دیسی کھانوں پر مبنی غذائی منصوبے جو ہر سہ ماہی میں آپ اور بچے کو توانا رکھیں۔',
    },
    tone: 'mint',
  },
];

export const cityOptions: ('all' | City)[] = ['all', 'Lahore', 'Karachi', 'Islamabad'];
export const specialtyOptions: ('all' | Specialty)[] = ['all', 'Gynecologist', 'Pediatrician', 'Lactation', 'Nutritionist', 'Psychologist', 'Physiotherapist', 'Yoga'];

export const bookingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export const bookingTimes = ['09:00', '10:30', '12:00', '15:30', '18:00'];

export const plannerCategories = ['Tasks', 'Appointments', 'Tests & Labs', 'Vaccines', 'Milestones'] as const;
export type PlannerCategory = (typeof plannerCategories)[number];

export const priorities = ['High', 'Medium', 'Low'] as const;
export type Priority = (typeof priorities)[number];

export const dueOptions = ['Today', 'Tomorrow', 'This week', 'Next week'] as const;
export type Due = (typeof dueOptions)[number];

export type PlannerItem = {
  id: string;
  title: Loc;
  category: PlannerCategory;
  priority: Priority;
  due: Due;
  done: boolean;
};

export const initialPlanner: PlannerItem[] = [
  { id: 'p1', title: { en: 'Take your iron and folic acid tablet', ur: 'روزانہ آئرن اور فولک ایسڈ کی گولی لیں' }, category: 'Tasks', priority: 'High', due: 'Today', done: false },
  { id: 'p2', title: { en: 'Pack the hospital bag', ur: 'ہسپتال کا بیگ تیار کریں' }, category: 'Tasks', priority: 'Medium', due: 'This week', done: false },
  { id: 'p3', title: { en: '15-minute evening walk', ur: 'شام کی 15 منٹ کی چہل قدمی' }, category: 'Tasks', priority: 'Low', due: 'Today', done: true },
  { id: 'p4', title: { en: 'Growth scan with Dr. Sara', ur: 'ڈاکٹر سارہ کے ساتھ گروتھ اسکین' }, category: 'Appointments', priority: 'High', due: 'Tomorrow', done: false },
  { id: 'p5', title: { en: 'Dental check-up', ur: 'دانتوں کا معائنہ' }, category: 'Appointments', priority: 'Low', due: 'Next week', done: false },
  { id: 'p6', title: { en: 'Glucose tolerance test', ur: 'گلوکوز ٹالرینس ٹیسٹ' }, category: 'Tests & Labs', priority: 'High', due: 'This week', done: false },
  { id: 'p7', title: { en: 'Complete blood count', ur: 'خون کا مکمل ٹیسٹ (CBC)' }, category: 'Tests & Labs', priority: 'Medium', due: 'Next week', done: false },
  { id: 'p8', title: { en: 'Urine routine examination', ur: 'پیشاب کا معمول کا معائنہ' }, category: 'Tests & Labs', priority: 'Low', due: 'Today', done: true },
  { id: 'p9', title: { en: 'Tdap booster', ur: 'ٹی ڈیپ (Tdap) بوسٹر' }, category: 'Vaccines', priority: 'High', due: 'This week', done: false },
  { id: 'p10', title: { en: 'Seasonal flu shot', ur: 'موسمی فلو کا ٹیکہ' }, category: 'Vaccines', priority: 'Medium', due: 'Next week', done: false },
  { id: 'p11', title: { en: 'Baby can hear your voice', ur: 'بچہ آپ کی آواز سن سکتا ہے' }, category: 'Milestones', priority: 'Low', due: 'Today', done: true },
  { id: 'p12', title: { en: 'Baby turns head-down', ur: 'بچے کا سر نیچے کی طرف آنا' }, category: 'Milestones', priority: 'Medium', due: 'Next week', done: false },
];

export type CareTask = { id: string; title: Loc; detail: Loc; icon: 'droplet' | 'pill' | 'walk'; tone: Tone; done: boolean };

export const initialCare: CareTask[] = [
  { id: 'c1', title: { en: 'Stay hydrated', ur: 'پانی پیتی رہیں' }, detail: { en: 'Drink at least 2 litres of water today.', ur: 'آج کم از کم 2 لیٹر پانی پئیں۔' }, icon: 'droplet', tone: 'sky', done: false },
  { id: 'c2', title: { en: 'Iron and folic acid', ur: 'آئرن اور فولک ایسڈ' }, detail: { en: 'One tablet after lunch, with juice.', ur: 'دوپہر کے کھانے کے بعد جوس کے ساتھ ایک گولی۔' }, icon: 'pill', tone: 'peach', done: false },
  { id: 'c3', title: { en: 'Evening walk', ur: 'شام کی چہل قدمی' }, detail: { en: '15 minutes of fresh air this evening.', ur: 'آج شام 15 منٹ تازہ ہوا میں۔' }, icon: 'walk', tone: 'mint', done: false },
];

export type NotificationKind = 'pill' | 'baby' | 'doctor' | 'water' | 'heart';
export type AppNotification = {
  id: string;
  when: 'Today' | 'Yesterday' | 'Earlier';
  time: Loc;
  title: Loc;
  body: Loc;
  tone: Tone;
  kind: NotificationKind;
};

export const notifications: AppNotification[] = [
  {
    id: 'n1',
    when: 'Today',
    time: { en: '9:00 AM', ur: 'صبح 9:00' },
    title: { en: 'Time for your iron tablet', ur: 'آئرن کی گولی کا وقت' },
    body: { en: 'A small daily habit that supports your baby’s growth.', ur: 'ایک چھوٹی سی روزانہ کی عادت جو بچے کی نشوونما میں مدد دیتی ہے۔' },
    tone: 'peach',
    kind: 'pill',
  },
  {
    id: 'n2',
    when: 'Today',
    time: { en: '8:15 AM', ur: 'صبح 8:15' },
    title: { en: 'Welcome to week 32', ur: '32ویں ہفتے میں خوش آمدید' },
    body: { en: 'Baby is the size of an ear of corn and practising breathing.', ur: 'بچہ اب مکئی کے بھٹے جتنا ہے اور سانس لینے کی مشق کر رہا ہے۔' },
    tone: 'sage',
    kind: 'baby',
  },
  {
    id: 'n3',
    when: 'Yesterday',
    time: { en: '6:40 PM', ur: 'شام 6:40' },
    title: { en: 'Booking confirmed', ur: 'بکنگ کی تصدیق ہو گئی' },
    body: { en: 'Dr. Sara Ahmed · Tomorrow, 10:00 AM', ur: 'ڈاکٹر سارہ احمد · کل، صبح 10:00' },
    tone: 'sky',
    kind: 'doctor',
  },
  {
    id: 'n4',
    when: 'Yesterday',
    time: { en: '11:00 AM', ur: 'صبح 11:00' },
    title: { en: 'You reached your water goal', ur: 'پانی کا ہدف پورا ہو گیا' },
    body: { en: '2 litres today. Your body will thank you.', ur: 'آج 2 لیٹر مکمل۔ آپ کا جسم آپ کا شکر گزار ہوگا۔' },
    tone: 'mint',
    kind: 'water',
  },
  {
    id: 'n5',
    when: 'Earlier',
    time: { en: 'Mon', ur: 'پیر' },
    title: { en: 'A note from Humraah', ur: 'ہمراہ کی طرف سے ایک پیغام' },
    body: { en: 'Rest is productive too. Be gentle with yourself today.', ur: 'آرام بھی ضروری کام ہے۔ آج خود پر مہربان رہیں۔' },
    tone: 'lavender',
    kind: 'heart',
  },
];

export type ReplyTopic = 'kicks' | 'back' | 'pack' | 'iron' | 'default';

export const chatSuggestions: { text: Loc; tone: Tone; topic: ReplyTopic }[] = [
  { text: { en: 'Is back pain normal at 32 weeks?', ur: 'کیا 32ویں ہفتے میں کمر درد عام ہے؟' }, tone: 'peach', topic: 'back' },
  { text: { en: 'What should I pack for the hospital?', ur: 'ہسپتال کے لیے کیا ساتھ لے جاؤں؟' }, tone: 'mint', topic: 'pack' },
  { text: { en: 'How many kicks are normal?', ur: 'بچے کی کتنی حرکتیں نارمل ہیں؟' }, tone: 'sky', topic: 'kicks' },
  { text: { en: 'Iron-rich desi foods', ur: 'آئرن سے بھرپور دیسی غذائیں' }, tone: 'sage', topic: 'iron' },
];

export const chatKeywords: Record<Exclude<ReplyTopic, 'default'>, string[]> = {
  kicks: ['kick', 'move', 'حرکت', 'ککس'],
  back: ['back', 'pain', 'کمر', 'درد'],
  pack: ['pack', 'bag', 'hospital', 'بیگ', 'ہسپتال'],
  iron: ['iron', 'food', 'eat', 'آئرن', 'غذا', 'کھان'],
};

export const chatReplies: Record<ReplyTopic, Loc> = {
  default: {
    en: 'That’s a good question. Every pregnancy is different, so I’ll keep my answer general. If anything feels wrong, you can reach a specialist from the Specialists tab.',
    ur: 'بہت اچھا سوال ہے۔ ہر حمل مختلف ہوتا ہے، اس لیے میں عمومی بات کروں گی۔ اگر کچھ بھی ٹھیک نہ لگے تو ماہرین والے حصے سے اپنی ڈاکٹر سے رابطہ کریں۔',
  },
  kicks: {
    en: 'From week 28, aim to feel about 10 movements within 2 hours, ideally when baby is usually active. If you notice fewer, have a cold drink, lie on your left side and count again. If movements are still low, call your doctor.',
    ur: '28ویں ہفتے سے کوشش کریں کہ 2 گھنٹوں میں تقریباً 10 حرکتیں محسوس ہوں، بہتر ہے اس وقت گنیں جب بچہ عموماً متحرک ہوتا ہے۔ اگر حرکت کم لگے تو کوئی ٹھنڈا مشروب پئیں، بائیں کروٹ لیٹیں اور دوبارہ گنیں۔ پھر بھی کم ہو تو ڈاکٹر سے رابطہ کریں۔',
  },
  back: {
    en: 'Lower back aches are very common now as your bump grows. Try a warm (not hot) compress, a pillow between your knees at night, and gentle stretches. Sudden or rhythmic pain should be checked by your doctor.',
    ur: 'پیٹ بڑھنے کے ساتھ کمر کے نچلے حصے میں درد بہت عام ہے۔ نیم گرم سینکائی کریں، رات کو گھٹنوں کے درمیان تکیہ رکھیں اور ہلکی اسٹریچنگ کریں۔ اچانک یا وقفے وقفے سے ہونے والا درد ڈاکٹر کو ضرور دکھائیں۔',
  },
  pack: {
    en: 'Start with your CNIC and hospital file, 2 or 3 loose kurtas, a nursing bra, maternity pads, baby’s first outfit, a swaddle, a cap and socks, and a phone charger. A small snack for whoever comes with you helps too.',
    ur: 'شروع کریں: شناختی کارڈ اور ہسپتال کی فائل، 2 یا 3 ڈھیلے کرتے، نرسنگ برا، میٹرنٹی پیڈز، بچے کا پہلا جوڑا، لپیٹنے کی چادر، ٹوپی اور موزے، اور فون چارجر۔ ساتھ آنے والے کے لیے کچھ کھانے کو بھی رکھ لیں!',
  },
  iron: {
    en: 'Try palak, chana, masoor dal, well-cooked kaleji, dates and gur. Pair them with lemon or orange juice, since vitamin C helps your body absorb the iron.',
    ur: 'پالک، چنے، مسور کی دال، اچھی طرح پکی کلیجی، کھجور اور گڑ آزمائیں۔ ساتھ میں لیموں یا مالٹے کا جوس لیں، کیونکہ وٹامن سی آئرن کو جذب ہونے میں مدد دیتا ہے۔',
  },
};

export type Contact = { id: string; name: Loc; phone: string; tone: Tone };

export const initialContacts: Contact[] = [
  { id: 'k1', name: { en: 'Ahmed (Husband)', ur: 'احمد (شوہر)' }, phone: '03001234567', tone: 'sky' },
  { id: 'k2', name: { en: 'Ammi', ur: 'امی' }, phone: '03217654321', tone: 'peach' },
];

/** Translation key for each filter / enum value. */
export const cityKey = (c: 'all' | City) => (c === 'all' ? 'city.all' : `city.${c}`) as StringKey;
export const specialtyKey = (s: 'all' | Specialty) => (s === 'all' ? 'spec.all' : `spec.${s}`) as StringKey;

/* ------------------------------------------------------------- supplements */

export type Supplement = { id: string; name: Loc; dose: Loc; timing: Loc; purpose: Loc; tip?: Loc; taken: boolean };

export const initialSupplements: Supplement[] = [
  {
    id: 's1',
    name: { en: 'Iron + vitamin C', ur: 'آئرن + وٹامن سی' },
    dose: { en: '1 capsule', ur: '1 کیپسول' },
    timing: { en: 'After lunch, with citrus water', ur: 'دوپہر کے کھانے کے بعد، لیموں پانی کے ساتھ' },
    purpose: { en: 'Prevents anaemia and supports baby’s growing blood supply.', ur: 'خون کی کمی سے بچاتا ہے اور بچے کے بڑھتے خون میں مدد دیتا ہے۔' },
    tip: { en: 'Not with tea or milk, so the iron absorbs properly.', ur: 'چائے یا دودھ کے ساتھ نہ لیں تاکہ آئرن ٹھیک سے جذب ہو۔' },
    taken: false,
  },
  {
    id: 's2',
    name: { en: 'Calcium + vitamin D3', ur: 'کیلشیم + وٹامن ڈی 3' },
    dose: { en: '1 tablet', ur: '1 گولی' },
    timing: { en: 'Morning, after breakfast', ur: 'صبح، ناشتے کے بعد' },
    purpose: { en: 'Builds baby’s bones and protects your own calcium stores.', ur: 'بچے کی ہڈیاں مضبوط کرتا ہے اور آپ کا کیلشیم محفوظ رکھتا ہے۔' },
    tip: { en: 'Keep at least 2 hours between iron and calcium.', ur: 'آئرن اور کیلشیم کے درمیان کم از کم 2 گھنٹے کا وقفہ رکھیں۔' },
    taken: true,
  },
  {
    id: 's3',
    name: { en: 'Omega-3 DHA', ur: 'اومیگا 3 ڈی ایچ اے' },
    dose: { en: '1 softgel, 300 mg', ur: '1 سافٹ جیل، 300 ملی گرام' },
    timing: { en: 'With dinner', ur: 'رات کے کھانے کے ساتھ' },
    purpose: { en: 'Nourishes baby’s brain and eyes.', ur: 'بچے کے دماغ اور آنکھوں کی نشوونما میں مدد دیتا ہے۔' },
    taken: false,
  },
  {
    id: 's4',
    name: { en: 'Folic acid, 5 mg', ur: 'فولک ایسڈ، 5 ملی گرام' },
    dose: { en: '1 tablet', ur: '1 گولی' },
    timing: { en: 'Morning', ur: 'صبح' },
    purpose: { en: 'Supports healthy cell growth and baby’s nervous system.', ur: 'خلیوں کی صحت مند نشوونما اور بچے کے اعصابی نظام میں مدد دیتا ہے۔' },
    taken: true,
  },
];
