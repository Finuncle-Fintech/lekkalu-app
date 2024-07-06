import { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Button, VStack, FlatList, AddIcon } from 'native-base'
import { View, useTheme } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import { fetchLendingTransaction } from '@/queries/lending'
import { LENDING } from '@/utils/query-keys/lending'
import { Transaction } from '@/types/lending'
import CreateOrEditLendingTransaction from '@/components/create-or-edit-lending-transaction'
import LendingListItem from '@/components/lending-list/lending-list-item'

export default function LendingAccountTransactions() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [accountHistory, setAccountHistory] = useState<Transaction[]>([])
  const theme = useTheme()

  const lendingTransaction = useQuery({
    queryFn: fetchLendingTransaction,
    queryKey: [LENDING.TRANSACTIONS],
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
          renderItem={({ item }) => <LendingListItem accountHistory={accountHistory} item={item} />}
        />
        <CreateOrEditLendingTransaction
          lending_account={id}
          trigger={
            <Button
              height={hp(5)}
              _text={{ style: { fontSize: FontSizes.size16 } }}
              startIcon={<AddIcon size={wp(4)} />}
            >
              Add Transaction
            </Button>
          }
        />
      </VStack>
    </View>
  )
}
