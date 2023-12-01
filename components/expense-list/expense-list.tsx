import { useQueries } from '@tanstack/react-query'
import { FlatList, HStack, IconButton, Text, VStack } from 'native-base'
import { useCallback } from 'react'
import { EvilIcons } from '@expo/vector-icons'
import { EXPENSES, TAGS } from '@/utils/query-keys'
import { fetchExpenses } from '@/queries/expense'
import { fetchTags } from '@/queries/tag'
import Loading from '../loading'
import CreateOrEditExpense from '../create-or-edit-expense'

export default function ExpenseList() {
  const [expenseQuery, tagsQuery] = useQueries({
    queries: [
      {
        queryKey: [EXPENSES.EXPENSES],
        queryFn: () => fetchExpenses(),
      },
      {
        queryKey: [TAGS.TAGS],
        queryFn: fetchTags,
      },
    ],
  })

  const getTagNames = useCallback(
    (tagIds: number[]) => {
      if (!tagsQuery.data) {
        return null
      }

      const foundTags = tagsQuery.data.filter((tag) => tagIds.includes(tag.id))
      return foundTags.map((tag) => tag.name).join(', ')
    },
    [tagsQuery.data],
  )

  if (expenseQuery.isLoading) {
    return <Loading title="Loading expenses..." />
  }

  return (
    <VStack>
      <FlatList
        refreshing={expenseQuery.isLoading || tagsQuery.isLoading}
        keyExtractor={(item) => item.id.toString()}
        data={expenseQuery.data ?? []}
        renderItem={({ item }) => (
          <VStack space={4} bg="white" rounded="md" p="4" shadow="sm" mb="4">
            <HStack space={2} fontSize="xl">
              <Text fontSize="lg">Amount : </Text>
              <Text fontSize="lg" fontWeight="bold">
                {item.amount}
              </Text>
            </HStack>
            <HStack space={2} fontSize="xl">
              <Text fontSize="lg">Tags : </Text>
              <Text fontSize="lg" fontWeight="bold">
                {getTagNames(item.tags)}
              </Text>
            </HStack>

            <CreateOrEditExpense
              expense={item}
              trigger={
                <IconButton
                  size={10}
                  variant="solid"
                  _icon={{
                    as: EvilIcons,
                    name: 'pencil',
                  }}
                />
              }
            />
          </VStack>
        )}
      />
    </VStack>
  )
}
