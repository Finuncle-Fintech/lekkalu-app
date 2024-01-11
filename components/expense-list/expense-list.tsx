import { useQueries } from '@tanstack/react-query'
import { Button, FlatList, HStack, IconButton, Text, VStack } from 'native-base'
import { useCallback } from 'react'
import { EvilIcons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { useTheme } from 'tamagui'
import { EXPENSES, TAGS } from '@/utils/query-keys'
import { fetchExpenses } from '@/queries/expense'
import { fetchTags } from '@/queries/tag'
import Loading from '../loading'
import DeleteExpense from '../delete-expense'

export default function ExpenseList() {
  const theme = useTheme()

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
    <FlatList
      refreshing={expenseQuery.isLoading || tagsQuery.isLoading}
      keyExtractor={(item) => item.id.toString()}
      data={expenseQuery.data ?? []}
      renderItem={({ item }) => (
        <VStack space={4} bg={theme.background.get()} rounded="md" p="4" shadow="sm" mb="4">
          <HStack space={2} fontSize="xl">
            <Text color={theme.foreground.get()} fontSize="lg">
              Amount :{' '}
            </Text>
            <Text color={theme.foreground.get()} fontSize="lg" fontWeight="bold">
              {item.amount}
            </Text>
          </HStack>
          <HStack space={2} fontSize="xl">
            <Text color={theme.foreground.get()} fontSize="lg">
              Tags :{' '}
            </Text>
            <Text color={theme.foreground.get()} fontSize="lg" fontWeight="bold">
              {getTagNames(item.tags)}
            </Text>
          </HStack>

          <Button.Group>
            <DeleteExpense id={item.id} />
            <Link href={`/update-expense/${item.id}`} asChild>
              <IconButton
                size={10}
                variant="solid"
                _icon={{
                  as: EvilIcons,
                  name: 'pencil',
                  size: 7,
                }}
              />
            </Link>
          </Button.Group>
        </VStack>
      )}
    />
  )
}
