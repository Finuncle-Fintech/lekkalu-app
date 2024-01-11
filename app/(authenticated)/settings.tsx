import { Button, Icon, VStack } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import { useTheme } from 'tamagui'
import { useAuthContext } from '@/hooks/use-auth'
import Feedback from '@/components/feedback'

export default function Settings() {
  const { logout } = useAuthContext()
  const theme = useTheme()

  return (
    <VStack p={4} space={4} bg="white" flex={1} bgColor={theme.backgroundHover.get()}>
      <Feedback />

      <Button endIcon={<Icon as={AntDesign} name="logout" />} mb={8} variant="outline" onPress={logout}>
        Logout
      </Button>
    </VStack>
  )
}
