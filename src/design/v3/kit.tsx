import { BlurTargetView, BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, type LucideIcon } from 'lucide-react-native';
import { Children, createContext, Fragment, useContext, useEffect, useId, useRef, useState, type ComponentRef, type ReactNode, type RefObject } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, RadialGradient, Rect, Stop } from 'react-native-svg';
import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { useInputFont } from '@/components/Controls';
import { PressableScale } from '@/components/PressableScale';
import { useDirection, useFlip } from '@/components/Screen';
import { useI18n, type Lang } from '@/i18n';
import { fonts } from '@/theme';
import { enter, exit } from '@/theme/motion';
import { floatShadow, GUTTER_V3, radiusV3, shapeTones, v3, type ShapeTone } from './tokens';

type Weight = 'extraLight' | 'light' | 'regular' | 'medium' | 'semibold';

/** Browsers draw a focus rectangle inside inputs; the glass capsule already shows focus. */
export const noWebOutline = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as TextStyle;

/* -------------------------------------------------------------- backdrop */

type BlurTarget = RefObject<ComponentRef<typeof View> | null>;
const BlurTargetContext = createContext<BlurTarget | null>(null);

export type OrbLayout = 'a' | 'b' | 'c';
const orbLayouts: Record<OrbLayout, { color: string; cx: string; cy: string; r: string }[]> = {
  a: [
    { color: v3.rose, cx: '88%', cy: '8%', r: '48%' },
    { color: v3.lavender, cx: '6%', cy: '46%', r: '52%' },
    { color: v3.sage, cx: '92%', cy: '86%', r: '46%' },
  ],
  b: [
    { color: v3.lavender, cx: '14%', cy: '10%', r: '50%' },
    { color: v3.sage, cx: '96%', cy: '42%', r: '44%' },
    { color: v3.rose, cx: '20%', cy: '92%', r: '50%' },
  ],
  c: [
    { color: v3.sage, cx: '80%', cy: '14%', r: '46%' },
    { color: v3.rose, cx: '4%', cy: '30%', r: '42%' },
    { color: v3.lavender, cx: '70%', cy: '78%', r: '56%' },
  ],
};

/**
 * Soft organic orbs drawn once as radial gradients that fade to nothing: the "blur" is baked into
 * the gradient, so no live filter runs while scrolling. The layer is rasterised and doubles as the
 * Android blur target, so every glass card frosts this one static layer.
 */
function Backdrop({ layout, target }: { layout: OrbLayout; target: BlurTarget }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const orbs = orbLayouts[layout];
  return (
    <BlurTargetView ref={target} style={StyleSheet.absoluteFill} pointerEvents="none" shouldRasterizeIOS renderToHardwareTextureAndroid>
      <Svg width="100%" height="100%">
        <Defs>
          {orbs.map((o, i) => (
            <RadialGradient key={i} id={`orb${uid}${i}`} cx={o.cx} cy={o.cy} r={o.r} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={o.color} stopOpacity={0.95} />
              <Stop offset="0.55" stopColor={o.color} stopOpacity={0.45} />
              <Stop offset="1" stopColor={o.color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        <Rect width="100%" height="100%" fill={v3.bone} />
        {orbs.map((_, i) => (
          <Rect key={i} width="100%" height="100%" fill={`url(#orb${uid}${i})`} />
        ))}
      </Svg>
    </BlurTargetView>
  );
}

/** Bone canvas with orbs behind everything. Glass inside the screen blurs the orbs. */
export function ScreenV3({ children, edges = ['top'], orbs = 'a' }: { children: ReactNode; edges?: Edge[]; orbs?: OrbLayout }) {
  const dir = useDirection();
  const target = useRef<ComponentRef<typeof View>>(null);
  return (
    <BlurTargetContext.Provider value={target}>
      <View style={[styles.screen, dir]}>
        <Backdrop layout={orbs} target={target} />
        <SafeAreaView edges={edges} style={{ flex: 1 }}>
          {children}
        </SafeAreaView>
      </View>
    </BlurTargetContext.Provider>
  );
}

/* ----------------------------------------------------------------- glass */

/**
 * Frosted panel: a BlurView with a faint white tint, a 1px luminous edge and a wide soft shadow.
 * The outer wrapper never clips, so `breakout` content (avatars, 3D shapes) can overlap the edge.
 */
export function Glass({
  children,
  style,
  wrapStyle,
  radius = radiusV3.card,
  intensity = 40,
  breakout,
  onPress,
  index,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  wrapStyle?: StyleProp<ViewStyle>;
  radius?: number;
  intensity?: number;
  breakout?: ReactNode;
  onPress?: () => void;
  index?: number;
}) {
  const target = useContext(BlurTargetContext);
  const pane = (
    <>
      <BlurView
        intensity={intensity}
        tint="light"
        blurTarget={target ?? undefined}
        // Real blur on Android 12+ only; older devices get the tinted pane, which keeps scrolling smooth.
        blurMethod={target ? 'dimezisBlurViewSdk31Plus' : 'none'}
        style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}
      />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: radius, backgroundColor: v3.glass, borderWidth: 1, borderColor: v3.edge }]} />
      <View style={[styles.glassBody, style]}>{children}</View>
    </>
  );
  return (
    <Animated.View entering={index === undefined ? undefined : enter.rise(index)} style={[{ borderRadius: radius }, styles.shadow, wrapStyle]}>
      {onPress ? (
        <PressableScale scaleTo={0.985} onPress={onPress} style={{ borderRadius: radius }}>
          {pane}
        </PressableScale>
      ) : (
        pane
      )}
      {breakout}
    </Animated.View>
  );
}

