import { Heading, Text, View, YStack, XStack, Button, Spinner } from 'tamagui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { range, sortBy } from 'lodash'
import dayjs from 'dayjs'
import { SwipeListView } from 'react-native-swipe-list-view'
import { Trash } from '@tamagui/lucide-icons'
import Toast from 'react-native-toast-message'
import { isAxiosError } from 'axios'
import { deleteBudget, fetchBudgets } from '@/queries/budget'
import { BUDGET_QUERY_KEYS } from '@/utils/query-keys'
import { Budget } from '@/types/budget'
import UpdateBudget from '@/screen-components/update-budget'

export default function Budgets() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: [BUDGET_QUERY_KEYS.BUDGETS],
    queryFn: fetchBudgets,
  })

  const deleteBudgetMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: (_, deletedBudgetId) => {
      queryClient.setQueryData<Budget[]>([BUDGET_QUERY_KEYS.BUDGETS], (prevData) => {
        if (!prevData) return []

        return prevData.filter((b) => b.id !== deletedBudgetId)
      })

      Toast.show({ type: 'success', text1: 'Budget removed successfully!' })
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        Toast.show({ type: 'error', text1: 'Something went wrong.', text2: error?.response?.data?.message })
        return
      }

      Toast.show({ type: 'error', text1: 'Something went wrong.', text2: 'Please try again later!' })
    },
  })

  function handleDeleteBudget(id: number) {
    deleteBudgetMutation.mutate(id)
  }

  if (isLoading) {
    return (
      <YStack flex={1} bg="$background" p="$4" space="$4">
        {range(5).map((i) => (
          <View key={i} h="$10" width="100%" bg="$backgroundHover" borderRadius="$5" />
        ))}
      </YStack>
    )
  }

  if (!data) {
    return <Text>No Budgets</Text>
  }

  const sortedByMonth = sortBy(data, (item) => dayjs(item.month).month())

  return (
    <View flex={1} bg="$background" p="$4" space="$4">
      <SwipeListView
        data={sortedByMonth}
        rightOpenValue={-75}
        keyExtractor={(item) => item.id.toString()}
        renderHiddenItem={(data) => (
          <View flex={1} alignItems="center" flexDirection="row" justifyContent="flex-end" pr="$4" position="relative">
            <View mt="$-3" bg="red" borderRadius="$4">
              <Button
                icon={deleteBudgetMutation.isPending ? <Spinner /> : <Trash />}
                chromeless
                onPress={() => {
                  handleDeleteBudget(data.item.id)
                }}
              />
            </View>
          </View>
        )}
        renderItem={({ item: budget }) => {
          const month = dayjs(budget.month).format('MMMM')

          return (
            <UpdateBudget budget={budget}>
              <XStack
                key={budget.id}
                p="$4"
                borderRadius="$5"
                space="$4"
                backgroundColor="$dark"
                alignItems="center"
                mb="$4"
              >
                <View w="$6" h="$6" bg="$background" borderRadius={9999} alignItems="center" justifyContent="center">
                  <Text fontWeight="bold" fontSize="$9" color="$primary">
                    {month[0]}
                  </Text>
                </View>

                <YStack space="$2">
                  <Heading fontWeight="bold">{month}</Heading>
                  <Text fontSize="$5">₹ {budget.limit}</Text>
                </YStack>
              </XStack>
            </UpdateBudget>
          )
        }}
      />
    </View>
  )
}
