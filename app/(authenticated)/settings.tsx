import { Button, Icon, VStack } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import { useTheme } from 'tamagui'
import { useColorScheme } from 'react-native'

import { useAuthContext } from '@/hooks/use-auth'
import Feedback from '@/components/feedback'
import { hp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import DeleteAccountModal from '@/components/delete-account-modal'

export default function Settings() {
  const { logout } = useAuthContext()
  const theme = useTheme()
  const systemTheme = useColorScheme()

  return (
    <VStack p={4} space={6} flex={1} bgColor={theme.backgroundHover.get()}>
      <Feedback />
      <Button
        height={hp(5)}
        _text={{ fontSize: FontSizes.size15, color: systemTheme === 'dark' ? 'white' : THEME_COLORS.primary[600] }}
        endIcon={
          <Icon as={AntDesign} name="logout" color={systemTheme === 'dark' ? 'white' : THEME_COLORS.primary[600]} />
        }
        variant="outline"
        onPress={logout}
      >
        Logout
      </Button>

      <DeleteAccountModal />
    </VStack>
  )
}
