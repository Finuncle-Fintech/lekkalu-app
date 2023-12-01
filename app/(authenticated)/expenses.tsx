import { AddIcon, Button, Heading, VStack } from 'native-base'
import ExpenseList from '@/components/expense-list'
import CreateOrEditExpense from '@/components/create-or-edit-expense'

export default function Expenses() {
  return (
    <VStack flex={1} p={4} space={4}>
      <Heading>Expenses</Heading>

      <CreateOrEditExpense trigger={<Button startIcon={<AddIcon />}>Create Expense</Button>} />

      <ExpenseList />
    </VStack>
  )
}
