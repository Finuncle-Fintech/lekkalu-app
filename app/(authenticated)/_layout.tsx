import { DrawerToggleButton } from '@react-navigation/drawer'
import { Drawer } from 'expo-router/drawer'

export default function AuthenticatedAppLayout() {
  return (
    <Drawer screenOptions={{ headerShown: false }} initialRouteName="dashboard">
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

      <Drawer.Screen
        name="create-expense"
        options={{
          title: 'Create Expense',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
        }}
      />

      <Drawer.Screen
        name="update-expense/[id]"
        options={{
          title: 'Update Expense',
          headerShown: true,
          drawerItemStyle: { display: 'none' },
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
    </Drawer>
  )
}
