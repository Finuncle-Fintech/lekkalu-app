import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Button, Text, XStack, YStack } from 'tamagui'
import { Link } from 'expo-router'
import { ArrowRight } from '@tamagui/lucide-icons'
import ExpenseList from '@/components/expense-list'
import { BUDGET_QUERY_KEYS } from '@/utils/query-keys'
import { fetchBudgets } from '@/queries/budget'
import SetBudget from '@/screen-components/set-budget'

export default function Expenses() {
  const { data: budgets, isLoading } = useQuery({
    queryKey: [BUDGET_QUERY_KEYS.BUDGETS],
    queryFn: fetchBudgets,
  })

  const currentMonthBudget = budgets?.find((budget) => dayjs(budget.month).month() === dayjs().month())

  return (
    <YStack flex={1} p="$4" bg="$background" space="$4">
      {!isLoading && (
        <YStack bg="$dark" p="$4" borderRadius="$8" space="$2">
          <Text fontWeight="bold" fontSize="$8">
            Budget
          </Text>

          <XStack space="$2">
            <Text fontSize="$6" fontWeight="bold">
              {dayjs().format('MMMM')} :{' '}
            </Text>
            <Text fontSize="$6">{currentMonthBudget?.limit ? `₹ ${currentMonthBudget.limit}` : 'N/A'}</Text>
          </XStack>

          <XStack mt="$4" space="$4">
            <SetBudget />
            <Link href="/budgets" asChild>
              <Button iconAfter={<ArrowRight />}>View All</Button>
            </Link>
          </XStack>
        </YStack>
      )}

      {/* <Link href="/create-expense" asChild>
        <Button startIcon={<AddIcon />}>Create Expense</Button>
      </Link> */}

      <ExpenseList />
    </YStack>
  )
}
