import { Check, ChevronDown, type LucideIcon } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useI18n } from '@/i18n';
import { alpha, colors, fonts, palette, radius, URDU_SIZE, urduFonts } from '@/theme';
import { enter, exit, layout } from '@/theme/motion';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';
import { useFlip } from './Screen';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'solid' | 'outline' | 'soft';
  icon?: LucideIcon;
  style?: ViewStyle;
  disabled?: boolean;
  size?: 'md' | 'lg';
};

/** Pill buttons from Figma: solid graphite ("Confirm Booking") and outlined ("View Profile"). */
export function Button({ label, onPress, variant = 'solid', icon: Icon, style, disabled, size = 'md' }: ButtonProps) {
  const flip = useFlip();
  const solid = variant === 'solid';
  const fg = solid ? palette.white : colors.text;
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled }}
      style={[
        styles.button,
        size === 'lg' && styles.buttonLg,
        solid && { backgroundColor: colors.primary, borderColor: colors.primary },
        variant === 'soft' && { backgroundColor: palette.white, borderColor: palette.white },
        disabled && { opacity: 0.45 },
        style,
      ]}
    >
      <AppText variant={size === 'lg' ? 'title' : 'subtitle'} weight={solid ? 'bold' : 'regular'} color={fg} align="center" style={{ fontSize: size === 'lg' ? 17 : 16 }}>
        {label}
      </AppText>
      {Icon && <Icon size={20} color={fg} strokeWidth={2} style={flip} />}
    </PressableScale>
  );
}

/** Borderless pill used for filter chips and planner tabs: solid when active, soft white otherwise. */
export function Chip({ label, active, onPress, count, style }: { label: string; active?: boolean; onPress?: () => void; count?: number; style?: ViewStyle }) {
  return (
    <PressableScale onPress={onPress} accessibilityState={{ selected: active }} style={[styles.chip, active && styles.chipActive, style]}>
      <AppText variant="body" weight="medium" color={active ? palette.white : colors.text} style={{ fontSize: 15, lineHeight: 20 }}>
        {label}
      </AppText>
      {count !== undefined && (
        <View style={[styles.count, active && styles.countActive]}>
          <AppText variant="caption" weight="semibold" align="center" color={active ? palette.white : colors.textSecondary}>
            {count}
          </AppText>
        </View>
      )}
    </PressableScale>
  );
}

/** Small borderless chip used on planner rows ("Due: Today", "High", "Test"). */
export function Tag({ label, fill, faded }: { label: string; fill?: string; faded?: boolean }) {
  return (
    <View style={[styles.tag, fill ? { backgroundColor: fill } : null, faded && { opacity: 0.5 }]}>
      <AppText variant="caption" weight="medium" align="center" color={colors.textSecondary} style={{ fontSize: 12, lineHeight: 16 }}>
        {label}
      </AppText>
    </View>
  );
}

/** Font settings for TextInputs, which don't go through AppText. */
export function useInputFont(size = 16) {
  const { lang } = useI18n();
  return lang === 'ur'
    ? { fontFamily: urduFonts[fonts.regular], fontSize: size * URDU_SIZE, textAlign: 'right' as const, writingDirection: 'rtl' as const }
    : { fontFamily: fonts.regular, fontSize: size };
}

export function TextField({ icon: Icon, style, multiline, ...rest }: Omit<TextInputProps, 'style'> & { icon?: LucideIcon; style?: StyleProp<ViewStyle> }) {
  const [focused, setFocused] = useState(false);
  const font = useInputFont();
  return (
    <View style={[styles.field, multiline && styles.fieldMulti, focused && styles.fieldFocused, style]}>
      {Icon && <Icon size={20} color={colors.iconMuted} strokeWidth={1.8} />}
      <TextInput
        placeholderTextColor={palette.grey}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        style={[styles.input, font, multiline && { height: '100%' }]}
      />
    </View>
  );
}

/** Dropdown that expands inline (no nested modal), so it also works inside bottom sheets. */
export function SelectField<T extends string>({
  value,
  options,
  onChange,
  placeholder,
  format = (v) => v,
  icon,
  style,
}: {
  value?: T;
  options: readonly T[];
  onChange: (v: T) => void;
  placeholder?: string;
  format?: (v: T) => string;
  icon?: ReactNode;
  style?: ViewStyle;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Animated.View layout={layout} style={[{ flex: 1 }, style]}>
      <PressableScale scaleTo={0.98} onPress={() => setOpen((o) => !o)} style={styles.select} accessibilityState={{ expanded: open }}>
        <AppText variant="subtitle" color={value ? colors.text : palette.grey} numberOfLines={1} style={{ flex: 1, fontSize: 16 }}>
          {value ? format(value) : placeholder}
        </AppText>
        {icon ?? (
          <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
            <ChevronDown size={22} color={colors.text} strokeWidth={2.4} />
          </View>
        )}
      </PressableScale>
      {open && (
        <Animated.View entering={enter.drop()} exiting={exit.fade} style={styles.menu}>
          {options.map((o) => (
            <PressableScale
              key={o}
              scaleTo={0.98}
              onPress={() => {
                onChange(o);
                setOpen(false);
              }}
              style={[styles.option, o === value && { backgroundColor: palette.mist }]}
            >
              <AppText variant="body" style={{ flex: 1 }}>
                {format(o)}
              </AppText>
              {o === value && <Check size={16} color={colors.text} />}
            </PressableScale>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <AppText variant="subtitle" style={{ fontSize: 16, marginBottom: 6 }}>
      {children}
    </AppText>
  );
}

/** Inline coral message for validation errors. */
export function ErrorText({ children }: { children?: string | false | null }) {
  if (!children) return null;
  return (
    <Animated.View entering={enter.drop()}>
      <AppText variant="caption" color={colors.dangerText} style={{ fontSize: 13 }}>
        {children}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonLg: { minHeight: 56 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingStart: 16,
    paddingEnd: 6,
    minHeight: 44,
    borderRadius: radius.pill,
    backgroundColor: palette.white,
  },
  chipActive: { backgroundColor: colors.primary },
  count: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: alpha(palette.black, 0.05),
    alignItems: 'center',
    justifyContent: 'center',
  },
  countActive: { backgroundColor: alpha(palette.white, 0.16) },
  tag: {
    paddingHorizontal: 10,
    minHeight: 24,
    borderRadius: radius.pill,
    backgroundColor: alpha(palette.black, 0.05),
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 50,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  fieldMulti: { height: 112, borderRadius: 18, alignItems: 'flex-start', paddingVertical: 12 },
  fieldFocused: { borderWidth: 1.6 },
  input: { flex: 1, color: colors.text, paddingVertical: 8 },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    gap: 8,
  },
  menu: {
    marginTop: 6,
    borderRadius: 18,
    backgroundColor: palette.white,
    padding: 6,
    borderWidth: 1,
    borderColor: alpha(palette.black, 0.08),
  },
  option: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 },
});
