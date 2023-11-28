import { NativeBaseProvider, extendTheme } from 'native-base'
import { Slot } from 'expo-router'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { THEME_COLORS } from '@/utils/theme'
import { AuthProvider } from '@/hooks/use-auth'
import { queryClient } from '@/utils/query-client'

const theme = extendTheme({ colors: THEME_COLORS })

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
})

export default function AppLayout() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
      <AuthProvider>
        <NativeBaseProvider theme={theme}>
          <Slot />
        </NativeBaseProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  )
}
