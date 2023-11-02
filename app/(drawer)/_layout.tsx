import { Drawer } from 'expo-router/drawer'

export default function Layout() {
  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
        }}
      />
    </Drawer>
  )
}
