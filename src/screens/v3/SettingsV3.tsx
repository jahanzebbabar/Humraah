import { useRouter, type Href } from 'expo-router';
import { Baby, BellRing, CalendarDays, ChevronRight, CircleHelp, HeartHandshake, LogOut, Phone, Shield, type LucideIcon } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFlip } from '@/components/Screen';
import { ButtonV3, Cells, Glass, H1V3, HRule, IconGlass, Kicker, LineRow, PortraitV3, ScreenV3, SegmentedV3, Stat, SwitchV3, T } from '@/design/v3/kit';
import { GUTTER_V3, v3 } from '@/design/v3/tokens';
import { useI18n, type Lang, type StringKey } from '@/i18n';
import { useAppStore } from '@/store/AppStore';
import { NAV_CLEARANCE } from '@/theme';
import { enter } from '@/theme/motion';

const trimesterOf = (week: number) => (week < 14 ? 1 : week < 28 ? 2 : 3);

export default function SettingsV3() {
  const router = useRouter();
  const flip = useFlip();
  const { t, L, lang, setLang } = useI18n();
  const { user, contacts, signOut } = useAppStore();
  const [toggles, setToggles] = useState({ reminders: true, tips: true });
  const initials = L(user.fullName)
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

  const link = (icon: LucideIcon, label: StringKey, href: Href, value?: string, first?: boolean) => (
    <LineRow first={first} onPress={() => router.push(href)}>
      <IconGlass icon={icon} size={38} />
      <T size={16} style={{ flex: 1 }} numberOfLines={1}>
        {t(label)}
      </T>
      {value && (
        <T size={14} color={v3.muted} numberOfLines={1} style={{ maxWidth: '40%' }}>
          {value}
        </T>
      )}
      <ChevronRight size={16} color={v3.black} strokeWidth={1.4} style={flip} />
    </LineRow>
  );

  return (
    <ScreenV3 orbs="b">
      <ScrollView contentContainerStyle={{ paddingBottom: NAV_CLEARANCE + 10 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter.rise(0)} style={styles.head}>
          <H1V3 size={48}>{t('v3.settings.h1')}</H1V3>
        </Animated.View>

        <Glass
          index={1}
          onPress={() => router.push('/profile/edit')}
          wrapStyle={[styles.gutter, { marginTop: 56 }]}
          style={{ paddingTop: 64, gap: 16 }}
          breakout={<PortraitV3 initials={initials} size={96} tone="rose" style={styles.portrait} />}
        >
          <View style={{ gap: 2 }}>
            <T size={26} weight="light" style={{ letterSpacing: -0.6, lineHeight: 32 }}>
              {L(user.fullName)}
            </T>
            <T size={13} color={v3.muted}>
              {user.email}
            </T>
          </View>
          <HRule />
          <Cells style={{ marginHorizontal: -14 }}>
            <Stat label={t('v2.home.weeksAlong')} value={user.week} size={36} />
            <Stat label={t('v2.home.weeksToGo')} value={40 - user.week} size={36} />
            <Stat label={t('v3.home.trimester')} value={trimesterOf(user.week)} size={36} />
          </Cells>
        </Glass>

        <Glass index={2} wrapStyle={[styles.gutter, { marginTop: 18 }]} style={{ gap: 12 }}>
          <Kicker>{t('settings.language')}</Kicker>
          <SegmentedV3<Lang>
            options={[
              { key: 'en', label: 'English' },
              { key: 'ur', label: 'اردو' },
            ]}
            value={lang}
            onChange={setLang}
          />
        </Glass>

        <Group title={t('settings.groupPregnancy')} index={3}>
          {link(CalendarDays, 'settings.dueDate', '/profile/due-date', t('profile.dueDate'), true)}
          {link(Baby, 'settings.nickname', '/profile/nickname', L(user.nickname))}
        </Group>

        <Group title={t('settings.groupPrefs')} index={4}>
          <LineRow first>
            <IconGlass icon={BellRing} size={38} />
            <T size={16} style={{ flex: 1 }}>
              {t('settings.reminders')}
            </T>
            <SwitchV3 value={toggles.reminders} onValueChange={(v) => setToggles((s) => ({ ...s, reminders: v }))} />
          </LineRow>
          <LineRow>
            <IconGlass icon={HeartHandshake} size={38} />
            <T size={16} style={{ flex: 1 }}>
              {t('settings.encouragement')}
            </T>
            <SwitchV3 value={toggles.tips} onValueChange={(v) => setToggles((s) => ({ ...s, tips: v }))} />
          </LineRow>
        </Group>

        <Group title={t('settings.groupSupport')} index={5}>
          {link(Phone, 'settings.emergency', '/profile/emergency', t('settings.saved', { n: contacts.length }), true)}
          {link(Shield, 'settings.privacy', '/profile/privacy')}
          {link(CircleHelp, 'settings.help', '/profile/help')}
        </Group>

        <View style={[styles.gutter, { marginTop: 30, gap: 16 }]}>
          <ButtonV3
            label={t('settings.signOut')}
            icon={LogOut}
            variant="glass"
            onPress={() => {
              signOut();
              router.replace('/welcome');
            }}
          />
          <T size={12} color={v3.muted} align="center">
            {t('settings.footer')}
          </T>
        </View>
      </ScrollView>
    </ScreenV3>
  );
}

function Group({ title, index, children }: { title: string; index: number; children: ReactNode }) {
  return (
    <View style={{ marginTop: 30 }}>
      <View style={{ marginHorizontal: GUTTER_V3 + 4, marginBottom: 12 }}>
        <Kicker>{title}</Kicker>
      </View>
      <Glass index={index} wrapStyle={styles.gutter} style={{ paddingVertical: 4 }}>
        {children}
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: GUTTER_V3, marginTop: 22 },
  gutter: { marginHorizontal: GUTTER_V3 },
  portrait: { position: 'absolute', top: -48, end: 24 },
});
