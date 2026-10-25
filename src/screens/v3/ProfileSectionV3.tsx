import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown, Lock, Mail, Phone, Plus, Shield, Siren, Stethoscope, Trash2, User } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { ButtonV3, Cells, ErrorV3, FieldV3, Glass, H1V3, HRule, IconButtonV3, IconGlass, Kicker, LineRow, PortraitV3, ScreenV3, Stat, SwitchV3, T, TagV3, TopBarV3 } from '@/design/v3/kit';
import { Object3D } from '@/design/v3/Object3D';
import { GUTTER_V3, radiusV3, v3 } from '@/design/v3/tokens';
import { useI18n, type StringKey } from '@/i18n';
import { same, useAppStore } from '@/store/AppStore';
import { enter, layout } from '@/theme/motion';

type Section = 'edit' | 'due-date' | 'nickname' | 'emergency' | 'privacy' | 'help';
const titles: Record<Section, StringKey> = {
  edit: 'settings.editProfile',
  'due-date': 'settings.dueDate',
  nickname: 'settings.nickname',
  emergency: 'settings.emergency',
  privacy: 'settings.privacy',
  help: 'settings.help',
};

/** The pages behind each Settings row, Design 3. */
export default function ProfileSectionV3() {
  const router = useRouter();
  const { t } = useI18n();
  const { section } = useLocalSearchParams<{ section: Section }>();
  const key: Section = section in titles ? section : 'help';

  return (
    <ScreenV3 edges={['top', 'bottom']} orbs={key === 'emergency' || key === 'nickname' ? 'a' : 'b'}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TopBarV3 onBack={() => router.back()} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View entering={enter.rise(0)}>
            <H1V3 size={44}>{t(titles[key])}</H1V3>
          </Animated.View>
          {key === 'edit' && <EditProfile />}
          {key === 'due-date' && <DueDate />}
          {key === 'nickname' && <Nickname />}
          {key === 'emergency' && <Emergency />}
          {key === 'privacy' && <Privacy />}
          {key === 'help' && <Help />}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenV3>
  );
}

function Saved({ show }: { show: boolean }) {
  const { t } = useI18n();
  if (!show) return null;
  return (
    <Animated.View entering={enter.drop()} style={{ alignSelf: 'center' }}>
      <TagV3 label={t('common.saved')} active />
    </Animated.View>
  );
}

function EditProfile() {
  const { t, L } = useI18n();
  const { user, updateUser } = useAppStore();
  const [name, setName] = useState(L(user.fullName));
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);
  const save = () => {
    const full = name.trim();
    if (!full) return;
    const unchanged = full === L(user.fullName);
    updateUser({ fullName: unchanged ? user.fullName : same(full), firstName: unchanged ? user.firstName : same(full.split(' ')[0]), email: email.trim() });
    setSaved(true);
  };
  return (
    <>
      <Glass index={1} wrapStyle={{ marginTop: 60 }} style={{ paddingTop: 72, gap: 12 }} breakout={<PortraitV3 initials={name.trim().slice(0, 1) || '?'} size={110} tone="rose" style={styles.portrait} />}>
        <Kicker>{t('profile.name')}</Kicker>
        <FieldV3 icon={User} value={name} onChangeText={(v) => (setName(v), setSaved(false))} />
        <Kicker>{t('profile.email')}</Kicker>
        <FieldV3 icon={Mail} value={email} onChangeText={(v) => (setEmail(v), setSaved(false))} keyboardType="email-address" autoCapitalize="none" />
      </Glass>
      <ButtonV3 label={t('common.save')} onPress={save} disabled={!name.trim()} />
      <Saved show={saved} />
    </>
  );
}

