import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { View } from 'react-native';
import { AskHumraahBot } from '@/components/AskHumraahBot';
import { AppHeaderV3 } from '@/design/v3/AppHeaderV3';
import { HeaderChromeContext } from '@/design/v3/kit';
import { v3 } from '@/design/v3/tokens';
import { useAppStore } from '@/store/AppStore';

export default function TabsLayout() {
  const { signedIn, user } = useAppStore();
  if (!signedIn) return <Redirect href="/welcome" />;
  // Specialists have their own app under /doctor.
  if (user.role === 'specialist') return <Redirect href="/doctor" />;

  return (
    <HeaderChromeContext.Provider value>
      <View style={{ flex: 1, backgroundColor: v3.bone }}>
        <Tabs
          tabBar={(props) => <AppHeaderV3 {...props} />}
          screenOptions={{ headerShown: false, tabBarPosition: 'top', animation: 'fade', sceneStyle: { backgroundColor: v3.bone } }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="planner" />
          <Tabs.Screen name="library" />
          {/* Leaving the tab resets it to the list, so it never reopens on an old profile. */}
          <Tabs.Screen name="consultants" options={{ popToTopOnBlur: true }} />
          <Tabs.Screen name="settings" />
        </Tabs>
        {/* Ask Humraah lives in the corner of every main section rather than in its own tab. */}
        <AskHumraahBot />
      </View>
    </HeaderChromeContext.Provider>
  );
}
