import { useQuery } from '@tanstack/react-query'
import { Button, FlatList, HStack, IconButton, Text, VStack } from 'native-base'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Link } from 'expo-router'
import moment from 'moment'
import { Avatar, AvatarImage, View, useTheme } from 'tamagui'
import Loading from '../loading'
import { FontSizes } from '@/utils/fonts'
import { wp } from '@/utils/responsive'
import { fetchLendingAccounts } from '@/queries/lending'
import { LENDING } from '@/utils/query-keys/lending'
import { describeTransaction } from '@/utils/lending'

export default function LendingList() {
  const theme = useTheme()

  const lendingAccountQuery = useQuery({
    queryFn: fetchLendingAccounts,
    queryKey: [LENDING.ACCOUNTS],
  })

  if (lendingAccountQuery.isLoading) {
    return <Loading title="Loading expenses..." />
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
                <Text color={theme.foreground.get()} fontSize={FontSizes.size18}>
                  {describeTransaction(item.balance)}
                </Text>
              </HStack>
            </HStack>
          </View>
          <Button.Group display={'flex'} alignItems={'center'}>
            <Link href={'/update-expense/23'} asChild>
              <IconButton
                size={wp(6)}
                _icon={{
                  as: AntDesign,
                  name: 'right',
                  size: 6,
                }}
              />
            </Link>
          </Button.Group>
        </VStack>
      )}
    />
  )
}
