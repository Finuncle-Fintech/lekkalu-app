import { Text, View } from 'tamagui'
import SetBudget from '@/screen-components/set-budget'

export default function Budgets() {
  return (
    <View flex={1} bg="$background" p="$4">
      <SetBudget />

      <Text>Testing</Text>
    </View>
  )
}
