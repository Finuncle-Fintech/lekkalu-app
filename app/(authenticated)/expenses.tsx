import { AddIcon, Button, VStack } from 'native-base'
import { Link } from 'expo-router'
import { useTheme } from 'tamagui'
import ExpenseList from '@/components/expense-list'

export default function Expenses() {
  const theme = useTheme()
  return (
    <VStack flex={1} p={4} space={4} bg={theme.backgroundHover.val}>
      <Link href="/create-expense" asChild>
        <Button startIcon={<AddIcon />}>Create Expense</Button>
      </Link>

      <ExpenseList />
    </VStack>
  )
}
