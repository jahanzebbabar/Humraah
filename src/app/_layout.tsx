import {
  PlusJakartaSans_200ExtraLight,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_600SemiBold_Italic,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  PlusJakartaSans_800ExtraBold_Italic,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  NotoNastaliqUrdu_400Regular,
  NotoNastaliqUrdu_500Medium,
  NotoNastaliqUrdu_600SemiBold,
  NotoNastaliqUrdu_700Bold,
} from '@expo-google-fonts/noto-nastaliq-urdu';
import { SplashScreen } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { layoutDirection } from '@/components/Screen';
import { v3 } from '@/design/v3/tokens';
import { LanguageProvider, useI18n } from '@/i18n';
import { AppStoreProvider } from '@/store/AppStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_200ExtraLight,
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_600SemiBold_Italic,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    PlusJakartaSans_800ExtraBold_Italic,
    NotoNastaliqUrdu_400Regular,
    NotoNastaliqUrdu_500Medium,
    NotoNastaliqUrdu_600SemiBold,
    NotoNastaliqUrdu_700Bold,
  });

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AppStoreProvider>
          <Gate ready={fontsLoaded || !!fontError}>
            <StatusBar style="dark" />
            <Navigator />
          </Gate>
        </AppStoreProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

/** Keep the splash screen up until fonts and the saved language are both ready. */
function Gate({ ready, children }: { ready: boolean; children: ReactNode }) {
  const { ready: langReady, isRTL } = useI18n();
  const done = ready && langReady;
  useEffect(() => {
    if (done) SplashScreen.hideAsync();
  }, [done]);
  if (!done) return null;
  return <View style={[{ flex: 1 }, layoutDirection(isRTL ? 'rtl' : 'ltr')]}>{children}</View>;
}

function Navigator() {
  const { isRTL } = useI18n();
  const push = isRTL ? 'slide_from_left' : 'slide_from_right';
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: v3.bone }, animation: push, animationDuration: 260 }}>
      <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen name="doctor" options={{ animation: 'fade' }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="phone-login" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="week" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="profile/[section]" />
      <Stack.Screen name="breathing" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="supplements" />
    </Stack>
  );
}
