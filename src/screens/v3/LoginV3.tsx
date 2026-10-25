import { useRouter } from 'expo-router';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { useFlip } from '@/components/Screen';
import { AuthFrameV3, ButtonV3, ErrorV3, FieldV3, Glass, H1V3, IconGlass, T } from '@/design/v3/kit';
import { Object3D } from '@/design/v3/Object3D';
import { v3 } from '@/design/v3/tokens';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/AppStore';
import { enter } from '@/theme/motion';

export default function LoginV3() {
  const router = useRouter();
  const { t } = useI18n();
  const flip = useFlip();
  const { signIn } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const submit = () => {
    if (!email.trim() || !password) {
      setError(true);
      return;
    }
    signIn({ email: email.trim() });
    router.replace('/');
  };

  return (
    <AuthFrameV3
      orbs="b"
      footer={
        <PressableScale onPress={() => router.replace('/sign-up')} style={{ alignSelf: 'center', padding: 6 }}>
          <T size={14} color={v3.muted} align="center">
            {t('login.newHere')}
            <T size={14} weight="medium">
              {t('login.create')}
            </T>
          </T>
        </PressableScale>
      }
    >
      <Animated.View entering={enter.rise(0)} style={{ gap: 8 }}>
        <H1V3 size={46}>
          {t('login.title1')}
          {'\n'}
          {t('login.title2')}
        </H1V3>
        <T size={15} color={v3.muted}>
          {t('login.sub')}
        </T>
      </Animated.View>

      <Glass index={1} wrapStyle={{ marginTop: 40 }} style={{ gap: 14, paddingTop: 34 }} breakout={<Object3D kind="heart" size={84} style={styles.shape} />}>
        <FieldV3
          icon={Mail}
          placeholder={t('login.email')}
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setError(false);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <View>
          <FieldV3
            icon={Lock}
            placeholder={t('login.password')}
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              setError(false);
            }}
            secureTextEntry={!show}
            autoComplete="password"
            returnKeyType="go"
            onSubmitEditing={submit}
            style={{ paddingEnd: 54 }}
          />
          <PressableScale onPress={() => setShow((s) => !s)} style={styles.eye} hitSlop={10} accessibilityLabel={t('login.password')}>
            {show ? <EyeOff size={18} color={v3.black} strokeWidth={1.5} /> : <Eye size={18} color={v3.black} strokeWidth={1.5} />}
          </PressableScale>
        </View>
        <ErrorV3>{error && t('login.error')}</ErrorV3>
        <PressableScale onPress={() => router.push({ pathname: '/forgot-password', params: { email } })} style={{ alignSelf: 'flex-end' }}>
          <T size={13} weight="medium">
            {t('login.forgot')}
          </T>
        </PressableScale>
        <ButtonV3 label={t('common.signIn')} icon={ArrowRight} onPress={submit} />
      </Glass>

      <Glass index={2} radius={999} onPress={() => router.push('/phone-login')} style={styles.phone}>
        <IconGlass icon={Phone} size={40} />
        <T size={15} weight="medium" style={{ flex: 1 }}>
          {t('login.phone')}
        </T>
        <ArrowRight size={18} color={v3.black} strokeWidth={1.5} style={flip} />
      </Glass>
    </AuthFrameV3>
  );
}

const styles = StyleSheet.create({
  shape: { position: 'absolute', top: -46, end: 22 },
  eye: { position: 'absolute', end: 20, top: 19 },
  phone: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10, paddingHorizontal: 12 },
});
