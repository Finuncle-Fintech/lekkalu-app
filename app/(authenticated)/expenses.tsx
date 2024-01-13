import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Button, Text, XStack, YStack, useTheme } from 'tamagui'
import { Link, useRouter } from 'expo-router'
import { ArrowRight, Plus } from '@tamagui/lucide-icons'
import { FloatingAction } from 'react-native-floating-action'
import ExpenseList from '@/components/expense-list'
import { BUDGET_QUERY_KEYS } from '@/utils/query-keys'
import { fetchBudgets } from '@/queries/budget'
import SetBudget from '@/screen-components/set-budget'

export default function Expenses() {
  const theme = useTheme()

  const { data: budgets, isLoading } = useQuery({
    queryKey: [BUDGET_QUERY_KEYS.BUDGETS],
    queryFn: fetchBudgets,
  })

  const router = useRouter()

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

      <ExpenseList />

      <FloatingAction
        color={theme.primary.get()}
        actions={[
          {
            text: 'Add New Expense',
            name: 'add_expense',
            icon: <Plus />,
            color: theme.primary.get(),
          },
        ]}
        onPressItem={(name) => {
          if (name === 'add_expense') {
            router.push('/create-expense')
          }
        }}
      />
    </YStack>
  )
}