/* ------------------------------------------------------- abstract shapes */

export type { ShapeTone } from './tokens';

/**
 * Soft 3D form (a pearl or a pebble) lit from the upper left. Now only the backing for portraits;
 * standalone illustrations use `Object3D`, whose objects say what their screen is about.
 */
export function Shape3D({ tone = 'rose', size = 120, kind = 'sphere', style }: { tone?: ShapeTone; size?: number; kind?: 'sphere' | 'pebble'; style?: StyleProp<ViewStyle> }) {
  const id = `s${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [hi, mid, lo] = shapeTones[tone];
  const h = kind === 'pebble' ? size * 0.78 : size;
  return (
    <View pointerEvents="none" style={[{ width: size, height: h + size * 0.12 }, style]}>
      <Svg width={size} height={h + size * 0.12}>
        <Defs>
          <RadialGradient id={id} cx="36%" cy="30%" r="72%">
            <Stop offset="0" stopColor={hi} />
            <Stop offset="0.45" stopColor={mid} />
            <Stop offset="1" stopColor={lo} />
          </RadialGradient>
          <RadialGradient id={`${id}sh`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#3A2E2A" stopOpacity={0.18} />
            <Stop offset="1" stopColor="#3A2E2A" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={size / 2} cy={h + size * 0.04} rx={size * 0.38} ry={size * 0.07} fill={`url(#${id}sh)`} />
        {kind === 'pebble' ? <Ellipse cx={size / 2} cy={h / 2} rx={size / 2} ry={h / 2} fill={`url(#${id})`} /> : <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />}
      </Svg>
    </View>
  );
}

