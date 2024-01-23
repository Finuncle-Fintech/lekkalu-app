import { Heading, View } from 'native-base'
import { Redirect } from 'expo-router'
import { useColorScheme } from 'react-native'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

import { useAuthContext } from '@/hooks/use-auth'
import { FontSizes } from '@/utils/fonts'

dayjs.extend(relativeTime)

export default function App() {
  const { isAuthenticationInProgress, userData } = useAuthContext()
  const systemTheme = useColorScheme()

  if (isAuthenticationInProgress) {
    return (
      <View flex={1} bg="brand.900" alignItems="center" justifyContent="center">
        <Heading color={systemTheme === 'dark' ? 'white' : 'black'} fontSize={FontSizes.size26}>
          Authenticating....
        </Heading>
      </View>
    )
  }

  if (typeof userData !== 'undefined') {
    return <Redirect href="/(authenticated)/dashboard" />
  }

  return <Redirect href="/login" />
}
