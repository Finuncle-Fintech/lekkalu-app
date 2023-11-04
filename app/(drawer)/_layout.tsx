import { DrawerToggleButton } from '@react-navigation/drawer'
import { Drawer } from 'expo-router/drawer'

export default function Layout() {
  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="home"
        options={{
          title: 'Home',
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
