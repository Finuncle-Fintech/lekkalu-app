import { Tabs } from 'expo-router/tabs'
import { AntDesign } from '@expo/vector-icons'
import { Text, View, useTheme } from 'tamagui'

const TabBarIcon = ({ focused, name }: { focused: boolean; name: React.ComponentProps<typeof AntDesign>['name'] }) => {
  const theme = useTheme()

  return <AntDesign name={name} size={24} color={focused ? theme.primary.get() : theme.color.get()} />
}

const TabBarLabel = ({ children, focused }: { children: string; focused: boolean }) => (
  <Text color={focused ? '$primary' : '$color'}>{children}</Text>
)

export default function AuthenticatedAppLayout() {
  const theme = useTheme()

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        tabBarStyle: {
          paddingTop: 10,
          paddingBottom: 10,
          height: 70,
          backgroundColor: theme.dark.get(),
          borderTopColor: 'transparent',
        },
        header: ({ options }) => (
          <>
            <View width="100%" h="$1" bg="$dark" />
            <View bg="$dark" jc="center" px="$4" py="$5">
              <Text color="$color" fontSize="$8" fontWeight="bold">
                {options.title}
              </Text>
            </View>
          </>
        ),
      }}
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
