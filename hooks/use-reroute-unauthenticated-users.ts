import { useEffect } from 'react'
import { router, useRootNavigationState } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const useRerouteUnAuthenticatedUser = ({ pathname, params }: any) => {
  const rootNavigationState = useRootNavigationState()

  async function reRoute() {
    const isLoggedIn = await AsyncStorage.getItem('is_logged_in')
    if (!isLoggedIn) {
      router.replace({ pathname, params })
    }
  }

  useEffect(() => {
    if (rootNavigationState?.key) {
      reRoute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootNavigationState])
}

export default useRerouteUnAuthenticatedUser
