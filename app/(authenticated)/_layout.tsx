import { DrawerToggleButton } from '@react-navigation/drawer'
import { Drawer } from 'expo-router/drawer'

export default function AuthenticatedAppLayout() {
  return (
    <Drawer screenOptions={{ headerShown: false }} initialRouteName="balance-sheet">
      <Drawer.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <Drawer.Screen
        name="balance-sheet"
        options={{
          title: 'Balance Sheet',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <Drawer.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
    </Drawer>
  )
}
