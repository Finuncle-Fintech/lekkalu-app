import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FlatList, HStack, Text, VStack, useToast } from 'native-base'
import { Link, router } from 'expo-router'
import { Alert } from 'react-native'
import moment from 'moment'
import { Avatar, AvatarImage, View, useTheme } from 'tamagui'
import Loading from '../loading'
import { FontSizes } from '@/utils/fonts'
import { wp } from '@/utils/responsive'
import { deleteLendingAccount, fetchLendingAccounts } from '@/queries/lending'
import { LENDING } from '@/utils/query-keys/lending'
import { describeTransaction } from '@/utils/lending'
import EditDeleteMenu from '../edit-delete-menu'
import { ErrorMessage, Success } from '@/utils/toast'

export default function LendingList() {
  const theme = useTheme()
  const qc = useQueryClient()
  const toast = useToast()

  const lendingAccountQuery = useQuery({
    queryFn: fetchLendingAccounts,
    queryKey: [LENDING.ACCOUNTS],
  })

  const deleteAccountMutation = useMutation({
    mutationFn: deleteLendingAccount,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [LENDING.ACCOUNTS],
      })
      toast.show({ render: () => Success('Account deleted successfully') })
    },
    onError: () => {
      toast.show({ render: () => ErrorMessage('Failed to delete account') })
    },
  })

  if (lendingAccountQuery.isLoading) {
    return <Loading title="Loading accounts..." />
  }

  if ((lendingAccountQuery.data ?? []).length === 0) {
    return (
      <Text color={theme.foreground.get()} fontSize={FontSizes.size18} fontWeight="600">
        No lending accounts found
      </Text>
    )
  }

  const deleteItemHandler = async (id: number) => {
    Alert.alert('Delete', 'Are you sure you want to delete ?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          deleteAccountMutation.mutate(id)
        },
      },
    ])
  }

  return (
    <FlatList
      refreshing={lendingAccountQuery.isLoading || lendingAccountQuery.isLoading}
      keyExtractor={(item) => item.id.toString()}
      data={lendingAccountQuery.data ?? []}
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
          <Link href={`/lending-account/${item.id}`} asChild>
            <View flex={1} mr={wp(3)}>
              <HStack alignItems="center" space={2}>
                <Avatar circular size="$6">
                  {/* @ts-ignore */}
                  <AvatarImage src="https://github.com/GVR-Secure-Solutions/lekkalu-frontend/assets/87645745/2e28155a-f7cc-4487-a3f9-c6bb48b426d5" />
                  <Avatar.Fallback bc="$background" />
                </Avatar>
                <HStack flexDir={'column'} space={2}>
                  <HStack space={1} alignItems="baseline">
                    <Text color={theme.foreground.get()} fontSize={FontSizes.size18} fontWeight="600">
                      {item.name} •
                    </Text>
                    <Text color={theme.gray10.get()} fontSize={FontSizes.size16} fontWeight="500">
                      {moment(item.started).fromNow()}
                    </Text>
                  </HStack>
                  {item.user_remark && (
                    <Text maxWidth={wp(48)} color={theme.foreground.get()} fontSize={FontSizes.size15}>
                      {item.user_remark.length > 55 ? item.user_remark.substring(0, 55) + '...' : item.user_remark}
                    </Text>
                  )}
                  <Text color={theme.foreground.get()} fontSize={FontSizes.size18}>
                    {describeTransaction(item.balance)}
                  </Text>
                </HStack>
              </HStack>
            </View>
          </Link>
          <HStack alignItems="center" space={1}>
            <EditDeleteMenu
              onEdit={() => {
                router.push(`/update-lending-account/${item.id}`)
              }}
              onDelete={() => {
                deleteItemHandler(item.id)
              }}
            />
          </HStack>
        </VStack>
      )}
    />
  )
}
