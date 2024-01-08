import { Tabs } from 'expo-router/tabs'
import { AntDesign } from '@expo/vector-icons'
import { Text, View, useTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { hp, wp } from '@/utils/responsive'

const TabBarIcon = ({ focused, name }: { focused: boolean; name: React.ComponentProps<typeof AntDesign>['name'] }) => {
  const theme = useTheme()

  return <AntDesign name={name} size={wp(5)} color={focused ? theme.primary.get() : theme.color.get()} />
}

const TabBarLabel = ({ children, focused }: { children: string; focused: boolean }) => (
  <Text textAlign="center" fontSize={wp(3)} numberOfLines={1} color={focused ? '$primary' : '$color'}>
    {children}
  </Text>
)

export default function AuthenticatedAppLayout() {
  const theme = useTheme()
  const { bottom, top } = useSafeAreaInsets()

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        tabBarStyle: {
          paddingTop: hp(1),
          paddingBottom: bottom + 4,
          height: hp(7.5) + bottom,
          backgroundColor: theme.background.val,
          borderTopColor: 'transparent',
        },
        tabBarItemStyle: { paddingHorizontal: wp(2) },
        header: ({ options }) => {
          return (
            <>
              <View width="100%" h="$1" bg="$background" style={{ paddingTop: top }} />
              <View flexDirection="row" bg="$background" jc="space-between" alignItems="center" px="$4" py="$3.5">
                <Text color="$color" fontSize="$8" fontWeight="bold">
                  {options.title}
                </Text>
              </View>
            </>
          )
        },
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
      <Tabs.Screen
        name="income-statement"
        options={{
          title: 'Income Statement',
          href: null,
        }}
      />
      <Tabs.Screen
        name="emi-calculator"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="emi-calculator-breakdown"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  )
}
