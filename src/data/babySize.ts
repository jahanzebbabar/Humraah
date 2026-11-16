import type { Loc } from '@/i18n';

/**
 * Typical size by week of pregnancy. Before week 20 length is crown to rump (legs are curled up);
 * from week 20 it is crown to heel, which is why the length jumps there. Averages only: every baby grows at its own pace.
 */
export type BabySize = { fruit: Loc; cm: number; g: number };

const sizes: Record<number, BabySize> = {
  4: { fruit: { en: 'a poppy seed', ur: 'خشخاش کا دانہ' }, cm: 0.1, g: 0 },
  5: { fruit: { en: 'a sesame seed', ur: 'تل کا دانہ' }, cm: 0.2, g: 0 },
  6: { fruit: { en: 'a lentil', ur: 'دال کا دانہ' }, cm: 0.6, g: 0 },
  7: { fruit: { en: 'a blueberry', ur: 'فالسہ' }, cm: 1.3, g: 1 },
  8: { fruit: { en: 'a raspberry', ur: 'شہتوت' }, cm: 1.6, g: 1 },
  9: { fruit: { en: 'a cherry', ur: 'چیری' }, cm: 2.3, g: 2 },
  10: { fruit: { en: 'a strawberry', ur: 'اسٹرابیری' }, cm: 3.1, g: 4 },
  11: { fruit: { en: 'a fig', ur: 'انجیر' }, cm: 4.1, g: 7 },
  12: { fruit: { en: 'a plum', ur: 'آلو بخارا' }, cm: 5.4, g: 14 },
  13: { fruit: { en: 'a lemon', ur: 'لیموں' }, cm: 7.4, g: 23 },
  14: { fruit: { en: 'a peach', ur: 'آڑو' }, cm: 8.7, g: 43 },
  15: { fruit: { en: 'an apple', ur: 'سیب' }, cm: 10.1, g: 70 },
  16: { fruit: { en: 'an avocado', ur: 'ایواکاڈو' }, cm: 11.6, g: 100 },
  17: { fruit: { en: 'a pomegranate', ur: 'انار' }, cm: 13, g: 140 },
  18: { fruit: { en: 'a sweet potato', ur: 'شکر قندی' }, cm: 14.2, g: 190 },
  19: { fruit: { en: 'a mango', ur: 'آم' }, cm: 15.3, g: 240 },
  20: { fruit: { en: 'a banana', ur: 'کیلا' }, cm: 25.6, g: 300 },
  21: { fruit: { en: 'a carrot', ur: 'گاجر' }, cm: 26.7, g: 360 },
  22: { fruit: { en: 'a papaya', ur: 'پپیتا' }, cm: 27.8, g: 430 },
  23: { fruit: { en: 'a grapefruit', ur: 'چکوترا' }, cm: 28.9, g: 500 },
  24: { fruit: { en: 'an ear of corn', ur: 'مکئی کا بھٹا' }, cm: 30, g: 600 },
  25: { fruit: { en: 'a cauliflower', ur: 'پھول گوبھی' }, cm: 34.6, g: 660 },
  26: { fruit: { en: 'a head of lettuce', ur: 'سلاد کا پتہ گوبھی' }, cm: 35.6, g: 760 },
  27: { fruit: { en: 'a cabbage', ur: 'بند گوبھی' }, cm: 36.6, g: 875 },
  28: { fruit: { en: 'an aubergine', ur: 'بینگن' }, cm: 37.6, g: 1000 },
  29: { fruit: { en: 'a butternut squash', ur: 'میٹھا کدو' }, cm: 38.6, g: 1150 },
  30: { fruit: { en: 'a large cucumber', ur: 'بڑا کھیرا' }, cm: 39.9, g: 1300 },
  31: { fruit: { en: 'a coconut', ur: 'ناریل' }, cm: 41.1, g: 1500 },
  32: { fruit: { en: 'a bottle gourd', ur: 'لوکی' }, cm: 42.4, g: 1700 },
  33: { fruit: { en: 'a pineapple', ur: 'انناس' }, cm: 43.7, g: 1900 },
  34: { fruit: { en: 'a cantaloupe', ur: 'خربوزہ' }, cm: 45, g: 2100 },
  35: { fruit: { en: 'a honeydew melon', ur: 'سردا' }, cm: 46.2, g: 2400 },
  36: { fruit: { en: 'a bunch of bananas', ur: 'کیلوں کا گچھا' }, cm: 47.4, g: 2600 },
  37: { fruit: { en: 'a winter melon', ur: 'پیٹھا' }, cm: 48.6, g: 2900 },
  38: { fruit: { en: 'a pumpkin', ur: 'کدو' }, cm: 49.8, g: 3100 },
  39: { fruit: { en: 'a small watermelon', ur: 'چھوٹا تربوز' }, cm: 50.7, g: 3300 },
  40: { fruit: { en: 'a watermelon', ur: 'تربوز' }, cm: 51.2, g: 3500 },
  41: { fruit: { en: 'a jackfruit', ur: 'کٹہل' }, cm: 51.5, g: 3600 },
  42: { fruit: { en: 'a jackfruit', ur: 'کٹہل' }, cm: 51.7, g: 3700 },
};

export function babySizeForWeek(week: number): BabySize {
  return sizes[Math.min(42, Math.max(4, Math.round(week)))]!;
}

/** Length to one decimal while it is small, whole centimetres once it is not. */
export const formatCm = (cm: number) => (cm < 10 ? cm.toFixed(1) : String(Math.round(cm)));
/** The earliest weeks weigh well under a gram. */
export const formatG = (g: number) => (g < 1 ? '<1' : String(g));

/** How large to draw the baby's 3D object: it grows with the pregnancy instead of staying one size. */
export const babyObjectSize = (week: number, max: number) => Math.round(max * (0.45 + 0.55 * Math.min(1, Math.max(0, (week - 4) / 36))));

/** Current week from the due date, so the week moves on by itself after sign-up. */
export function weekFromDueDate(dueDate: string, now = Date.now()) {
  const daysLeft = (new Date(dueDate).getTime() - now) / 86400000;
  return Math.min(42, Math.max(4, Math.round(40 - daysLeft / 7)));
}
