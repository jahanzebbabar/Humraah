import { useRouter } from 'expo-router';
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  Baby,
  BedDouble,
  Brain,
  Building2,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Lock,
  Mail,
  Milk,
  Minus,
  Plus,
  ShieldCheck,
  Sprout,
  Stethoscope,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { layoutDirection } from '@/components/Screen';
import { cityKey, cityOptions, specialtyKey, specialtyOptions, type City, type Specialty } from '@/data/mock';
import { ButtonV3, Cells, CheckV3, ChoiceV3, ErrorV3, FieldV3, Figure, Glass, H1V3, IconButtonV3, IconGlass, Kicker, LangV3, ScreenV3, Stat, T, TagV3 } from '@/design/v3/kit';
import { GUTTER_V3, v3 } from '@/design/v3/tokens';
import { useI18n, type StringKey } from '@/i18n';
import { registerMother, registerSpecialist, specialistToDoctor, type MotherDetails, type Role, type Stage, type YesNo } from '@/lib/accounts';
import { firebaseReady } from '@/lib/firebase';
import { same, useAppStore } from '@/store/AppStore';
import { enter, exit } from '@/theme/motion';

type Step = 'role' | 'stage' | 'details' | 'needs' | 'practice' | 'account';
const flows: Record<Role, Step[]> = {
  mother: ['role', 'stage', 'details', 'needs', 'account'],
  specialist: ['role', 'practice', 'account'],
};

type Option<K extends string> = { key: K; title: StringKey; hint?: StringKey; icon: LucideIcon };

const roles: Option<Role>[] = [
  { key: 'mother', title: 'signup.roleMother', hint: 'signup.roleMotherHint', icon: HeartHandshake },
  { key: 'specialist', title: 'signup.roleSpecialist', hint: 'signup.roleSpecialistHint', icon: Stethoscope },
];

const stages: Option<Stage>[] = [
  { key: 'Expecting', title: 'signup.expecting', hint: 'signup.expectingHint', icon: Baby },
  { key: 'New mom', title: 'signup.newMom', hint: 'signup.newMomHint', icon: HeartHandshake },
];

// What each stage most often needs help with; the first few start selected.
const needsByStage: Record<Stage, Option<string>[]> = {
  Expecting: [
    { key: 'checkups', title: 'need.checkups', icon: ClipboardCheck },
    { key: 'growth', title: 'need.growth', icon: Sprout },
    { key: 'nutrition', title: 'need.nutrition', icon: Apple },
    { key: 'birth', title: 'need.birth', icon: Baby },
    { key: 'mind', title: 'need.mind', icon: Brain },
    { key: 'sleep', title: 'need.sleep', icon: BedDouble },
    { key: 'doctor', title: 'need.doctor', icon: Stethoscope },
  ],
  'New mom': [
    { key: 'recovery', title: 'need.recovery', icon: HeartPulse },
    { key: 'feeding', title: 'need.feeding', icon: Milk },
    { key: 'babycare', title: 'need.babycare', icon: Baby },
    { key: 'sleep', title: 'need.sleep', icon: BedDouble },
    { key: 'mind', title: 'need.mind', icon: Brain },
    { key: 'nutrition', title: 'need.nutrition', icon: Apple },
    { key: 'doctor', title: 'need.doctor', icon: Stethoscope },
  ],
};

const conditions = ['diabetes', 'bp', 'anaemia', 'thyroid', 'previousCs'] as const;
const yesNo: readonly YesNo[] = ['yes', 'no'];
const trimesterOf = (week: number) => (week < 14 ? 1 : week < 28 ? 2 : 3);
const phaseOf = (weeks: number): StringKey => (weeks <= 2 ? 'signup.phase1' : weeks <= 6 ? 'signup.phase2' : weeks <= 12 ? 'signup.phase3' : 'signup.phase4');

