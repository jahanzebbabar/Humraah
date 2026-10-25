import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';
import { useI18n } from '@/i18n';
import { colors, fonts, type as typeScale, URDU_LINE, URDU_SIZE, urduFonts, type TypeVariant } from '@/theme';

type Props = TextProps & {
  variant?: TypeVariant;
  color?: string;
  weight?: keyof typeof fonts;
  align?: 'left' | 'center' | 'right';
};

/** All text goes through here so the Urdu font, size and right-to-left alignment are applied in one place. */
export function AppText({ variant = 'body', color = colors.text, weight, align, style, ...rest }: Props) {
  const { lang } = useI18n();
  let flat: TextStyle = StyleSheet.flatten([
    typeScale[variant],
    { color },
    weight && { fontFamily: fonts[weight] },
    align && { textAlign: align },
    style,
  ] as StyleProp<TextStyle>) ?? {};

  if (lang === 'ur') {
    const size = (flat.fontSize ?? 14) * URDU_SIZE;
    flat = {
      ...flat,
      fontFamily: flat.fontFamily?.startsWith('NotoNastaliq')
        ? flat.fontFamily
        : (urduFonts[flat.fontFamily ?? fonts.regular] ?? urduFonts[fonts.regular]),
      fontSize: size,
      lineHeight: Math.round(size * URDU_LINE),
      letterSpacing: 0,
      fontStyle: 'normal',
      textAlign: flat.textAlign === 'center' ? 'center' : 'right',
      writingDirection: 'rtl',
    };
  }

  return <Text {...rest} style={flat} />;
}
