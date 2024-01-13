import { Heading, ScrollView, Text, View, YStack, XStack } from 'tamagui'
import { useQuery } from '@tanstack/react-query'
import { range, sortBy } from 'lodash'
import dayjs from 'dayjs'
import { fetchBudgets } from '@/queries/budget'
import { BUDGET_QUERY_KEYS } from '@/utils/query-keys'

export default function Budgets() {
  const { data, isLoading } = useQuery({
    queryKey: [BUDGET_QUERY_KEYS.BUDGETS],
    queryFn: fetchBudgets,
  })

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
    <ScrollView flex={1} bg="$background" p="$4" space="$4">
      {sortedByMonth?.map((budget) => {
        const month = dayjs(budget.month).format('MMMM')

        return (
          <XStack key={budget.id} p="$4" borderRadius="$5" space="$4" backgroundColor="$dark" alignItems="center">
            <View w="$6" h="$6" bg="$background" borderRadius={9999} alignItems="center" justifyContent="center">
              <Text fontWeight="bold" fontSize="$8" color="$primary">
                {month[0]}
              </Text>
            </View>

            <YStack space="$2">
              <Heading fontWeight="bold">{month}</Heading>
              <Text fontSize="$5">₹ {budget.limit}</Text>
            </YStack>
          </XStack>
        )
      })}
    </ScrollView>
  )
}
