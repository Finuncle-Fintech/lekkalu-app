import { Heading, View } from 'native-base'
import { Redirect } from 'expo-router'
import { useAuthContext } from '@/hooks/use-auth'

export default function App() {
  const { isAuthenticationInProgress, userData } = useAuthContext()

  if (isAuthenticationInProgress) {
    return (
      <View flex={1} bg="brand.900" alignItems="center" justifyContent="center">
        <Heading color="white">Authenticating....</Heading>
      </View>
    )
  }

  if (typeof userData !== 'undefined') {
    return <Redirect href="/(authenticated)/dashboard" />
  }

  return <Redirect href="/sipCalculator" />
}
