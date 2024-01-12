import { NativeBaseProvider, extendTheme } from 'native-base'
import { Slot } from 'expo-router'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { TamaguiProvider, Theme } from 'tamagui'
import { useColorScheme } from 'react-native'
import { useFonts } from 'expo-font'
import { THEME_COLORS } from '@/utils/theme'
import { AuthProvider } from '@/hooks/use-auth'
import { queryClient } from '@/utils/query-client'
import config from '@/tamagui.config'

export const theme = extendTheme({ colors: THEME_COLORS })

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'async-persister',
})

export default function AppLayout() {
  const colorScheme = useColorScheme()

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })
  if (!loaded) {
    return null
  }

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
      <AuthProvider>
        <TamaguiProvider config={config}>
          <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
            <NativeBaseProvider theme={theme}>
              <Slot />
            </NativeBaseProvider>
          </Theme>
        </TamaguiProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  )
}
