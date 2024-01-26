import { Tabs } from 'expo-router/tabs'
import { Text, View } from 'tamagui'
import BottomTabBar from '@/components/bottom-tab-bar'

export default function AuthenticatedAppLayout() {
  return (
    <Tabs
      tabBar={BottomTabBar}
      initialRouteName="dashboard"
      screenOptions={{
        header: ({ options }) => (
          <>
            <View width="100%" h="$1" bg="$dark" />
            <View bg="$background">
              <View bg="$dark" jc="center" px="$4" py="$5" borderBottomLeftRadius="$8" borderBottomRightRadius="$8">
                <Text color="$color" fontSize="$8" fontWeight="bold">
                  {options.title}
                </Text>
              </View>
            </View>
          </>
        ),
      }}
    >
      {BottomTabBar.Tabs.map((tab) => (
        <Tabs.Screen
          key={tab.link}
          name={tab.link}
          options={{
            title: tab.label,
          }}
        />
      ))}
    </Tabs>
  )
}
