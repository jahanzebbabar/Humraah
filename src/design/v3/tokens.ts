/**
 * Design 3 "Ethereal Glassmorphism" tokens: a warm bone canvas, soft orbs behind frosted glass,
 * and pure black kept for primary text and anything that is switched on.
 */
export const v3 = {
  bone: '#F4F3F0',
  black: '#000000',
  /** Secondary text: warm grey that sits quietly on glass. */
  muted: '#7A746C',
  /** Glass fill laid over the blur. */
  glass: 'rgba(255, 255, 255, 0.4)',
  /** Slightly stronger glass for small controls that need to read as tappable. */
  glassStrong: 'rgba(255, 255, 255, 0.55)',
  /** The luminous cut-glass edge on every card, tag and circular button. */
  edge: 'rgba(255, 255, 255, 0.6)',
  /** Architectural hairlines inside cards. */
  hairline: 'rgba(0, 0, 0, 0.08)',
  /** Background orbs. */
  rose: '#E8BFC4',
  lavender: '#CFC6E6',
  sage: '#C5D6C0',
  white: '#FFFFFF',
} as const;

export const radiusV3 = { card: 30, inner: 22, pill: 999 } as const;

export const GUTTER_V3 = 22;

/** Very wide, very soft drop shadow so glass panels appear to float. */
export const floatShadow = {
  shadowColor: '#3A2E2A',
  shadowOpacity: 0.08,
  shadowRadius: 32,
  shadowOffset: { width: 0, height: 18 },
  elevation: 6,
} as const;

/** Highlight, body and shade for the soft 3D forms, lit from the upper left. */
export const shapeTones = {
  rose: ['#FFFFFF', '#F2D3D7', '#C98E97'],
  lavender: ['#FFFFFF', '#DDD5F0', '#9C8FC4'],
  sage: ['#FFFFFF', '#D8E5D3', '#8FA886'],
  /** Warm, pale gold kept as soft as the other three: only for things that are truly yellow (corn). */
  butter: ['#FFFFFF', '#F5E6BC', '#CDAE63'],
} as const;
export type ShapeTone = keyof typeof shapeTones;