function DueDate() {
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAppStore();
  return (
    <>
      <Glass index={1} wrapStyle={{ marginTop: 50 }} style={{ paddingTop: 50, gap: 16 }} breakout={<Object3D kind="calendar" size={130} style={styles.shape} />}>
        <Kicker>{t('settings.dueDate')}</Kicker>
        <T size={34} weight="light" style={{ letterSpacing: -1, lineHeight: 40 }}>
          {t('profile.dueDate')}
        </T>
        <HRule />
        <Cells style={{ marginHorizontal: -14 }}>
          <Stat label={t('v2.home.weeksAlong')} value={user.week} />
          <Stat label={t('v2.home.weeksToGo')} value={40 - user.week} />
        </Cells>
      </Glass>
      <Glass index={2} style={{ gap: 14 }}>
        <T size={16} weight="light" style={{ lineHeight: 25 }}>
          {t('profile.dueBody', { date: t('profile.dueDate') })}
        </T>
        <HRule />
        <T size={14} color={v3.muted} style={{ lineHeight: 21 }}>
          {t('profile.dueTip')}
        </T>
      </Glass>
      <ButtonV3 label={t('profile.askDoctor')} icon={Stethoscope} variant="glass" onPress={() => router.navigate('/consultants')} />
    </>
  );
}

function Nickname() {
  const { t, L } = useI18n();
  const { user, updateUser } = useAppStore();
  const [value, setValue] = useState(L(user.nickname));
  const [saved, setSaved] = useState(false);
  return (
    <>
      <Glass index={1} wrapStyle={{ marginTop: 70 }} style={{ paddingTop: 90, alignItems: 'center', gap: 10 }} breakout={<Object3D kind="rattle" size={150} style={styles.shapeCenter} />}>
        <T size={52} weight="extraLight" align="center" style={{ lineHeight: 60, letterSpacing: -1.5 }}>
          {value.trim() || '...'}
        </T>
        <T size={14} color={v3.muted} align="center">
          {t('profile.nicknameBody')}
        </T>
      </Glass>
      <FieldV3 placeholder={t('profile.nicknamePh')} value={value} onChangeText={(v) => (setValue(v), setSaved(false))} />
      <ButtonV3
        label={t('common.save')}
        disabled={!value.trim()}
        onPress={() => {
          updateUser({ nickname: value.trim() === L(user.nickname) ? user.nickname : same(value.trim()) });
          setSaved(true);
        }}
      />
      <Saved show={saved} />
    </>
  );
}

function Emergency() {
  const { t, L } = useI18n();
  const { contacts, addContact, removeContact } = useAppStore();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(false);
  const call = (n: string) => Linking.openURL(`tel:${n}`).catch(() => {});

  return (
    <>
      <T size={15} color={v3.muted}>
        {t('profile.emergencyBody')}
      </T>
      <Glass index={1} style={{ paddingVertical: 4 }}>
        <LineRow first>
          <IconGlass icon={Siren} size={44} dark />
          <View style={{ flex: 1 }}>
            <T size={17}>{t('profile.rescue')}</T>
            <T size={13} color={v3.muted}>
              {t('profile.rescueNote')}
            </T>
          </View>
          <CallButton onPress={() => call('1122')} />
        </LineRow>
        {contacts.map((c) => (
          <Animated.View key={c.id} layout={layout}>
            <LineRow>
              <PortraitV3 initials={L(c.name).slice(0, 1)} size={44} tone="sage" />
              <View style={{ flex: 1 }}>
                <T size={17}>{L(c.name)}</T>
                <T size={13} color={v3.muted} style={{ writingDirection: 'ltr' }}>
                  {c.phone}
                </T>
              </View>
              <IconButtonV3 icon={Trash2} size={38} label={t('common.remove')} onPress={() => removeContact(c.id)} />
              <CallButton onPress={() => call(c.phone)} />
            </LineRow>
          </Animated.View>
        ))}
      </Glass>

      {adding ? (
        <Glass style={{ gap: 12 }}>
          <FieldV3 icon={User} placeholder={t('profile.contactName')} value={name} onChangeText={(v) => (setName(v), setError(false))} autoFocus />
          <FieldV3 icon={Phone} placeholder={t('profile.contactPhone')} value={phone} onChangeText={(v) => (setPhone(v.replace(/[^\d+]/g, '')), setError(false))} keyboardType="phone-pad" />
          <ErrorV3>{error && t('phone.error')}</ErrorV3>
          <ButtonV3
            label={t('common.add')}
            disabled={!name.trim()}
            onPress={() => {
              if (phone.replace(/\D/g, '').length < 10) return setError(true);
              addContact(name.trim(), phone);
              setName('');
              setPhone('');
              setAdding(false);
            }}
          />
          <ButtonV3 label={t('common.cancel')} variant="glass" onPress={() => setAdding(false)} />
        </Glass>
      ) : (
        <ButtonV3 label={t('profile.addContact')} icon={Plus} variant="glass" onPress={() => setAdding(true)} />
      )}
    </>
  );
}

