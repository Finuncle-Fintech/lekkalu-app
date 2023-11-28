import { Heading, VStack } from 'native-base'
import ExpenseList from '@/components/expense-list'

export default function Expenses() {
  return (
    <VStack flex={1} p={4} space={4}>
      <Heading>Expenses</Heading>

      <ExpenseList />
    </VStack>
  )
}
