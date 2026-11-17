import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { Tabs } from 'expo-router/js-tabs';
import { CalendarCheck, UserCog } from 'lucide-react-native';
import { AppHeaderV3, type NavItem } from '@/design/v3/AppHeaderV3';
import { HeaderChromeContext } from '@/design/v3/kit';
import { v3 } from '@/design/v3/tokens';
import { useAppStore } from '@/store/AppStore';

const items: NavItem[] = [
  { name: 'index', icon: CalendarCheck, label: 'nav.appointments' },
  { name: 'listing', icon: UserCog, label: 'nav.listing' },
];

/** Specialists get their own two-tab app: appointments and their listing. Mothers never land here. */
export default function DoctorLayout() {
  const { signedIn, user, authReady } = useAppStore();
  // Wait for a kept session to come back before deciding the visitor is signed out.
  if (!authReady) return <View style={{ flex: 1, backgroundColor: v3.bone }} />;
  if (!signedIn) return <Redirect href="/welcome" />;
  if (user.role !== 'specialist') return <Redirect href="/" />;

  return (
    <HeaderChromeContext.Provider value>
      <Tabs
        tabBar={(props) => <AppHeaderV3 {...props} items={items} base="/doctor" showBell={false} />}
        screenOptions={{ headerShown: false, tabBarPosition: 'top', animation: 'fade', sceneStyle: { backgroundColor: v3.bone } }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="listing" />
      </Tabs>
    </HeaderChromeContext.Provider>
  );
}