/** Portrait for people (doctors, contacts, the user): initials set in light type on a soft pearl. */
export function PortraitV3({ initials, size = 72, tone = 'lavender', style }: { initials: string; size?: number; tone?: ShapeTone; style?: StyleProp<ViewStyle> }) {
  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <Shape3D tone={tone} size={size} style={{ position: 'absolute', top: 0, left: 0 }} />
      <View style={[StyleSheet.absoluteFill, styles.center, { borderRadius: size / 2, borderWidth: 1, borderColor: v3.edge }]}>
        <Text style={{ fontFamily: fonts.light, fontSize: size * 0.32, color: v3.black, letterSpacing: 0.5 }}>{initials}</Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------- typography */

type TProps = { children: ReactNode; size?: number; weight?: Weight; color?: string; align?: 'left' | 'center' | 'right'; style?: StyleProp<TextStyle>; numberOfLines?: number };

export function T({ children, size = 15, weight = 'regular', color = v3.black, align, style, numberOfLines }: TProps) {
  return (
    <AppText variant="body" weight={weight} color={color} align={align} numberOfLines={numberOfLines} style={[{ fontSize: size, lineHeight: Math.round(size * 1.45) }, style]}>
      {children}
    </AppText>
  );
}

/** Massive, light page header. */
export function H1V3({ children, size = 44, align, style }: { children: ReactNode; size?: number; align?: 'left' | 'center'; style?: StyleProp<TextStyle> }) {
  return (
    <AppText variant="heading" weight="light" color={v3.black} align={align} accessibilityRole="header" style={[{ fontSize: size, lineHeight: Math.round(size * 1.1), letterSpacing: -1.2 }, style]}>
      {children}
    </AppText>
  );
}

/** Small spaced label above a header or inside a grid cell. */
export function Kicker({ children, color = v3.muted }: { children: ReactNode; color?: string }) {
  const { lang } = useI18n();
  return (
    <AppText variant="caption" weight="medium" color={color} style={lang === 'en' ? { fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase' } : { fontSize: 12 }}>
      {children}
    </AppText>
  );
}

/** Editorial figure: an extra-light numeral at display size. Digits always use the Latin face. */
export function Figure({ value, size = 56, color = v3.black }: { value: string | number; size?: number; color?: string }) {
  return <Text style={{ fontFamily: fonts.extraLight, fontSize: size, lineHeight: Math.round(size * 1.08), letterSpacing: -2, color }}>{value}</Text>;
}

/* ---------------------------------------------------------- editorial grid */

export function HRule({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.hRule, style]} />;
}

/** A row of cells divided by ultra-thin vertical hairlines. */
export function Cells({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const items = Children.toArray(children);
  return (
    <View style={[styles.cells, style]}>
      {items.map((c, i) => (
        <Fragment key={i}>
          {i > 0 && <View style={styles.vRule} />}
          <View style={styles.cell}>{c}</View>
        </Fragment>
      ))}
    </View>
  );
}

/** A labelled value for use inside `Cells`. */
export function Stat({ label, value, size = 44, note }: { label: string; value: string | number; size?: number; note?: string }) {
  return (
    <View style={{ gap: 4 }}>
      <Kicker>{label}</Kicker>
      <Figure value={value} size={size} />
      {note && (
        <T size={12} color={v3.muted}>
          {note}
        </T>
      )}
    </View>
  );
}

/* --------------------------------------------------------------- controls */

export function ButtonV3({ label, onPress, variant = 'primary', icon: Icon, disabled, style }: { label: string; onPress?: () => void; variant?: 'primary' | 'glass'; icon?: LucideIcon; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const flip = useFlip();
  const primary = variant === 'primary';
  const fg = primary ? v3.white : v3.black;
  return (
    <PressableScale onPress={onPress} disabled={disabled} accessibilityState={{ disabled }} style={[styles.button, primary ? { backgroundColor: v3.black } : styles.glassControl, disabled && { opacity: 0.35 }, style]}>
      <T size={16} weight="medium" color={fg}>
        {label}
      </T>
      {Icon && <Icon size={18} color={fg} strokeWidth={1.6} style={flip} />}
    </PressableScale>
  );
}

/** Circular glass button with the luminous edge. */
export function IconButtonV3({ icon: Icon, onPress, label, size = 46, dot, flipIcon }: { icon: LucideIcon; onPress: () => void; label: string; size?: number; dot?: boolean; flipIcon?: boolean }) {
  const flip = useFlip();
  return (
    <PressableScale onPress={onPress} accessibilityLabel={label} style={[styles.center, styles.glassControl, { width: size, height: size, borderRadius: size / 2 }]}>
      <Icon size={size * 0.42} color={v3.black} strokeWidth={1.5} style={flipIcon ? flip : undefined} />
      {dot && <View style={styles.dot} />}
    </PressableScale>
  );
}

/** Static circular glass icon. */
export function IconGlass({ icon: Icon, size = 42, dark }: { icon: LucideIcon; size?: number; dark?: boolean }) {
  return (
    <View style={[styles.center, dark ? { backgroundColor: v3.black } : styles.glassControl, { width: size, height: size, borderRadius: size / 2 }]}>
      <Icon size={size * 0.44} color={dark ? v3.white : v3.black} strokeWidth={1.5} />
    </View>
  );
}

/** Semi-transparent pill tag with the white edge; `active` switches it to solid black. */
export function TagV3({ label, active, onPress, count }: { label: string; active?: boolean; onPress?: () => void; count?: number }) {
  const body = (
    <>
      <T size={13} weight={active ? 'medium' : 'regular'} color={active ? v3.white : v3.black}>
        {label}
      </T>
      {count !== undefined && (
        <T size={12} weight="medium" color={active ? 'rgba(255,255,255,0.6)' : v3.muted}>
          {count}
        </T>
      )}
    </>
  );
  const style = [styles.tag, active ? { backgroundColor: v3.black, borderColor: v3.black } : styles.glassControl];
  if (!onPress) return <View style={style}>{body}</View>;
  return (
    <PressableScale onPress={onPress} accessibilityState={{ selected: active }} style={style}>
      {body}
    </PressableScale>
  );
}

export function ChoiceV3<T extends string>({ options, value, onChange, format = (v) => v }: { options: readonly T[]; value?: T; onChange: (v: T) => void; format?: (v: T) => string }) {
  return (
    <View style={styles.wrap}>
      {options.map((o) => (
        <TagV3 key={o} label={format(o)} active={o === value} onPress={() => onChange(o)} />
      ))}
    </View>
  );
}

/** Glass capsule switch with a solid black active pill. */
export function SegmentedV3<T extends string>({ options, value, onChange }: { options: { key: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={[styles.segmented, styles.glassControl]}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <PressableScale key={o.key} onPress={() => onChange(o.key)} accessibilityRole="radio" accessibilityState={{ selected: active }} style={[styles.segment, active && { backgroundColor: v3.black }]}>
            <T size={14} weight={active ? 'medium' : 'regular'} color={active ? v3.white : v3.black} align="center">
              {o.label}
            </T>
          </PressableScale>
        );
      })}
    </View>
  );
}

export function LangV3() {
  const { lang, setLang } = useI18n();
  const opts: { key: Lang; label: string }[] = [
    { key: 'en', label: 'EN' },
    { key: 'ur', label: 'اردو' },
  ];
  return (
    <View style={[styles.segmented, styles.glassControl, { padding: 3 }]}>
      {opts.map((o) => {
        const active = o.key === lang;
        return (
          <PressableScale key={o.key} onPress={() => setLang(o.key)} accessibilityRole="radio" accessibilityState={{ selected: active }} style={[styles.langItem, active && { backgroundColor: v3.black }]}>
            <Text style={{ fontFamily: o.key === 'ur' ? 'NotoNastaliqUrdu_400Regular' : fonts.medium, fontSize: 12, lineHeight: o.key === 'ur' ? 22 : 16, color: active ? v3.white : v3.black }}>{o.label}</Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

/** Round check: a hairline ring when open, solid black with a white tick when done. Without `onPress` it is display only. */
export function CheckV3({ checked, onPress, size = 28 }: { checked: boolean; onPress?: () => void; size?: number }) {
  const style = [styles.center, { width: size, height: size, borderRadius: size / 2, borderWidth: 1, borderColor: checked ? v3.black : 'rgba(0,0,0,0.35)', backgroundColor: checked ? v3.black : 'transparent' }];
  const tick = checked && (
    <Animated.View entering={enter.pop()}>
      <Check size={size * 0.5} color={v3.white} strokeWidth={2.4} />
    </Animated.View>
  );
  if (!onPress) return <View style={style}>{tick}</View>;
  return (
    <PressableScale onPress={onPress} scaleTo={0.85} accessibilityRole="checkbox" accessibilityState={{ checked }} style={style}>
      {tick}
    </PressableScale>
  );
}

export function SwitchV3({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
  return <Switch value={value} onValueChange={onValueChange} trackColor={{ true: v3.black, false: 'rgba(0,0,0,0.12)' }} thumbColor={v3.white} ios_backgroundColor="rgba(0,0,0,0.12)" />;
}

export function FieldV3({ icon: Icon, multiline, style, ...rest }: Omit<TextInputProps, 'style'> & { icon?: LucideIcon; style?: StyleProp<ViewStyle> }) {
  const [focused, setFocused] = useState(false);
  const font = useInputFont();
  return (
    <View style={[styles.field, styles.glassControl, multiline && styles.fieldMulti, focused && { borderColor: v3.black }, style]}>
      {Icon && <Icon size={18} color={v3.black} strokeWidth={1.5} />}
      <TextInput
        placeholderTextColor={v3.muted}
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
        style={[{ flex: 1, color: v3.black, minHeight: 22 }, noWebOutline, font, multiline && { height: '100%' }]}
      />
    </View>
  );
}

export function ErrorV3({ children }: { children?: string | false | null }) {
  if (!children) return null;
  return (
    <Animated.View entering={enter.drop()} style={[styles.tag, styles.glassControl, { alignSelf: 'flex-start', borderColor: v3.rose }]}>
      <T size={13} weight="medium">
        {children}
      </T>
    </Animated.View>
  );
}

/* -------------------------------------------------------------- structure */

export function TopBarV3({ onBack, title, right }: { onBack?: () => void; title?: string; right?: ReactNode }) {
  const router = useRouter();
  const { t } = useI18n();
  return (
    <View style={styles.topBar}>
      <IconButtonV3 icon={ArrowLeft} flipIcon label={t('common.back')} onPress={onBack ?? (() => router.back())} />
      <View style={{ flex: 1, alignItems: 'center' }}>
        {title && (
          <T size={14} weight="medium" numberOfLines={1}>
            {title}
          </T>
        )}
      </View>
      {right ?? <View style={{ width: 46 }} />}
    </View>
  );
}

/** A plain-text row with a hairline above it; the editorial list item used across Design 3. */
export function LineRow({ children, first, onPress }: { children: ReactNode; first?: boolean; onPress?: () => void }) {
  const style = [styles.lineRow, !first && styles.lineRowRule];
  if (onPress)
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [style, pressed && { opacity: 0.6 }]}>
        {children}
      </Pressable>
    );
  return <View style={style}>{children}</View>;
}

export function SheetV3({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: ReactNode }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} color={v3.bone} radius={radiusV3.card}>
      {children}
    </BottomSheet>
  );
}

export function ToastV3({ message, actionLabel, onAction, onHide, bottom = 116 }: { message: string | null; actionLabel?: string; onAction?: () => void; onHide: () => void; bottom?: number }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onHide, 3500);
    return () => clearTimeout(id);
  }, [message, onHide]);
  if (!message) return null;
  return (
    <Animated.View entering={enter.drop()} exiting={exit.fade} style={[styles.toast, { bottom }]}>
      <T size={14} color={v3.white} style={{ flex: 1 }}>
        {message}
      </T>
      {actionLabel && (
        <PressableScale
          onPress={() => {
            onAction?.();
            onHide();
          }}
          style={styles.toastAction}
        >
          <T size={13} weight="medium">
            {actionLabel}
          </T>
        </PressableScale>
      )}
    </Animated.View>
  );
}

export function AuthFrameV3({ children, footer, orbs = 'b' }: { children: ReactNode; footer?: ReactNode; orbs?: OrbLayout }) {
  const router = useRouter();
  const { t } = useI18n();
  return (
    <ScreenV3 edges={['top', 'bottom']} orbs={orbs}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.authTop}>
          <IconButtonV3 icon={ArrowLeft} flipIcon label={t('common.back')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))} />
          <LangV3 />
        </View>
        <ScrollView contentContainerStyle={styles.authBody} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
        {footer && <View style={styles.authFooter}>{footer}</View>}
      </KeyboardAvoidingView>
    </ScreenV3>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: v3.bone },
  center: { alignItems: 'center', justifyContent: 'center' },
  // Android elevation draws a grey slab through translucent panels, so the float is iOS and web only.
  shadow: Platform.OS === 'android' ? {} : floatShadow,
  glassBody: { padding: 22 },
  glassControl: { backgroundColor: v3.glassStrong, borderWidth: 1, borderColor: v3.edge },
  hRule: { height: 1, backgroundColor: v3.hairline },
  cells: { flexDirection: 'row', alignItems: 'stretch' },
  cell: { flex: 1, paddingHorizontal: 14, paddingVertical: 4 },
  vRule: { width: 1, backgroundColor: v3.hairline },
  button: { minHeight: 56, borderRadius: radiusV3.pill, paddingHorizontal: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  dot: { position: 'absolute', top: 11, end: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: v3.black },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 34, paddingHorizontal: 14, borderRadius: radiusV3.pill },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segmented: { flexDirection: 'row', padding: 4, gap: 4, borderRadius: radiusV3.pill },
  segment: { flex: 1, minHeight: 42, borderRadius: radiusV3.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  langItem: { minWidth: 44, height: 32, borderRadius: radiusV3.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingHorizontal: 20, borderRadius: radiusV3.pill },
  fieldMulti: { borderRadius: radiusV3.inner, height: 116, alignItems: 'flex-start', paddingVertical: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: GUTTER_V3, paddingTop: 8, paddingBottom: 4 },
  lineRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 },
  lineRowRule: { borderTopWidth: 1, borderTopColor: v3.hairline },
  toast: {
    position: 'absolute',
    left: GUTTER_V3,
    right: GUTTER_V3,
    minHeight: 54,
    borderRadius: radiusV3.pill,
    backgroundColor: v3.black,
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 22,
    paddingEnd: 7,
    gap: 10,
  },
  toastAction: { backgroundColor: v3.white, borderRadius: radiusV3.pill, paddingHorizontal: 16, paddingVertical: 9 },
  authTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: GUTTER_V3, paddingTop: 8 },
  authBody: { paddingHorizontal: GUTTER_V3, paddingTop: 30, paddingBottom: 24, gap: 18 },
  authFooter: { paddingHorizontal: GUTTER_V3, paddingBottom: 12, gap: 12 },
});
