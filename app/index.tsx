import { useEffect } from 'react'
import { View } from 'native-base'
import { Redirect } from 'expo-router'
import { AppRegistry } from 'react-native'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { Spinner } from 'tamagui'

import { useAuthContext } from '@/hooks/use-auth'

dayjs.extend(relativeTime)

export default function App() {
  const { fetchUserData, isLoadingUserData, userData } = useAuthContext()

  useEffect(() => {
    fetchUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoadingUserData) {
    return (
      <View flex={1} bg="brand.900" alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </View>
    )
  }

  if (userData) {
    return <Redirect href="/(authenticated)/dashboard" />
  } else {
    return <Redirect href="/login" />
  }
}

AppRegistry.registerComponent('main', () => App)
