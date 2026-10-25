/**
 * Design tokens extracted from the Humraah Figma file (5T4UbrFVHPxJTZbSt1eOzr).
 * Every colour in the app must come from `palette` (optionally with `alpha`).
 */
export const palette = {
  white: '#FFFFFF',
  black: '#000000',
  ink: '#1D1B20',
  charcoal: '#0F0F0F',
  graphite: '#1E1E1E',
  slate: '#444242',
  steel: '#79747E',
  grey: '#8E8E8E',
  silver: '#B3B3B3',
  mist: '#F3F3F3',
  paper: '#F6F6F6',
  sand: '#D6CCB7',
  sky: '#D4E7EE',
  lavender: '#E9DDF3',
  peach: '#FEEDD2',
  sage: '#DAE8CB',
  leaf: '#ACC88E',
  mint: '#AEDCC7',
  coral: '#EC3131',
} as const;

export type PaletteColor = keyof typeof palette;

/** Apply an opacity to a palette hex; mirrors the `@ x%` fills used in Figma. */
export function alpha(hex: string, opacity: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${opacity})`;
}

export const colors = {
  background: palette.paper,
  surface: palette.white,
  text: palette.black,
  textSecondary: palette.slate,
  textSoft: alpha(palette.black, 0.7),
  textMuted: alpha(palette.black, 0.5),
  onDark: palette.white,
  border: alpha(palette.black, 0.3),
  borderStrong: palette.black,
  divider: alpha(palette.black, 0.6),
  icon: palette.ink,
  iconMuted: palette.steel,
  primary: palette.graphite,
  danger: alpha(palette.coral, 0.83),
  dangerText: palette.coral,
  disabled: alpha(palette.silver, 0.41),
  backdrop: alpha(palette.black, 0.35),
} as const;

/** Pastel accents, used to give each card / category its own personality. */
export const tones = ['sky', 'lavender', 'peach', 'sage', 'mint'] as const;
export type Tone = (typeof tones)[number];

/** Plus Jakarta Sans everywhere, so Latin text looks the same on every platform. */
export const fonts = {
  extraLight: 'PlusJakartaSans_200ExtraLight',
  light: 'PlusJakartaSans_300Light',
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  heavy: 'PlusJakartaSans_800ExtraBold',
  italic: 'PlusJakartaSans_600SemiBold_Italic',
  boldItalic: 'PlusJakartaSans_800ExtraBold_Italic',
} as const;

/** Figma frames are drawn at 191pt wide; sizes below are scaled ~2.05× to a 393pt device. */
export const type = {
  display: { fontFamily: fonts.bold, fontSize: 34, lineHeight: 40 },
  heading: { fontFamily: fonts.regular, fontSize: 28, lineHeight: 34 },
  title: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24 },
  subtitle: { fontFamily: fonts.regular, fontSize: 18, lineHeight: 24 },
  label: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 19 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 19 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16 },
  meta: { fontFamily: fonts.regular, fontSize: 10, lineHeight: 14 },
  micro: { fontFamily: fonts.regular, fontSize: 9, lineHeight: 12 },
} as const;

export type TypeVariant = keyof typeof type;

/** Noto Nastaliq Urdu (the readable, traditional Urdu script), mapped from each Latin weight. */
export const urduFonts: Record<string, string> = {
  [fonts.extraLight]: 'NotoNastaliqUrdu_400Regular',
  [fonts.light]: 'NotoNastaliqUrdu_400Regular',
  [fonts.regular]: 'NotoNastaliqUrdu_400Regular',
  [fonts.medium]: 'NotoNastaliqUrdu_500Medium',
  [fonts.semibold]: 'NotoNastaliqUrdu_600SemiBold',
  [fonts.bold]: 'NotoNastaliqUrdu_700Bold',
  [fonts.heavy]: 'NotoNastaliqUrdu_700Bold',
  [fonts.italic]: 'NotoNastaliqUrdu_600SemiBold',
  [fonts.boldItalic]: 'NotoNastaliqUrdu_700Bold',
};

/** Nastaliq is tall and dense: slightly smaller glyphs, much taller lines. */
export const URDU_SIZE = 0.88;
export const URDU_LINE = 1.9;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 12, md: 20, lg: 26, xl: 32, pill: 999 } as const;

export const shadow = {
  soft: {
    shadowColor: palette.black,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  float: {
    shadowColor: palette.black,
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
} as const;

/** Height reserved under scroll content so the floating nav bar never covers it. */
export const NAV_CLEARANCE = 120;
