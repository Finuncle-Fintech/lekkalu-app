import { Button, Icon, ScrollView, View } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import UpdateUserInfo from '@/components/update-user-info'
import ChangePassword from '@/components/change-password'
import { useAuthContext } from '@/hooks/use-auth'

export default function Settings() {
  const { logout } = useAuthContext()

  return (
    <ScrollView p={4}>
      <UpdateUserInfo />

      <View h="5" />

      <ChangePassword />

      <View h="5" />

      <Button endIcon={<Icon as={AntDesign} name="logout" />} mb={8} variant="outline" onPress={logout}>
        Logout
      </Button>
    </ScrollView>
  )
}
