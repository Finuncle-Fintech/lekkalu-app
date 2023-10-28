import { NativeBaseProvider, extendTheme } from 'native-base'
import { Slot } from 'expo-router'
import { THEME_COLORS } from '../utils/theme'

const theme = extendTheme({ colors: THEME_COLORS })
export default function AppLayout() {
  return (
    <NativeBaseProvider theme={theme}>
      <Slot />
    </NativeBaseProvider>
  )
}
