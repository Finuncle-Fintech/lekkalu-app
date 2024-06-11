import { useEffect, useState } from 'react'
import { Link, useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Button, HStack, Text, VStack, FlatList, IconButton } from 'native-base'
import moment from 'moment'
import { EvilIcons } from '@expo/vector-icons'
import { View, useTheme } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import { fetchLendingTransaction } from '@/queries/lending'
import { LENDING } from '@/utils/query-keys/lending'
import { Transaction } from '@/types/lending'
import { describeTransaction } from '@/utils/lending'
import DeleteTransaction from '@/components/delete-transaction/delete-transaction'

export default function LendingAccountTransactions() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [accountHistory, setAccountHistory] = useState<Transaction[]>([])
  const theme = useTheme()

  const lendingTransaction = useQuery({
    queryFn: fetchLendingTransaction,
    queryKey: [LENDING.TRANSACTIONS],
    enabled: !!id,
    staleTime: 0,
  })

  useEffect(() => {
    if (lendingTransaction.data) {
      setAccountHistory(lendingTransaction.data?.filter((ele) => ele.lending_account === parseInt(id)))
    }
  }, [id, lendingTransaction.data])

  return (
    <View flex={1} p={4} bg="$backgroundHover">
      <VStack bgColor={theme.backgroundHover.get()} flex={1} p={4} space={4}>
        <FlatList
          refreshing={lendingTransaction.isLoading || lendingTransaction.isLoading}
          keyExtractor={(item) => item.id.toString()}
          data={accountHistory ?? []}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <VStack
              space={4}
              bg={theme.background.get()}
              rounded="md"
              p="3"
              shadow="sm"
              mb="4"
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
            >
              <View flex={1} mr={wp(3)}>
                <HStack alignItems="center" space={2}>
                  <HStack flexDir={'column'} space={2}>
                    <HStack space={1} alignItems="baseline">
                      <Text color={theme.foreground.get()} fontSize={FontSizes.size18} fontWeight="600">
                        {item.lending_account} •
                      </Text>
                      <Text color={theme.gray10.get()} fontSize={FontSizes.size16} fontWeight="500">
                        {moment(item.time).format('MMM DD, YYYY')}
                      </Text>
                    </HStack>
                    <Text color={theme.foreground.get()} fontSize={FontSizes.size18}>
                      {describeTransaction(item.amount)}
                    </Text>
                  </HStack>
                </HStack>
              </View>
              <HStack alignItems="center" space={2}>
                <Button.Group display={'flex'} alignItems={'center'}>
                  <Link href={`/update-expense/${item.id}`} asChild>
                    <IconButton
                      size={wp(6)}
                      variant="solid"
                      _icon={{
                        as: EvilIcons,
                        name: 'pencil',
                        size: 6,
                      }}
                    />
                  </Link>
                  <DeleteTransaction transactions={accountHistory} id={item.id} />
                </Button.Group>
              </HStack>
            </VStack>
          )}
        />
        <Button height={hp(5)} _text={{ style: { fontSize: FontSizes.size15 } }}>
          Add Transaction
        </Button>
      </VStack>
    </View>
  )
}
