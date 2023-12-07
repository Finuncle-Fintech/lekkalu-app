import { AddIcon, Button, Heading, VStack } from 'native-base'
import { Link } from 'expo-router'
import ExpenseList from '@/components/expense-list'

export default function Expenses() {
  return (
    <VStack flex={1} p={4} space={4}>
      <Heading>Expenses</Heading>

      <Link href="/create-expense" asChild>
        <Button startIcon={<AddIcon />}>Create Expense</Button>
      </Link>

      <ExpenseList />
    </VStack>
  )
}
