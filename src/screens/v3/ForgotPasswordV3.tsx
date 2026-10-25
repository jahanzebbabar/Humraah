import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { AuthFrameV3, ButtonV3, ErrorV3, FieldV3, Glass, H1V3, Kicker, T } from '@/design/v3/kit';
import { Object3D } from '@/design/v3/Object3D';
import { v3 } from '@/design/v3/tokens';
import { useI18n } from '@/i18n';
import { enter } from '@/theme/motion';

export default function ForgotPasswordV3() {
  const router = useRouter();
  const { t } = useI18n();
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(true);
      return;
    }
    setSent(true);
  };

  return (
    <AuthFrameV3
      orbs="c"
      footer={sent ? <ButtonV3 label={t('forgot.back')} onPress={() => router.replace('/login')} /> : <ButtonV3 label={t('forgot.send')} onPress={send} />}
    >
      {sent ? (
        <Animated.View key="sent" entering={enter.rise()} style={{ gap: 14 }}>
          <Glass wrapStyle={{ marginTop: 60 }} style={{ paddingTop: 80, gap: 10 }} breakout={<Object3D kind="envelope" size={120} style={styles.shape} />}>
            <Kicker>{email.trim()}</Kicker>
            <H1V3 size={38}>{t('forgot.sentTitle')}</H1V3>
            <T size={15} color={v3.muted}>
              {t('forgot.sentBody', { email: email.trim() })}
            </T>
          </Glass>
        </Animated.View>
      ) : (
        <Animated.View key="form" entering={enter.rise()} style={{ gap: 14 }}>
          <H1V3 size={42}>{t('forgot.title')}</H1V3>
          <T size={15} color={v3.muted} style={{ marginBottom: 10 }}>
            {t('forgot.body')}
          </T>
          <Glass style={{ gap: 12 }}>
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
              autoFocus
              returnKeyType="send"
              onSubmitEditing={send}
            />
            <ErrorV3>{error && t('forgot.error')}</ErrorV3>
          </Glass>
        </Animated.View>
      )}
    </AuthFrameV3>
  );
}

const styles = StyleSheet.create({
  shape: { position: 'absolute', top: -60, end: 24 },
});
