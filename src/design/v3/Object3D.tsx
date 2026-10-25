import { useId, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { shapeTones, type ShapeTone } from './tokens';

export type ObjectKind = 'corn' | 'lotus' | 'capsule' | 'calendar' | 'envelope' | 'heart' | 'feet' | 'stethoscope' | 'rattle';

/**
 * Soft 3D objects that say what their screen is about (the baby's size, a calm breath, a dose, a date)
 * in the same language as the pearls: matte pastel bodies lit from the upper left, a white specular
 * glint and a soft contact shadow. Drawn on a 100 by 100 grid and scaled to `size`.
 */
export function Object3D({ kind, size = 120, tone, style }: { kind: ObjectKind; size?: number; tone?: ShapeTone; style?: StyleProp<ViewStyle> }) {
  const uid = `o${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const Body = bodies[kind];
  const main = tone ?? defaults[kind];
  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          {(Object.keys(shapeTones) as ShapeTone[]).map((t) => (
            <RadialGradient key={t} id={`${uid}${t}`} cx="34%" cy="28%" r="78%">
              <Stop offset="0" stopColor={shapeTones[t][0]} />
              <Stop offset="0.45" stopColor={shapeTones[t][1]} />
              <Stop offset="1" stopColor={shapeTones[t][2]} />
            </RadialGradient>
          ))}
          <RadialGradient id={`${uid}glint`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.9} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id={`${uid}shadow`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#3A2E2A" stopOpacity={0.2} />
            <Stop offset="1" stopColor="#3A2E2A" stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id={`${uid}tube`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={shapeTones[main][1]} />
            <Stop offset="1" stopColor={shapeTones[main][2]} />
          </LinearGradient>
        </Defs>
        <Ellipse cx={50} cy={93} rx={30} ry={4.5} fill={`url(#${uid}shadow)`} />
        <Body fill={(t: ShapeTone = main) => `url(#${uid}${t})`} glint={`url(#${uid}glint)`} tube={`url(#${uid}tube)`} shade={shapeTones[main][2]} />
      </Svg>
    </View>
  );
}

const defaults: Record<ObjectKind, ShapeTone> = {
  corn: 'butter',
  lotus: 'lavender',
  capsule: 'rose',
  calendar: 'lavender',
  envelope: 'sage',
  heart: 'rose',
  feet: 'rose',
  stethoscope: 'lavender',
  rattle: 'rose',
};

type Paint = { fill: (tone?: ShapeTone) => string; glint: string; tube: string; shade: string };

/** One soft white glint where the light lands. */
const Glint = ({ paint, cx, cy, rx, ry, rotate = 0 }: { paint: string; cx: number; cy: number; rx: number; ry: number; rotate?: number }) => (
  <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={paint} transform={`rotate(${rotate} ${cx} ${cy})`} />
);

const PETAL = 'M50 82 C 36 64, 37 40, 50 18 C 63 40, 64 64, 50 82 Z';
const HEART = 'M50 86 C 22 68, 9 50, 16 34 C 23 19, 42 18, 50 33 C 58 18, 77 19, 84 34 C 91 50, 78 68, 50 86 Z';

const bodies: Record<ObjectKind, (p: Paint) => ReactNode> = {
  // This week's baby: an ear of corn wrapped in two husk leaves.
  corn: ({ fill, glint }) => (
    <G transform="rotate(-16 50 52)">
      <Rect x={34} y={10} width={32} height={74} rx={16} fill={fill()} />
      {Array.from({ length: 8 }, (_, row) =>
        [40, 46.5, 53, 59.5].map((x) => <Circle key={`${row}-${x}`} cx={x + (row % 2 ? 3.2 : 0)} cy={18 + row * 7.4} r={2.6} fill="#FFFFFF" opacity={0.32} />),
      )}
      <Glint paint={glint} cx={42} cy={30} rx={4} ry={13} />
      <Path d="M50 92 C 30 84, 22 64, 30 40 C 36 60, 42 72, 52 80 Z" fill={fill('sage')} />
      <Path d="M50 92 C 70 84, 78 62, 72 38 C 66 60, 60 72, 48 80 Z" fill={fill('sage')} />
    </G>
  ),
  // Calm: a lotus whose petals fan out from the base.
  lotus: ({ fill, glint }) => (
    <G>
      <Path d={PETAL} fill={fill('rose')} transform="rotate(-72 50 82)" />
      <Path d={PETAL} fill={fill('rose')} transform="rotate(72 50 82)" />
      <Path d={PETAL} fill={fill()} transform="rotate(-38 50 82)" />
      <Path d={PETAL} fill={fill()} transform="rotate(38 50 82)" />
      <Path d={PETAL} fill={fill()} />
      <Glint paint={glint} cx={46} cy={40} rx={3.5} ry={11} rotate={8} />
      <Ellipse cx={50} cy={84} rx={20} ry={4} fill={fill('sage')} />
    </G>
  ),
  // A daily supplement: a two-tone capsule resting at an angle.
  capsule: ({ fill, glint }) => (
    <G transform="rotate(-32 50 54)">
      <Rect x={46} y={40} width={38} height={28} rx={14} fill={fill('lavender')} />
      <Rect x={16} y={40} width={38} height={28} rx={14} fill={fill()} />
      <Glint paint={glint} cx={36} cy={46} rx={16} ry={3} />
      <Glint paint={glint} cx={68} cy={46} rx={9} ry={2.4} />
    </G>
  ),
  // Visits and dates: a desk calendar with one day marked.
  calendar: ({ fill, glint, shade }) => (
    <G>
      <Rect x={16} y={24} width={68} height={62} rx={14} fill={fill()} />
      <Path d="M30 24 H70 A14 14 0 0 1 84 38 V42 H16 V38 A14 14 0 0 1 30 24 Z" fill={fill('rose')} />
      <Rect x={32} y={16} width={7} height={16} rx={3.5} fill={shade} />
      <Rect x={61} y={16} width={7} height={16} rx={3.5} fill={shade} />
      {[0, 1].map((r) => [0, 1, 2, 3].map((c) => (r === 1 && c === 2 ? null : <Circle key={`${r}${c}`} cx={29 + c * 14} cy={55 + r * 15} r={3} fill="#FFFFFF" opacity={0.6} />)))}
      <Circle cx={57} cy={70} r={7.5} fill={shade} />
      <Path d="M53.5 70 L56.2 72.8 L61 67.4" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Glint paint={glint} cx={30} cy={48} rx={10} ry={3} />
    </G>
  ),
  // A reset link on its way: an envelope sealed with a small heart.
  envelope: ({ fill, glint, shade }) => (
    <G transform="rotate(-8 50 56)">
      <Rect x={12} y={30} width={76} height={52} rx={11} fill={fill()} />
      <Path d="M15 36 L50 62 L85 36" stroke={shade} strokeOpacity={0.55} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M50 69 C 44 65, 42 61, 44.5 58.5 C 46.5 56.5, 49 57, 50 59 C 51 57, 53.5 56.5, 55.5 58.5 C 58 61, 56 65, 50 69 Z" fill={fill('rose')} />
      <Glint paint={glint} cx={28} cy={38} rx={12} ry={3} />
    </G>
  ),
  // Humraah's own mark: a soft, puffy heart.
  heart: ({ fill, glint }) => (
    <G>
      <Path d={HEART} fill={fill()} />
      <Glint paint={glint} cx={31} cy={36} rx={8} ry={5} rotate={-30} />
    </G>
  ),
  // Kicks: a pair of baby feet, one a step ahead of the other.
  feet: ({ fill, glint }) => (
    <G>
      {[
        { x: 34, y: 54, r: -12, toes: 1 },
        { x: 66, y: 46, r: 12, toes: -1 },
      ].map((f) => (
        <G key={f.x} transform={`translate(${f.x} ${f.y}) rotate(${f.r})`}>
          <Path d="M0 -16 C 10 -16, 12 -4, 9 8 C 7 18, 3 24, -2 24 C -8 24, -10 16, -9 6 C -8 -6, -9 -16, 0 -16 Z" fill={fill()} />
          {[
            [-6.5, -22, 4.4],
            [0, -25, 3.6],
            [5.6, -24, 3.1],
            [10, -20.5, 2.7],
            [12.6, -15.5, 2.3],
          ].map(([x, y, r]) => (
            <Circle key={x} cx={x * f.toes} cy={y} r={r} fill={fill()} />
          ))}
          <Glint paint={glint} cx={-3 * f.toes} cy={-6} rx={2.6} ry={8} />
        </G>
      ))}
    </G>
  ),
  // Care that comes to you: a stethoscope with a pearl chest piece.
  stethoscope: ({ fill, glint, tube }) => (
    <G>
      <Path d="M28 14 C 24 44, 34 60, 50 60 C 66 60, 76 44, 72 14" stroke={tube} strokeWidth={5.5} strokeLinecap="round" fill="none" />
      <Path d="M50 60 C 50 70, 54 74, 60 75" stroke={tube} strokeWidth={5.5} strokeLinecap="round" fill="none" />
      <Circle cx={28} cy={13} r={4.5} fill={fill('rose')} />
      <Circle cx={72} cy={13} r={4.5} fill={fill('rose')} />
      <Circle cx={68} cy={76} r={14} fill={fill('rose')} />
      <Circle cx={68} cy={76} r={8} fill={fill()} />
      <Glint paint={glint} cx={63} cy={70} rx={4} ry={2.6} rotate={-30} />
    </G>
  ),
  // The baby's own toy for the nickname: a rattle with a bead band.
  rattle: ({ fill, glint, shade }) => (
    <G transform="rotate(-24 50 54)">
      <Rect x={46} y={50} width={8} height={30} rx={4} fill={fill('sage')} />
      <Circle cx={50} cy={86} r={6} stroke={shade} strokeWidth={3.5} fill="none" />
      <Circle cx={50} cy={34} r={23} fill={fill()} />
      <Ellipse cx={50} cy={36} rx={23} ry={5.5} fill="none" stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={2.4} />
      {[36, 44, 52, 60, 66].map((x) => (
        <Circle key={x} cx={x} cy={36 + Math.abs(x - 50) * 0.08} r={1.8} fill="#FFFFFF" opacity={0.85} />
      ))}
      <Glint paint={glint} cx={40} cy={22} rx={7} ry={4} rotate={-30} />
    </G>
  ),
};
