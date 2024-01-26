import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Calculator, Coins, Home, IndianRupee, Settings2 } from '@tamagui/lucide-icons'
import { cloneElement } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, View, XStack, YStack } from 'tamagui'

export const TABS: { label: string; icon: React.ReactElement<{ size: number; color: string }>; link: string }[] = [
  {
    label: 'Home',
    icon: <Home />,
    link: 'dashboard',
  },
  {
    label: 'Balance Sheet',
    icon: <Calculator />,
    link: 'balance-sheet',
  },
  {
    label: 'Expenses',
    icon: <Coins />,
    link: 'expenses',
  },
  {
    label: 'Budgets',
    icon: <IndianRupee />,
    link: 'budgets',
  },
  {
    label: 'Settings',
    icon: <Settings2 />,
    link: 'settings',
  },
]

export default function BottomBar({ navigation, state }: BottomTabBarProps) {
  const isTabActive = (routeName: string) => {
    const currentRouteName = state.routeNames[state.index]
    return currentRouteName === routeName
  }

  return (
    <View bg="$background">
      <XStack bg="$dark" ai="center" jc="center" p="$4" borderTopLeftRadius="$8" borderTopRightRadius="$8" space="$5">
        {TABS.map((tab) => {
          const isActive = isTabActive(tab.link.replaceAll('/', ''))

          return (
            <TouchableOpacity
              key={tab.link}
              onPress={() => {
                navigation.navigate(tab.link)
              }}
            >
              <YStack ai="center" jc="center" space="$2">
                {cloneElement(tab.icon, {
                  size: 22,
                  color: isActive ? '$highlight' : '$mutedForeground',
                })}

                <Text fontSize="$3" color={isActive ? '$highlight' : '$mutedForeground'}>
                  {tab.label}
                </Text>
              </YStack>
            </TouchableOpacity>
          )
        })}
      </XStack>
    </View>
  )
}

BottomBar.Tabs = TABS
