import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { Fragment, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputInstance } from 'react-native';
import Animated from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { layoutDirection } from '@/components/Screen';
import { AuthFrameV3, ButtonV3, ErrorV3, Glass, H1V3, Kicker, noWebOutline, T } from '@/design/v3/kit';
import { radiusV3, v3 } from '@/design/v3/tokens';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/AppStore';
import { fonts } from '@/theme';
import { enter } from '@/theme/motion';

/** Phone sign-in, Design 3: the number set in large light type, the code as four cells split by hairlines. */
export default function PhoneLoginV3() {
  const router = useRouter();
  const { t } = useI18n();
  const { signIn } = useAppStore();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const codeInput = useRef<TextInputInstance>(null);

  const digits = phone.replace(/\D/g, '');
  const sendCode = () => {
    if (digits.length !== 10) {
      setError(true);
      return;
    }
    setStep('code');
    setTimeout(() => codeInput.current?.focus(), 250);
  };
  const verify = () => {
    if (code.length === 4) {
      signIn();
      router.replace('/');
    }
  };

  return (
    <AuthFrameV3
      orbs="a"
      footer={
        step === 'phone' ? (
          <ButtonV3 label={t('phone.send')} icon={ArrowRight} onPress={sendCode} />
        ) : (
          <ButtonV3 label={t('phone.verify')} icon={ArrowRight} onPress={verify} disabled={code.length !== 4} />
        )
      }
    >
      {step === 'phone' ? (
        <Animated.View key="phone" entering={enter.slide()} style={{ gap: 14 }}>
          <H1V3 size={42}>{t('phone.title')}</H1V3>
          <T size={15} color={v3.muted} style={{ marginBottom: 10 }}>
            {t('phone.body')}
          </T>
          <Glass style={{ gap: 10 }}>
            <Kicker>+92</Kicker>
            {/* Phone numbers are always entered left to right. */}
            <TextInput
              value={phone}
              onChangeText={(v) => {
                setPhone(v.replace(/[^\d ]/g, '').slice(0, 12));
                setError(false);
              }}
              placeholder="3XX XXXXXXX"
              placeholderTextColor={v3.muted}
              keyboardType="phone-pad"
              autoFocus
              style={[styles.phoneInput, layoutDirection('ltr'), noWebOutline]}
            />
          </Glass>
          <ErrorV3>{error && t('phone.error')}</ErrorV3>
        </Animated.View>
      ) : (
        <Animated.View key="code" entering={enter.slide()} style={{ gap: 14 }}>
          <H1V3 size={42}>{t('phone.codeTitle')}</H1V3>
          <T size={15} color={v3.muted} style={{ marginBottom: 10 }}>
            {t('phone.codeBody', { phone: digits })}
          </T>
          <Glass style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
            <PressableScale scaleTo={0.99} haptic={false} onPress={() => codeInput.current?.focus()} style={[styles.codeRow, layoutDirection('ltr')]}>
              {[0, 1, 2, 3].map((i) => (
                <Fragment key={i}>
                  {i > 0 && <View style={styles.vRule} />}
                  <View style={styles.cell}>
                    <Text style={styles.digit}>{code[i] ?? ''}</Text>
                    <View style={[styles.caret, code.length === i && { backgroundColor: v3.black }]} />
                  </View>
                </Fragment>
              ))}
            </PressableScale>
          </Glass>
          <TextInput
            ref={codeInput}
            value={code}
            onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 4))}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.hidden}
            onSubmitEditing={verify}
          />
          <PressableScale
            onPress={() => {
              setCode('');
              setNotice(t('phone.resent'));
            }}
            style={styles.resend}
          >
            <T size={13} weight="medium">
              {t('phone.resend')}
            </T>
          </PressableScale>
          {notice && (
            <Animated.View entering={enter.drop()}>
              <T size={13} color={v3.muted}>
                {notice}
              </T>
            </Animated.View>
          )}
        </Animated.View>
      )}
    </AuthFrameV3>
  );
}

const styles = StyleSheet.create({
  phoneInput: { fontFamily: fonts.extraLight, fontSize: 36, letterSpacing: 1, color: v3.black, paddingVertical: 4 },
  codeRow: { flexDirection: 'row', alignItems: 'stretch' },
  vRule: { width: 1, backgroundColor: v3.hairline },
  cell: { flex: 1, height: 84, alignItems: 'center', justifyContent: 'center', gap: 6 },
  digit: { fontFamily: fonts.extraLight, fontSize: 40, color: v3.black, lineHeight: 46 },
  caret: { width: 22, height: 1.5, backgroundColor: 'rgba(0,0,0,0.15)' },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  resend: { alignSelf: 'flex-start', paddingHorizontal: 16, height: 36, justifyContent: 'center', borderRadius: radiusV3.pill, backgroundColor: v3.glassStrong, borderWidth: 1, borderColor: v3.edge },
});
