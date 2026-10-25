import type { Loc } from '@/i18n';

/**
 * One practical tip per pregnancy week, split by time of day so the home greeting
 * stays relevant: `day` for morning and afternoon, `night` for evening and late night.
 * English tips start lowercase because they follow "At week {week}, ".
 */
export type WeeklyInsight = { day: Loc; night: Loc };

export const FIRST_INSIGHT_WEEK = 4;
export const LAST_INSIGHT_WEEK = 41;

export const weeklyInsights: Record<number, WeeklyInsight> = {
  4: {
    day: {
      en: 'taking folic acid every day helps your baby’s brain and spine form well, so keep it next to your breakfast.',
      ur: 'روزانہ فولک ایسڈ لینا بچے کے دماغ اور ریڑھ کی ہڈی کی بہتر نشوونما میں مدد دیتا ہے، اس لیے اسے ناشتے کے ساتھ رکھیں۔',
    },
    night: {
      en: 'feeling tired this early is normal, so an earlier bedtime tonight is a fair trade.',
      ur: 'اتنی جلدی تھکن محسوس ہونا عام ہے، اس لیے آج رات جلدی سو جانا بہتر ہے۔',
    },
  },
  5: {
    day: {
      en: 'small, plain snacks every two to three hours can keep early nausea from building up.',
      ur: 'ہر دو سے تین گھنٹے بعد ہلکا اور سادہ ناشتہ متلی کو بڑھنے سے روک سکتا ہے۔',
    },
    night: {
      en: 'keep a few dry crackers by your bed to settle your stomach before you get up tomorrow.',
      ur: 'بستر کے پاس چند سوکھے بسکٹ رکھیں تاکہ صبح اٹھنے سے پہلے معدہ سنبھل جائے۔',
    },
  },
  6: {
    day: {
      en: 'your body is making more blood now, so stand up slowly to avoid feeling dizzy.',
      ur: 'آپ کا جسم اب زیادہ خون بنا رہا ہے، اس لیے چکر سے بچنے کے لیے آہستہ سے اٹھیں۔',
    },
    night: {
      en: 'a cup of ginger tea after dinner can ease evening nausea for many women.',
      ur: 'رات کے کھانے کے بعد ادرک کی چائے بہت سی خواتین میں شام کی متلی کم کرتی ہے۔',
    },
  },
  7: {
    day: {
      en: 'this is a good week to book your first antenatal visit if you haven’t already.',
      ur: 'اگر ابھی تک نہیں کیا تو اس ہفتے اپنا پہلا زچگی معائنہ طے کر لیں۔',
    },
    night: {
      en: 'drinking less in the last hour before bed can mean fewer bathroom trips overnight.',
      ur: 'سونے سے پہلے آخری گھنٹے میں کم پانی پینے سے رات کو باتھ روم کم جانا پڑے گا۔',
    },
  },
  8: {
    day: {
      en: 'a well-fitted, supportive bra can ease breast tenderness, which often peaks around now.',
      ur: 'ایک آرام دہ اور سہارا دینے والی برا چھاتی کے درد کو کم کر سکتی ہے، جو عموماً انہی دنوں زیادہ ہوتا ہے۔',
    },
    night: {
      en: 'sleeping in a soft cotton bra can make tender breasts more comfortable overnight.',
      ur: 'نرم سوتی برا پہن کر سونے سے رات بھر چھاتی کو آرام رہتا ہے۔',
    },
  },
  9: {
    day: {
      en: 'eggs, yoghurt and daal are easy sources of protein when heavier food doesn’t appeal.',
      ur: 'جب بھاری کھانا اچھا نہ لگے تو انڈے، دہی اور دال پروٹین کے آسان ذرائع ہیں۔',
    },
    night: {
      en: 'if heartburn keeps you up, try finishing dinner two to three hours before you lie down.',
      ur: 'اگر سینے کی جلن سے نیند نہیں آتی تو لیٹنے سے دو تین گھنٹے پہلے کھانا ختم کر لیں۔',
    },
  },
  10: {
    day: {
      en: 'ask your doctor about your first trimester blood tests, which are usually done around now.',
      ur: 'اپنی ڈاکٹر سے پہلی سہ ماہی کے خون کے ٹیسٹ کے بارے میں پوچھیں، جو عموماً انہی دنوں ہوتے ہیں۔',
    },
    night: {
      en: 'mood swings this early are driven by hormones, so be gentle with yourself tonight.',
      ur: 'اس وقت مزاج کا بدلنا ہارمونز کی وجہ سے ہے، اس لیے آج رات خود پر مہربان رہیں۔',
    },
  },
  11: {
    day: {
      en: 'pregnancy hormones can make gums bleed, so brush gently twice a day with a soft brush.',
      ur: 'حمل کے ہارمونز سے مسوڑھوں سے خون آ سکتا ہے، اس لیے دن میں دو بار نرم برش سے آہستہ دانت صاف کریں۔',
    },
    night: {
      en: 'a short, easy walk after dinner can help with the bloating many women notice this week.',
      ur: 'رات کے کھانے کے بعد تھوڑی سی چہل قدمی پیٹ کے پھولنے میں مدد دیتی ہے، جو اس ہفتے عام ہے۔',
    },
  },
  12: {
    day: {
      en: 'the dating and nuchal scan is usually done between weeks 11 and 13, so check that yours is booked.',
      ur: 'ڈیٹنگ اور نیوکل اسکین عموماً 11 سے 13 ہفتوں کے درمیان ہوتا ہے، دیکھ لیں کہ آپ کا وقت طے ہے۔',
    },
    night: {
      en: 'nausea often starts to ease from now, so try adding one vegetable back into dinner as your appetite returns.',
      ur: 'اب متلی عموماً کم ہونے لگتی ہے، بھوک لوٹے تو رات کے کھانے میں ایک سبزی پھر سے شامل کریں۔',
    },
  },
  13: {
    day: {
      en: 'your energy may start to return, which makes this a good time to begin short daily walks.',
      ur: 'آپ کی توانائی واپس آنے لگتی ہے، اس لیے روزانہ مختصر چہل قدمی شروع کرنے کا یہ اچھا وقت ہے۔',
    },
    night: {
      en: 'your belly may itch as the skin stretches, and a plain moisturiser after your evening bath helps.',
      ur: 'جلد کھنچنے سے پیٹ پر خارش ہو سکتی ہے، شام کے غسل کے بعد سادہ موئسچرائزر لگانا مفید ہے۔',
    },
  },
  14: {
    day: {
      en: 'your iron needs rise in the second trimester, so pair palak or chana with a squeeze of lemon.',
      ur: 'دوسری سہ ماہی میں آئرن کی ضرورت بڑھ جاتی ہے، اس لیے پالک یا چنے کے ساتھ لیموں نچوڑ لیں۔',
    },
    night: {
      en: 'a stuffy nose at night is a common hormone effect, and a warm shower before bed can clear it.',
      ur: 'رات کو ناک بند ہونا ہارمونز کا عام اثر ہے، سونے سے پہلے نیم گرم غسل سے آرام ملتا ہے۔',
    },
  },
  15: {
    day: {
      en: 'walking or swimming for 30 minutes on most days helps support your back as your baby grows.',
      ur: 'زیادہ تر دنوں میں 30 منٹ چہل قدمی یا تیراکی بچے کے بڑھنے کے ساتھ کمر کو سہارا دیتی ہے۔',
    },
    night: {
      en: 'starting to sleep on your side now makes it an easy habit by the third trimester.',
      ur: 'ابھی سے کروٹ لے کر سونا شروع کریں تو تیسری سہ ماہی تک یہ آسان عادت بن جائے گی۔',
    },
  },
  16: {
    day: {
      en: 'some women feel the first flutters between weeks 16 and 20, like gentle bubbles low in the belly.',
      ur: 'کچھ خواتین 16 سے 20 ہفتوں کے درمیان پہلی ہلکی حرکت محسوس کرتی ہیں، جیسے پیٹ کے نچلے حصے میں ننھے بلبلے۔',
    },
    night: {
      en: 'the quiet minutes before sleep are when many women first notice those early flutters.',
      ur: 'سونے سے پہلے کے پُرسکون لمحوں میں بہت سی خواتین پہلی بار یہ ہلکی حرکت محسوس کرتی ہیں۔',
    },
  },
  17: {
    day: {
      en: 'your growing belly shifts your balance, so choose flat, supportive shoes when you go out.',
      ur: 'بڑھتا ہوا پیٹ توازن بدل دیتا ہے، اس لیے باہر جاتے وقت چپٹے اور آرام دہ جوتے پہنیں۔',
    },
    night: {
      en: 'a pillow between your knees takes pressure off your hips when you sleep on your side.',
      ur: 'کروٹ لے کر سوتے وقت گھٹنوں کے درمیان تکیہ رکھنے سے کولہوں پر دباؤ کم ہوتا ہے۔',
    },
  },
  18: {
    day: {
      en: 'the anomaly scan is usually done between weeks 18 and 21, so this is a good week to book it.',
      ur: 'انوملی اسکین عموماً 18 سے 21 ہفتوں کے درمیان ہوتا ہے، اس لیے اس ہفتے وقت طے کر لیں۔',
    },
    night: {
      en: 'leg cramps become common from now, and stretching your calves before bed can help prevent them.',
      ur: 'اب ٹانگوں میں اکڑن عام ہو جاتی ہے، سونے سے پہلے پنڈلیوں کو کھینچنا اس سے بچا سکتا ہے۔',
    },
  },
  19: {
    day: {
      en: 'dark patches on the face are common in pregnancy, and sunscreen with a cap outdoors helps keep them light.',
      ur: 'حمل میں چہرے پر گہرے دھبے عام ہیں، باہر سن اسکرین اور ٹوپی کا استعمال انہیں ہلکا رکھتا ہے۔',
    },
    night: {
      en: 'lying flat on your back can make you dizzy now, so settle on your left side when you sleep.',
      ur: 'اب سیدھا کمر کے بل لیٹنے سے چکر آ سکتے ہیں، اس لیے بائیں کروٹ لے کر سوئیں۔',
    },
  },
  20: {
    day: {
      en: 'you’re halfway there, and a short walk after meals helps keep your blood sugar steady.',
      ur: 'آپ آدھا سفر طے کر چکی ہیں، کھانے کے بعد مختصر چہل قدمی خون میں شکر کو متوازن رکھتی ہے۔',
    },
    night: {
      en: 'your baby may now respond to your voice, so reading or talking aloud before bed is time well spent.',
      ur: 'بچہ اب آپ کی آواز پر ردِعمل دے سکتا ہے، سونے سے پہلے اونچی آواز میں پڑھنا یا باتیں کرنا اچھا ہے۔',
    },
  },
  21: {
    day: {
      en: 'constipation is common now, and more water, fruit and fibre such as daliya help keep things moving.',
      ur: 'اب قبض عام ہے، زیادہ پانی، پھل اور دلیہ جیسی فائبر والی غذا سے آرام ملتا ہے۔',
    },
    night: {
      en: 'if heartburn returns, an extra pillow to raise your head and chest can help.',
      ur: 'اگر سینے کی جلن لوٹ آئے تو سر اور سینے کو اونچا رکھنے کے لیے ایک اضافی تکیہ رکھیں۔',
    },
  },
  22: {
    day: {
      en: 'your baby is forming sleep and wake cycles, so you may start to notice their active times of day.',
      ur: 'بچہ سونے جاگنے کا معمول بنا رہا ہے، اس لیے آپ دن میں اس کے متحرک اوقات محسوس کرنے لگیں گی۔',
    },
    night: {
      en: 'a warm, not hot, shower before bed can ease the back aches that often begin around now.',
      ur: 'سونے سے پہلے نیم گرم غسل کمر کے اس درد کو کم کرتا ہے جو عموماً انہی دنوں شروع ہوتا ہے۔',
    },
  },
  23: {
    day: {
      en: 'swollen feet late in the day are common, so raise them when you sit and keep walks short and regular.',
      ur: 'دن ڈھلے پاؤں سوجنا عام ہے، بیٹھتے وقت پاؤں اونچے رکھیں اور مختصر مگر باقاعدہ چہل قدمی کریں۔',
    },
    night: {
      en: 'resting your feet on a pillow for 15 minutes before bed can ease ankle swelling.',
      ur: 'سونے سے پہلے 15 منٹ پاؤں تکیے پر رکھنے سے ٹخنوں کی سوجن کم ہوتی ہے۔',
    },
  },
  24: {
    day: {
      en: 'the glucose test for gestational diabetes is usually done between weeks 24 and 28, so ask your doctor when to book it.',
      ur: 'حمل کی ذیابیطس کا گلوکوز ٹیسٹ عموماً 24 سے 28 ہفتوں کے درمیان ہوتا ہے، اپنی ڈاکٹر سے وقت پوچھ لیں۔',
    },
    night: {
      en: 'if the skin over your bump feels tight, a little oil massaged in before bed can ease the itch.',
      ur: 'اگر پیٹ کی جلد کھنچی ہوئی لگے تو سونے سے پہلے تھوڑا سا تیل لگانے سے خارش کم ہوتی ہے۔',
    },
  },
  25: {
    day: {
      en: 'take your iron tablet with juice rather than tea, since tea makes iron harder to absorb.',
      ur: 'آئرن کی گولی چائے کے بجائے جوس کے ساتھ لیں، کیونکہ چائے آئرن کو جذب ہونے سے روکتی ہے۔',
    },
    night: {
      en: 'restless legs at night are common now, and a short stretch with a glass of water before bed may help.',
      ur: 'رات کو ٹانگوں میں بے چینی اب عام ہے، سونے سے پہلے ہلکی اسٹریچنگ اور ایک گلاس پانی مدد کر سکتا ہے۔',
    },
  },
  26: {
    day: {
      en: 'sudden swelling of your face or hands with a headache needs a call to your doctor the same day.',
      ur: 'اگر چہرے یا ہاتھوں پر اچانک سوجن کے ساتھ سر درد ہو تو اسی دن اپنی ڈاکٹر کو فون کریں۔',
    },
    night: {
      en: 'a long pillow behind your back makes side sleeping much more comfortable from here on.',
      ur: 'کمر کے پیچھے لمبا تکیہ رکھنے سے اب کروٹ لے کر سونا کہیں زیادہ آرام دہ ہو جاتا ہے۔',
    },
  },
  27: {
    day: {
      en: 'ask your doctor about the Tdap vaccine, which is usually given between weeks 27 and 36.',
      ur: 'اپنی ڈاکٹر سے ٹی ڈیپ ویکسین کے بارے میں پوچھیں، جو عموماً 27 سے 36 ہفتوں کے درمیان لگتی ہے۔',
    },
    night: {
      en: 'light snoring is common now as your nose swells, and sleeping slightly propped up can help.',
      ur: 'ناک میں سوجن کی وجہ سے ہلکے خراٹے اب عام ہیں، تھوڑا اونچا ہو کر سونے سے فرق پڑتا ہے۔',
    },
  },
  28: {
    day: {
      en: 'start daily kick counts now, aiming for 10 movements within two hours at a time your baby is usually active.',
      ur: 'اب روزانہ حرکتیں گننا شروع کریں، جب بچہ عموماً متحرک ہو تو دو گھنٹوں میں 10 حرکتوں کا ہدف رکھیں۔',
    },
    night: {
      en: 'babies are often most active in the evening, so this is a good time for today’s kick count.',
      ur: 'بچے اکثر شام کو زیادہ متحرک ہوتے ہیں، اس لیے آج کی حرکتیں گننے کا یہ اچھا وقت ہے۔',
    },
  },
  29: {
    day: {
      en: 'your baby’s bones are taking in a lot of calcium, so include milk, yoghurt or lassi with two meals today.',
      ur: 'بچے کی ہڈیاں بہت کیلشیم لے رہی ہیں، اس لیے آج دو کھانوں کے ساتھ دودھ، دہی یا لسی شامل کریں۔',
    },
    night: {
      en: 'feeling short of breath when lying flat is common, and an extra pillow under your shoulders helps.',
      ur: 'سیدھا لیٹنے پر سانس پھولنا عام ہے، کندھوں کے نیچے ایک اضافی تکیہ رکھنے سے آرام ملتا ہے۔',
    },
  },
  30: {
    day: {
      en: 'breathlessness on stairs is normal as your baby pushes upward, so take them slowly and pause halfway.',
      ur: 'بچے کے اوپر دباؤ سے سیڑھیوں پر سانس پھولنا عام ہے، آہستہ چڑھیں اور درمیان میں رک جائیں۔',
    },
    night: {
      en: 'if worries keep you awake, writing down your questions for your next visit can help settle your mind.',
      ur: 'اگر فکریں جگائے رکھیں تو اگلی ملاقات کے لیے اپنے سوالات لکھ لیں، اس سے ذہن کو سکون ملتا ہے۔',
    },
  },
  31: {
    day: {
      en: 'Braxton Hicks tightenings may come more often, but if they turn regular or painful, call your doctor.',
      ur: 'بریکسٹن ہکس کا کھنچاؤ زیادہ ہو سکتا ہے، لیکن اگر یہ باقاعدہ یا تکلیف دہ ہو جائے تو ڈاکٹر کو فون کریں۔',
    },
    night: {
      en: 'a tightening that eases when you change position is usually Braxton Hicks, so try resting on your left side.',
      ur: 'جو کھنچاؤ کروٹ بدلنے سے ختم ہو جائے وہ عموماً بریکسٹن ہکس ہوتا ہے، بائیں کروٹ لیٹ کر آرام کریں۔',
    },
  },
  32: {
    day: {
      en: 'small, frequent meals ease heartburn better than three large ones while your baby presses on your stomach.',
      ur: 'بچے کے معدے پر دباؤ کی وجہ سے تین بڑے کھانوں کے بجائے تھوڑا تھوڑا بار بار کھانا جلن کم کرتا ہے۔',
    },
    night: {
      en: 'a quick stretch before bed helps with lower back pressure.',
      ur: 'سونے سے پہلے ہلکی سی اسٹریچنگ کمر کے نچلے حصے کے دباؤ میں آرام دیتی ہے۔',
    },
  },
  33: {
    day: {
      en: 'this is a good week to pack your hospital bag, so you’re ready without a last-minute rush.',
      ur: 'ہسپتال کا بیگ تیار کرنے کے لیے یہ اچھا ہفتہ ہے، تاکہ آخری وقت کی جلدی نہ ہو۔',
    },
    night: {
      en: 'when you get up at night, roll onto your side first and push up with your arms to protect your back.',
      ur: 'رات کو اٹھتے وقت پہلے کروٹ لیں اور بازوؤں کے سہارے اٹھیں تاکہ کمر محفوظ رہے۔',
    },
  },
  34: {
    day: {
      en: 'ask your doctor about your baby’s position, since most babies settle head down around now.',
      ur: 'اپنی ڈاکٹر سے بچے کی پوزیشن کے بارے میں پوچھیں، کیونکہ زیادہ تر بچے انہی دنوں سر نیچے کر لیتے ہیں۔',
    },
    night: {
      en: 'a small pillow under your bump while you lie on your side can ease the pull on your back.',
      ur: 'کروٹ لیٹتے وقت پیٹ کے نیچے چھوٹا تکیہ رکھنے سے کمر کا کھنچاؤ کم ہوتا ہے۔',
    },
  },
  35: {
    day: {
      en: 'pelvic pressure grows as your baby moves lower, and sitting with your knees below your hips helps.',
      ur: 'بچے کے نیچے آنے سے پیڑو پر دباؤ بڑھتا ہے، گھٹنوں کو کولہوں سے نیچے رکھ کر بیٹھنے سے آرام ملتا ہے۔',
    },
    night: {
      en: 'a steady wind-down routine, like a warm drink and dim lights, can help you fall asleep as discomfort grows.',
      ur: 'سونے سے پہلے ایک معمول، جیسے کوئی گرم مشروب اور مدھم روشنی، بڑھتی بے آرامی میں نیند لانے میں مدد دیتا ہے۔',
    },
  },
  36: {
    day: {
      en: 'your doctor will likely see you every week from now, so keep your hospital file within reach.',
      ur: 'اب آپ کی ڈاکٹر غالباً ہر ہفتے معائنہ کریں گی، اس لیے ہسپتال کی فائل پاس رکھیں۔',
    },
    night: {
      en: 'save your doctor’s number and the route to the hospital on your phone tonight, so they’re ready at any hour.',
      ur: 'آج رات ڈاکٹر کا نمبر اور ہسپتال کا راستہ فون میں محفوظ کر لیں تاکہ کسی بھی وقت کام آئے۔',
    },
  },
  37: {
    day: {
      en: 'your baby is now early term, so make sure someone can reach you and drive you at short notice.',
      ur: 'بچہ اب ابتدائی مکمل مدت میں ہے، یقینی بنائیں کہ کوئی آپ سے رابطے میں ہو اور فوراً ہسپتال لے جا سکے۔',
    },
    night: {
      en: 'regular contractions, your waters breaking or any bleeding mean it’s time to call your doctor.',
      ur: 'باقاعدہ دردیں، پانی کی تھیلی پھٹنا یا خون آنا اس بات کی علامت ہے کہ ڈاکٹر کو فون کریں۔',
    },
  },
  38: {
    day: {
      en: 'gentle walking can help you feel ready, but rest whenever your body asks for it.',
      ur: 'ہلکی چہل قدمی آپ کو تیار محسوس کرواتی ہے، لیکن جب جسم کہے تو آرام ضرور کریں۔',
    },
    night: {
      en: 'keep your phone charged and your bag by the door, just in case tonight is the night.',
      ur: 'فون چارج رکھیں اور بیگ دروازے کے پاس، کیا پتا آج ہی کی رات ہو۔',
    },
  },
  39: {
    day: {
      en: 'your baby’s movements may feel different but should not slow down, so call your doctor if they do.',
      ur: 'بچے کی حرکتیں مختلف محسوس ہو سکتی ہیں مگر کم نہیں ہونی چاہئیں، کم ہوں تو ڈاکٹر کو فون کریں۔',
    },
    night: {
      en: 'slow, deep breathing in a warm room can help you rest while sleep is light this close to your due date.',
      ur: 'متوقع تاریخ کے قریب نیند ہلکی ہوتی ہے، گرم کمرے میں آہستہ اور گہری سانسیں آرام دیتی ہیں۔',
    },
  },
  40: {
    day: {
      en: 'only about 1 in 25 babies arrive on their exact due date, so a few more days of waiting is normal.',
      ur: 'صرف 25 میں سے ایک بچہ عین متوقع تاریخ پر آتا ہے، اس لیے چند دن مزید انتظار عام بات ہے۔',
    },
    night: {
      en: 'if your waters break or contractions come every five minutes, call your doctor or hospital straight away.',
      ur: 'اگر پانی کی تھیلی پھٹ جائے یا ہر پانچ منٹ بعد درد ہو تو فوراً ڈاکٹر یا ہسپتال کو فون کریں۔',
    },
  },
  41: {
    day: {
      en: 'your doctor may suggest extra monitoring after your due date, so keep every check-up you’re given.',
      ur: 'متوقع تاریخ کے بعد ڈاکٹر اضافی معائنے کا کہہ سکتی ہیں، اس لیے ہر طے شدہ چیک اپ پر جائیں۔',
    },
    night: {
      en: 'keep counting kicks before bed, and call your doctor if you feel fewer movements than usual.',
      ur: 'سونے سے پہلے حرکتیں گنتی رہیں، اور معمول سے کم محسوس ہوں تو ڈاکٹر کو فون کریں۔',
    },
  },
};

export function insightForWeek(week: number): WeeklyInsight {
  const clamped = Math.min(LAST_INSIGHT_WEEK, Math.max(FIRST_INSIGHT_WEEK, Math.round(week)));
  return weeklyInsights[clamped];
}