export default function SignUpV3() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const { signIn, addLocalSpecialist, setMyListing } = useAppStore();

  const [role, setRole] = useState<Role>();
  const [index, setIndex] = useState(0);
  const flow = flows[role ?? 'mother'];
  const step = flow[index];

  // Mother
  const [stage, setStage] = useState<Stage>();
  const [week, setWeek] = useState(20);
  const [firstPregnancy, setFirstPregnancy] = useState<YesNo>();
  const [carrying, setCarrying] = useState<'one' | 'twins'>('one');
  const [watching, setWatching] = useState<string[]>([]);
  const [sinceWeeks, setSinceWeeks] = useState(2);
  const [delivery, setDelivery] = useState<'normal' | 'csection'>();
  const [feeding, setFeeding] = useState<'breast' | 'formula' | 'both'>();
  const [firstBaby, setFirstBaby] = useState<YesNo>();
  const [needs, setNeeds] = useState<string[]>([]);

  // Specialist
  const [specialty, setSpecialty] = useState<Specialty>('Gynecologist');
  const [city, setCity] = useState<City>('Lahore');
  const [hospital, setHospital] = useState('');
  const [years, setYears] = useState('');
  const [fee, setFee] = useState('');
  const [pmdc, setPmdc] = useState('');
  const [credentials, setCredentials] = useState('');
  const [bio, setBio] = useState('');

  // Account
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [today] = useState(() => Date.now());
  const dueDate = new Date(today + (40 - week) * 7 * 86400000);
  const due = dueDate.toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const pickStage = (s: Stage) => {
    if (s !== stage) setNeeds(needsByStage[s].slice(0, 3).map((n) => n.key));
    setStage(s);
  };
  const toggle = (list: string[], set: (v: string[]) => void, key: string) => set(list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);

  const back = () => {
    setError(null);
    if (index > 0) setIndex(index - 1);
    else if (router.canGoBack()) router.back();
    else router.replace('/welcome');
  };

  const canContinue =
    (step === 'role' && !!role) ||
    (step === 'stage' && !!stage) ||
    step === 'details' ||
    (step === 'needs' && needs.length > 0) ||
    step === 'practice';

  const next = () => {
    if (step === 'practice' && (!hospital.trim() || !pmdc.trim() || !credentials.trim())) {
      setError(t('signup.proError'));
      return;
    }
    setError(null);
    setIndex(index + 1);
  };

  const motherDetails = (): MotherDetails =>
    stage === 'New mom'
      ? { stage, postpartumWeeks: sinceWeeks, delivery, feeding, firstBaby, needs }
      : {
          stage: 'Expecting',
          week,
          dueDate: dueDate.toISOString().slice(0, 10),
          firstPregnancy,
          carrying,
          conditions: watching,
          needs,
        };

  const finish = async () => {
    const full = name.trim();
    const mail = email.trim();
    if (!full || !mail) return setError(t('signup.error'));
    if (firebaseReady && password.length < 6) return setError(t('signup.passwordShort'));
    const pro = {
      fullName: full,
      specialty,
      city,
      hospital: hospital.trim(),
      years: Number(years) || 0,
      fee: fee.trim() || '—',
      pmdc: pmdc.trim(),
      credentials: credentials.trim(),
      bio: bio.trim(),
    };
    const base = { firstName: same(full.split(' ')[0]), fullName: same(full), email: mail };

    setBusy(true);
    try {
      if (role === 'specialist') {
        const uid = firebaseReady ? (await registerSpecialist(mail, password, pro)).uid : `local-${mail.toLowerCase()}`;
        // Firestore streams the new listing in on its own; demo mode adds it to the in-memory directory.
        if (!firebaseReady) addLocalSpecialist(specialistToDoctor(uid, pro));
        setMyListing(pro);
        signIn({ ...base, uid, role: 'specialist' });
        router.replace('/doctor');
      } else {
        const details = motherDetails();
        const uid = firebaseReady ? (await registerMother(mail, password, full, details)).uid : undefined;
        // A new mom's home counts up from birth, so her timeline sits past the 40-week pregnancy.
        signIn({ ...base, ...details, uid, role: 'mother', week: details.week ?? 40 });
        router.replace('/');
      }
    } catch (e) {
      setError(t('signup.failed', { reason: (e as Error).message.replace(/^Firebase:\s*/, '') }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenV3 edges={['top', 'bottom']} orbs="c">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.top}>
          <IconButtonV3 icon={ArrowLeft} flipIcon label={t('common.back')} onPress={back} />
          <View style={{ flex: 1, gap: 8 }}>
            <Kicker>{t('v3.signup.step', { n: index + 1, total: flow.length })}</Kicker>
            <View style={[styles.progress, layoutDirection('ltr')]}>
              <View style={[styles.progressFill, { width: `${((index + 1) / flow.length) * 100}%` }]} />
            </View>
          </View>
          <LangV3 />
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View key={step} entering={enter.slide()} exiting={exit.slide} style={{ gap: 14 }}>
            {step === 'role' && (
              <>
                <Heading pre="signup.roleQpre" accent="signup.roleQaccent" post="signup.roleQpost" sub="signup.roleSub" />
                {roles.map((r, i) => (
                  <OptionCard key={r.key} option={r} index={1 + i} selected={role === r.key} onPress={() => setRole(r.key)} />
                ))}
              </>
            )}

            {step === 'stage' && (
              <>
                <Heading pre="signup.q1pre" accent="signup.q1accent" post="signup.q1post" sub="signup.q1sub" />
                {stages.map((s, i) => (
                  <OptionCard key={s.key} option={s} index={1 + i} selected={stage === s.key} onPress={() => pickStage(s.key)} />
                ))}
              </>
            )}

            {step === 'details' && stage === 'Expecting' && (
              <>
                <Heading pre="signup.detailsQpre" accent="signup.detailsQaccent" post="signup.detailsQpost" sub="signup.detailsSub" />
                <Glass style={{ gap: 16 }}>
                  <T size={15} weight="medium">
                    {t('signup.weeksPregnant')}
                  </T>
                  <Stepper value={week} min={4} max={42} onChange={setWeek} label={t('signup.weekValue', { n: week })} />
                  <Cells style={{ marginHorizontal: -14 }}>
                    <Stat label={t('v3.home.trimester')} value={trimesterOf(week)} size={30} />
                    <Stat label={t('v2.home.weeksToGo')} value={Math.max(0, 40 - week)} size={30} />
                  </Cells>
                  <T size={13} color={v3.muted}>
                    {t('signup.dueEstimate', { date: due })}
                  </T>
                </Glass>
                <Question label={t('signup.firstPregnancy')}>
                  <ChoiceV3 options={yesNo} value={firstPregnancy} onChange={setFirstPregnancy} format={(v) => t(`signup.${v}`)} />
                </Question>
                <Question label={t('signup.carrying')}>
                  <ChoiceV3 options={['one', 'twins'] as const} value={carrying} onChange={setCarrying} format={(v) => t(`signup.${v}`)} />
                </Question>
                <Question label={t('signup.conditions')}>
                  <View style={styles.wrap}>
                    {conditions.map((c) => (
                      <TagV3 key={c} label={t(`cond.${c}`)} active={watching.includes(c)} onPress={() => toggle(watching, setWatching, c)} />
                    ))}
                  </View>
                </Question>
              </>
            )}

            {step === 'details' && stage === 'New mom' && (
              <>
                <Heading pre="signup.detailsQpre" accent="signup.detailsQaccent" post="signup.detailsQpost" sub="signup.detailsSub" />
                <Glass style={{ gap: 16 }}>
                  <T size={15} weight="medium">
                    {t('signup.weeksSince')}
                  </T>
                  <Stepper
                    value={sinceWeeks}
                    min={0}
                    max={52}
                    onChange={setSinceWeeks}
                    label={sinceWeeks === 0 ? t('signup.lessThanWeek') : t('signup.weeksSinceValue', { n: sinceWeeks })}
                  />
                  <T size={13} color={v3.muted}>
                    {`${t(phaseOf(sinceWeeks))}${sinceWeeks >= 8 ? ` · ${t('signup.babyAge', { n: Math.floor(sinceWeeks / 4.345) })}` : ''}`}
                  </T>
                </Glass>
                <Question label={t('signup.delivery')}>
                  <ChoiceV3 options={['normal', 'csection'] as const} value={delivery} onChange={setDelivery} format={(v) => t(`signup.${v}`)} />
                </Question>
                <Question label={t('signup.feeding')}>
                  <ChoiceV3 options={['breast', 'formula', 'both'] as const} value={feeding} onChange={setFeeding} format={(v) => t(`signup.${v}`)} />
                </Question>
                <Question label={t('signup.firstBaby')}>
                  <ChoiceV3 options={yesNo} value={firstBaby} onChange={setFirstBaby} format={(v) => t(`signup.${v}`)} />
                </Question>
              </>
            )}

            {step === 'needs' && stage && (
              <>
                <Heading pre="signup.needsQpre" accent="signup.needsQaccent" post="signup.needsQpost" sub="signup.needsSub" />
                {needsByStage[stage].map((n, i) => (
                  <OptionCard key={n.key} option={n} index={1 + i} compact selected={needs.includes(n.key)} onPress={() => toggle(needs, setNeeds, n.key)} />
                ))}
              </>
            )}

            {step === 'practice' && (
              <>
                <Heading pre="signup.proQpre" accent="signup.proQaccent" post="signup.proQpost" sub="signup.proSub" />
                <Question label={t('signup.specialty')}>
                  <ChoiceV3 options={specialtyOptions.filter((s) => s !== 'all') as Specialty[]} value={specialty} onChange={setSpecialty} format={(s) => t(specialtyKey(s))} />
                </Question>
                <Question label={t('signup.city')}>
                  <ChoiceV3 options={cityOptions.filter((c) => c !== 'all') as City[]} value={city} onChange={setCity} format={(c) => t(cityKey(c))} />
                </Question>
                <Glass style={{ gap: 12 }}>
                  <FieldV3 icon={Building2} placeholder={t('signup.hospital')} value={hospital} onChangeText={(v) => (setHospital(v), setError(null))} />
                  <FieldV3 icon={ShieldCheck} placeholder={t('signup.pmdc')} value={pmdc} onChangeText={(v) => (setPmdc(v), setError(null))} autoCapitalize="characters" />
                  <FieldV3 icon={GraduationCap} placeholder={t('signup.credentials')} value={credentials} onChangeText={(v) => (setCredentials(v), setError(null))} />
                  <FieldV3 icon={Sprout} placeholder={t('signup.years')} value={years} onChangeText={(v) => setYears(v.replace(/\D/g, ''))} keyboardType="number-pad" />
                  <FieldV3 icon={Wallet} placeholder={t('signup.fee')} value={fee} onChangeText={setFee} keyboardType="number-pad" />
                  <FieldV3 placeholder={t('signup.bio')} value={bio} onChangeText={setBio} multiline />
                  <ErrorV3>{error}</ErrorV3>
                </Glass>
              </>
            )}

            {step === 'account' && (
              <>
                <Heading pre="signup.q2pre" accent="signup.q2accent" post="signup.q2post" sub="signup.q2sub" />
                <Glass style={{ gap: 12 }}>
                  <FieldV3 icon={User} placeholder={t('signup.name')} value={name} onChangeText={(v) => (setName(v), setError(null))} autoFocus />
                  <FieldV3
                    icon={Mail}
                    placeholder={t('login.email')}
                    value={email}
                    onChangeText={(v) => (setEmail(v), setError(null))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <FieldV3 icon={Lock} placeholder={t('signup.password')} value={password} onChangeText={(v) => (setPassword(v), setError(null))} secureTextEntry />
                  <ErrorV3>{error}</ErrorV3>
                </Glass>
                <T size={13} color={v3.muted} style={{ paddingHorizontal: 6 }}>
                  {t('signup.privacy')}
                </T>
              </>
            )}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          {step === 'account' ? (
            <ButtonV3 label={t('signup.create')} icon={ArrowRight} disabled={busy} onPress={finish} />
          ) : (
            <ButtonV3 label={t('common.continue')} icon={ArrowRight} disabled={!canContinue} onPress={next} />
          )}
          <PressableScale onPress={() => router.replace('/login')} style={{ alignSelf: 'center', padding: 6 }}>
            <T size={14} color={v3.muted} align="center">
              {t('signup.already')}
              <T size={14} weight="medium">
                {t('common.signIn')}
              </T>
            </T>
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </ScreenV3>
  );
}

function Heading({ pre, accent, post, sub }: { pre: StringKey; accent: StringKey; post: StringKey; sub: StringKey }) {
  const { t } = useI18n();
  return (
    <>
      <H1V3 size={42}>
        {t(pre)}
        {t(accent)}
        {t(post)}
      </H1V3>
      <T size={15} color={v3.muted} style={{ marginBottom: 10 }}>
        {t(sub)}
      </T>
    </>
  );
}

function OptionCard<K extends string>({ option, selected, onPress, index, compact }: { option: Option<K>; selected: boolean; onPress: () => void; index: number; compact?: boolean }) {
  const { t } = useI18n();
  return (
    <Glass index={index} onPress={onPress} style={[styles.option, compact && { paddingVertical: 12 }]} wrapStyle={selected && styles.selected}>
      <IconGlass icon={option.icon} size={compact ? 40 : 48} dark={selected} />
      <View style={{ flex: 1, gap: 2 }}>
        <T size={compact ? 16 : 18} weight="regular">
          {t(option.title)}
        </T>
        {option.hint && (
          <T size={13} color={v3.muted}>
            {t(option.hint)}
          </T>
        )}
      </View>
      <CheckV3 checked={selected} />
    </Glass>
  );
}

function Question({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Glass style={{ gap: 12 }}>
      <T size={15} weight="medium">
        {label}
      </T>
      {children}
    </Glass>
  );
}

function Stepper({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange: (v: number) => void; label: string }) {
  return (
    <View style={[styles.stepper, layoutDirection('ltr')]}>
      <IconButtonV3 icon={Minus} label="-1" onPress={() => onChange(Math.max(min, value - 1))} size={52} />
      <View style={{ alignItems: 'center', flex: 1 }}>
        <Figure value={value} size={64} />
        <T size={13} color={v3.muted}>
          {label}
        </T>
      </View>
      <IconButtonV3 icon={Plus} label="+1" onPress={() => onChange(Math.min(max, value + 1))} size={52} />
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: GUTTER_V3, paddingTop: 8 },
  progress: { height: 2, borderRadius: 1, backgroundColor: 'rgba(0,0,0,0.12)', overflow: 'hidden' },
  progressFill: { height: 2, backgroundColor: v3.black },
  body: { paddingHorizontal: GUTTER_V3, paddingTop: 30, paddingBottom: 24 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 18 },
  selected: { transform: [{ scale: 1.01 }] },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  footer: { paddingHorizontal: GUTTER_V3, paddingBottom: 12, gap: 10 },
});
