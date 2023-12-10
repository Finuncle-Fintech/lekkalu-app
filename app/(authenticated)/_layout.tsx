import { Tabs } from 'expo-router/tabs'
import { AntDesign } from '@expo/vector-icons'
import { Text } from 'native-base'
import { THEME_COLORS } from '@/utils/theme'

const TabBarIcon = ({ focused, name }: { focused: boolean; name: React.ComponentProps<typeof AntDesign>['name'] }) => (
  <AntDesign name={name} size={24} color={focused ? THEME_COLORS.primary['300'] : '#6b7280'} />
)

const TabBarLabel = ({ children, focused }: { children: string; focused: boolean }) => (
  <Text fontSize="xs" color={focused ? 'primary.500' : 'gray.500'}>
    {children}
  </Text>
)

export default function AuthenticatedAppLayout() {
  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{ tabBarStyle: { paddingTop: 10, paddingBottom: 10, height: 70 } }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabBarIcon name="home" focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="balance-sheet"
        options={{
          title: 'Balance Sheet',
          tabBarIcon: ({ focused }) => <TabBarIcon name="calculator" focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ focused }) => <TabBarIcon name="wallet" focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabBarIcon name="setting" focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />

      <Tabs.Screen
        name="create-expense"
        options={{
          title: 'Create Expense',
          href: null,
        }}
      />

      <Tabs.Screen
        name="update-expense/[id]"
        options={{
          title: 'Update Expense',
          href: null,
        }}
      />
    </Tabs>
  )
}
