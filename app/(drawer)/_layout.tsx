import { DrawerToggleButton } from '@react-navigation/drawer'
import { Drawer } from 'expo-router/drawer'

export default function Layout() {
  return (
    <Drawer
      defaultStatus={'closed'}
      initialRouteName="SipCalculator"
      screenOptions={{ headerShown: false, swipeEnabled: false }}
    >
      <Drawer.Screen
        name="SipCalculator"
        options={{
          title: 'Sip Calculator',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
    </Drawer>
  )
}
