import { Heading, ScrollView, Text, View, YStack } from 'tamagui'
import { useQuery } from '@tanstack/react-query'
import { range } from 'lodash'
import dayjs from 'dayjs'
import SetBudget from '@/screen-components/set-budget'
import { fetchBudgets } from '@/queries/budget'
import { MONTH_COLOR_MAP } from '@/utils/budget'

export default function Budgets() {
  const { data, isLoading } = useQuery({
    queryKey: ['BUDGETS'],
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

  return (
    <View flex={1} bg="$background" p="$4">
      <SetBudget />

      <ScrollView mt="$4" space="$4">
        {data?.map((budget) => (
          <YStack
            key={budget.id}
            p="$4"
            borderRadius="$5"
            space="$2"
            backgroundColor={MONTH_COLOR_MAP[dayjs(budget.month).month()]}
          >
            <Heading fontWeight="bold">{dayjs(budget.month).format('MMMM')}</Heading>
            <Text fontSize="$5">₹ {budget.limit}</Text>
          </YStack>
        ))}
      </ScrollView>
    </View>
  )
}