function CallButton({ onPress }: { onPress: () => void }) {
  const { t } = useI18n();
  return (
    <PressableScale onPress={onPress} accessibilityLabel={t('common.call')} style={styles.call}>
      <Phone size={16} color={v3.white} strokeWidth={1.6} />
    </PressableScale>
  );
}

function Privacy() {
  const { t } = useI18n();
  const [share, setShare] = useState(false);
  const [lock, setLock] = useState(true);
  const [requested, setRequested] = useState(false);
  return (
    <>
      <Glass index={1} style={{ gap: 12 }}>
        <IconGlass icon={Shield} size={48} />
        <T size={16} weight="light" style={{ lineHeight: 25 }}>
          {t('profile.privacyBody')}
        </T>
      </Glass>
      <Glass index={2} style={{ paddingVertical: 4 }}>
        <LineRow first>
          <T size={15} style={{ flex: 1 }}>
            {t('profile.privacyShare')}
          </T>
          <SwitchV3 value={share} onValueChange={setShare} />
        </LineRow>
        <LineRow>
          <Lock size={16} color={v3.black} strokeWidth={1.5} />
          <T size={15} style={{ flex: 1 }}>
            {t('profile.privacyLock')}
          </T>
          <SwitchV3 value={lock} onValueChange={setLock} />
        </LineRow>
      </Glass>
      <ButtonV3 label={t('profile.privacyDelete')} variant="glass" disabled={requested} onPress={() => setRequested(true)} />
      {requested && (
        <Animated.View entering={enter.drop()}>
          <T size={14} color={v3.muted} align="center">
            {t('profile.privacyRequested')}
          </T>
        </Animated.View>
      )}
    </>
  );
}

function Help() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);
  const faqs: [StringKey, StringKey][] = [
    ['profile.faq1q', 'profile.faq1a'],
    ['profile.faq2q', 'profile.faq2a'],
    ['profile.faq3q', 'profile.faq3a'],
  ];
  return (
    <>
      <T size={16} weight="light" color={v3.muted} style={{ lineHeight: 25 }}>
        {t('profile.helpBody')}
      </T>
      <Glass index={1} style={{ paddingVertical: 4 }}>
        {faqs.map(([q, a], i) => (
          <Animated.View key={q} layout={layout}>
            {i > 0 && <HRule />}
            <Pressable onPress={() => setOpen(open === i ? null : i)} accessibilityRole="button" accessibilityState={{ expanded: open === i }} style={styles.faqHead}>
              <T size={13} weight="medium" color={v3.muted} style={{ width: 24 }}>
                {`0${i + 1}`}
              </T>
              <T size={16} style={{ flex: 1 }}>
                {t(q)}
              </T>
              <View style={{ transform: [{ rotate: open === i ? '180deg' : '0deg' }] }}>
                <ChevronDown size={18} color={v3.black} strokeWidth={1.4} />
              </View>
            </Pressable>
            {open === i && (
              <Animated.View entering={enter.fade()} style={{ paddingStart: 24, paddingBottom: 16 }}>
                <T size={15} weight="light" style={{ lineHeight: 23 }}>
                  {t(a)}
                </T>
              </Animated.View>
            )}
          </Animated.View>
        ))}
      </Glass>
      <ButtonV3 label={t('profile.contactSupport')} icon={Mail} variant="glass" onPress={() => Linking.openURL('mailto:support@humraah.pk').catch(() => {})} />
      <T size={12} color={v3.muted} align="center">
        {t('profile.version')}
      </T>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: GUTTER_V3, paddingTop: 16, paddingBottom: 40, gap: 18 },
  portrait: { position: 'absolute', top: -55, alignSelf: 'center' },
  shape: { position: 'absolute', top: -60, end: 16 },
  shapeCenter: { position: 'absolute', top: -80, alignSelf: 'center' },
  call: { width: 40, height: 40, borderRadius: radiusV3.pill, backgroundColor: v3.black, alignItems: 'center', justifyContent: 'center' },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 16 },
});
