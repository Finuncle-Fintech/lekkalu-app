import { Tabs } from 'expo-router/tabs'
import { Text, View, useTheme } from 'tamagui'
import { Calculator, Coins, Home, IndianRupee, Settings } from '@tamagui/lucide-icons'
import { cloneElement } from 'react'

const TabBarIcon = ({ focused, icon }: { focused: boolean; icon: React.ReactElement<{ color: string }> }) => {
  const theme = useTheme()

  return cloneElement(icon, { color: focused ? theme.highlight.get() : theme.mutedForeground.get() })
}

const TabBarLabel = ({ children, focused }: { children: string; focused: boolean }) => (
  <Text color={focused ? '$highlight' : '$mutedForeground'} fontSize="$2">
    {children}
  </Text>
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
          borderTopWidth: 0,
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
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon icon={<Home />} focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="balance-sheet"
        options={{
          title: 'Balance Sheet',
          tabBarIcon: ({ focused }) => <TabBarIcon icon={<Calculator />} focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ focused }) => <TabBarIcon icon={<Coins />} focused={focused} />,
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

      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ focused }) => <TabBarIcon icon={<IndianRupee />} focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabBarIcon icon={<Settings />} focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />
    </Tabs>
  )
}
