import { ScrollView, View } from 'native-base'
import UpdateUserInfo from '@/components/update-user-info'
import ChangePassword from '@/components/change-password'

export default function Settings() {
  return (
    <ScrollView p={4}>
      <UpdateUserInfo />

      <View h="5" />

      <ChangePassword />
    </ScrollView>
  )
}
