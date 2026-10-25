import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Baby, Flower2, HeartHandshake, Lock, Mail, User, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { layoutDirection } from '@/components/Screen';
import { ButtonV3, CheckV3, ErrorV3, FieldV3, Glass, H1V3, IconButtonV3, IconGlass, Kicker, LangV3, ScreenV3, T } from '@/design/v3/kit';
import { GUTTER_V3, v3 } from '@/design/v3/tokens';
import { useI18n, type StringKey } from '@/i18n';
import { same, useAppStore } from '@/store/AppStore';
import { enter, exit } from '@/theme/motion';

const stages: { key: string; title: StringKey; hint: StringKey; icon: LucideIcon }[] = [
  { key: 'Planning', title: 'signup.planning', hint: 'signup.planningHint', icon: Flower2 },
  { key: 'Expecting', title: 'signup.expecting', hint: 'signup.expectingHint', icon: Baby },
  { key: 'New mom', title: 'signup.newMom', hint: 'signup.newMomHint', icon: HeartHandshake },
];

export default function SignUpV3() {
  const router = useRouter();
  const { t } = useI18n();
  const { signIn } = useAppStore();
  const [step, setStep] = useState<0 | 1>(0);
  const [stage, setStage] = useState<string>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const finish = () => {
    const full = name.trim();
    if (!full || !email.trim()) {
      setError(true);
      return;
    }
    signIn({ stage, firstName: same(full.split(' ')[0]), fullName: same(full), email: email.trim() });
    router.replace('/');
  };

  return (
    <ScreenV3 edges={['top', 'bottom']} orbs="c">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.top}>
          <IconButtonV3
            icon={ArrowLeft}
            flipIcon
            label={t('common.back')}
            onPress={() => (step === 1 ? setStep(0) : router.canGoBack() ? router.back() : router.replace('/welcome'))}
          />
          <View style={{ flex: 1, gap: 8 }}>
            <Kicker>{t('v3.signup.step', { n: step + 1 })}</Kicker>
            <View style={[styles.progress, layoutDirection('ltr')]}>
              <View style={[styles.progressFill, { width: step === 0 ? '50%' : '100%' }]} />
            </View>
          </View>
          <LangV3 />
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {step === 0 ? (
            <Animated.View key="s0" entering={enter.slide()} exiting={exit.slide} style={{ gap: 14 }}>
              <H1V3 size={42}>
                {t('signup.q1pre')}
                {t('signup.q1accent')}
                {t('signup.q1post')}
              </H1V3>
              <T size={15} color={v3.muted} style={{ marginBottom: 10 }}>
                {t('signup.q1sub')}
              </T>
              {stages.map((s, i) => {
                const selected = stage === s.key;
                return (
                  <Glass key={s.key} index={1 + i} onPress={() => setStage(s.key)} style={styles.stage} wrapStyle={selected && styles.selected}>
                    <IconGlass icon={s.icon} size={48} dark={selected} />
                    <View style={{ flex: 1, gap: 2 }}>
                      <T size={18} weight="regular">
                        {t(s.title)}
                      </T>
                      <T size={13} color={v3.muted}>
                        {t(s.hint)}
                      </T>
                    </View>
                    <CheckV3 checked={selected} />
                  </Glass>
                );
              })}
            </Animated.View>
          ) : (
            <Animated.View key="s1" entering={enter.slide()} exiting={exit.slide} style={{ gap: 14 }}>
              <H1V3 size={42}>
                {t('signup.q2pre')}
                {t('signup.q2accent')}
                {t('signup.q2post')}
              </H1V3>
              <T size={15} color={v3.muted} style={{ marginBottom: 10 }}>
                {t('signup.q2sub')}
              </T>
              <Glass style={{ gap: 12 }}>
                <FieldV3 icon={User} placeholder={t('signup.name')} value={name} onChangeText={(v) => (setName(v), setError(false))} autoFocus />
                <FieldV3
                  icon={Mail}
                  placeholder={t('login.email')}
                  value={email}
                  onChangeText={(v) => (setEmail(v), setError(false))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <FieldV3 icon={Lock} placeholder={t('signup.password')} value={password} onChangeText={setPassword} secureTextEntry />
                <ErrorV3>{error && t('signup.error')}</ErrorV3>
              </Glass>
              <T size={13} color={v3.muted} style={{ paddingHorizontal: 6 }}>
                {t('signup.privacy')}
              </T>
            </Animated.View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step === 0 ? (
            <ButtonV3 label={t('common.continue')} icon={ArrowRight} disabled={!stage} onPress={() => setStep(1)} />
          ) : (
            <ButtonV3 label={t('signup.create')} icon={ArrowRight} onPress={finish} />
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

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: GUTTER_V3, paddingTop: 8 },
  progress: { height: 2, borderRadius: 1, backgroundColor: 'rgba(0,0,0,0.12)', overflow: 'hidden' },
  progressFill: { height: 2, backgroundColor: v3.black },
  body: { paddingHorizontal: GUTTER_V3, paddingTop: 30, paddingBottom: 24 },
  stage: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 18 },
  selected: { transform: [{ scale: 1.01 }] },
  footer: { paddingHorizontal: GUTTER_V3, paddingBottom: 12, gap: 10 },
});
