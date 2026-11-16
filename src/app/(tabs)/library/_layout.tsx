import { Stack } from 'expo-router/stack';
import { v3 } from '@/design/v3/tokens';
import { useI18n } from '@/i18n';

/**
 * The Library tab is its own stack: the library home, with topics and journal guides pushed on top.
 * Articles can't be hidden tab routes, since hidden tabs redirect to the first tab.
 */
export default function LibraryLayout() {
  const { isRTL } = useI18n();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: v3.bone },
        animation: isRTL ? 'slide_from_left' : 'slide_from_right',
        animationDuration: 260,
      }}
    />
  );
}
