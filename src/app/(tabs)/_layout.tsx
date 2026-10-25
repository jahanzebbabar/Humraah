import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { NavCapsuleV3 } from '@/design/v3/NavCapsuleV3';
import { v3 } from '@/design/v3/tokens';
import { useAppStore } from '@/store/AppStore';

export default function TabsLayout() {
  const { signedIn } = useAppStore();
  if (!signedIn) return <Redirect href="/welcome" />;

  return (
    <Tabs
      tabBar={(props) => <NavCapsuleV3 {...props} />}
      screenOptions={{ headerShown: false, animation: 'fade', sceneStyle: { backgroundColor: v3.bone } }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="planner" />
      <Tabs.Screen name="chat" />
      {/* Leaving the tab resets it to the list, so it never reopens on an old profile. */}
      <Tabs.Screen name="consultants" options={{ popToTopOnBlur: true }} />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
