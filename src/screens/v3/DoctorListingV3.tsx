import { useRouter } from 'expo-router';
import { Building2, GraduationCap, LogOut, Save, ShieldCheck, Sprout, User, Wallet } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { cityKey, cityOptions, specialtyKey, specialtyOptions, type City, type Specialty } from '@/data/mock';
import { ButtonV3, ChoiceV3, ErrorV3, FieldV3, Glass, H1V3, Kicker, ScreenV3, SegmentedV3, T, ToastV3 } from '@/design/v3/kit';
import { GUTTER_V3, v3 } from '@/design/v3/tokens';
import { useI18n, type Lang } from '@/i18n';
import type { SpecialistDetails } from '@/lib/accounts';
import { useAppStore } from '@/store/AppStore';
import { NAV_CLEARANCE } from '@/theme';
import { enter } from '@/theme/motion';

const blank = (fullName: string): SpecialistDetails => ({
  fullName,
  specialty: 'Gynecologist',
  city: 'Lahore',
  hospital: '',
  years: 0,
  fee: '',
  pmdc: '',
  credentials: '',
  bio: '',
});

/** Specialist settings: edit the public listing, plus language and sign-out. */
export default function DoctorListingV3() {
  const router = useRouter();
  const { t, L, lang, setLang } = useI18n();
  const { user, myListing, saveListing, signOut } = useAppStore();
  const [form, setForm] = useState<SpecialistDetails>(() => myListing ?? blank(L(user.fullName)));
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof SpecialistDetails>(key: K, value: SpecialistDetails[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  };

  const save = async () => {
    if (!form.fullName.trim() || !form.hospital.trim() || !form.pmdc.trim() || !form.credentials.trim()) {
      setError(t('signup.proError'));
      return;
    }
    setBusy(true);
    try {
      await saveListing({ ...form, fullName: form.fullName.trim(), hospital: form.hospital.trim(), pmdc: form.pmdc.trim(), credentials: form.credentials.trim(), bio: form.bio.trim(), fee: form.fee.trim() });
      setToast(t('doc.saved'));
    } catch (e) {
      setError(t('doc.saveFailed', { reason: (e as Error).message.replace(/^Firebase:\s*/, '') }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenV3 orbs="b">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingBottom: NAV_CLEARANCE + 10 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View entering={enter.rise(0)} style={styles.head}>
            <H1V3 size={48}>{t('doc.listing.h1')}</H1V3>
            <T size={15} color={v3.muted}>
              {t('doc.listing.sub')}
            </T>
          </Animated.View>

          <View style={styles.body}>
            <Glass index={1} style={{ gap: 12 }}>
              <FieldV3 icon={User} placeholder={t('doc.name')} value={form.fullName} onChangeText={(v) => set('fullName', v)} />
              <FieldV3 icon={Building2} placeholder={t('signup.hospital')} value={form.hospital} onChangeText={(v) => set('hospital', v)} />
              <FieldV3 icon={ShieldCheck} placeholder={t('signup.pmdc')} value={form.pmdc} onChangeText={(v) => set('pmdc', v)} autoCapitalize="characters" />
              <FieldV3 icon={GraduationCap} placeholder={t('signup.credentials')} value={form.credentials} onChangeText={(v) => set('credentials', v)} />
              <FieldV3
                icon={Sprout}
                placeholder={t('signup.years')}
                value={form.years ? String(form.years) : ''}
                onChangeText={(v) => set('years', Number(v.replace(/\D/g, '')) || 0)}
                keyboardType="number-pad"
              />
              <FieldV3 icon={Wallet} placeholder={t('signup.fee')} value={form.fee} onChangeText={(v) => set('fee', v)} keyboardType="number-pad" />
              <FieldV3 placeholder={t('signup.bio')} value={form.bio} onChangeText={(v) => set('bio', v)} multiline />
            </Glass>

            <Section label={t('signup.specialty')} index={2}>
              <ChoiceV3 options={specialtyOptions.filter((s) => s !== 'all') as Specialty[]} value={form.specialty} onChange={(v) => set('specialty', v)} format={(s) => t(specialtyKey(s))} />
            </Section>
            <Section label={t('signup.city')} index={3}>
              <ChoiceV3 options={cityOptions.filter((c) => c !== 'all') as City[]} value={form.city} onChange={(v) => set('city', v)} format={(c) => t(cityKey(c))} />
            </Section>

            <ErrorV3>{error}</ErrorV3>
            <ButtonV3 label={t('doc.save')} icon={Save} disabled={busy} onPress={save} />

            <Section label={t('settings.language')} index={4}>
              <SegmentedV3<Lang>
                options={[
                  { key: 'en', label: 'English' },
                  { key: 'ur', label: 'اردو' },
                ]}
                value={lang}
                onChange={setLang}
              />
            </Section>

            <ButtonV3
              label={t('settings.signOut')}
              icon={LogOut}
              variant="glass"
              onPress={() => {
                signOut();
                router.replace('/welcome');
              }}
              style={{ marginTop: 14 }}
            />
            <T size={12} color={v3.muted} align="center">
              {user.email}
            </T>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ToastV3 message={toast} onHide={() => setToast(null)} />
    </ScreenV3>
  );
}

function Section({ label, index, children }: { label: string; index: number; children: ReactNode }) {
  return (
    <Glass index={index} style={{ gap: 12 }}>
      <Kicker>{label}</Kicker>
      {children}
    </Glass>
  );
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: GUTTER_V3, paddingTop: 22, gap: 8 },
  body: { paddingHorizontal: GUTTER_V3, marginTop: 28, gap: 16 },
});
