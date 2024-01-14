import { AddIcon, Button, FlatList, HStack, Heading, VStack } from 'native-base'
import { useQuery } from '@tanstack/react-query'
import { Text, useTheme } from 'tamagui'
import CreateOrEditAsset from '@/components/create-or-edit-asset/create-or-edit-asset'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { fetchPhysicalAssets } from '@/queries/balance-sheet'
import { wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'

export default function BalanceSheet() {
  const { data, isFetching } = useQuery({ queryKey: [BALANCE_SHEET.ASSETS], queryFn: fetchPhysicalAssets })
  const theme = useTheme()

  return (
    <VStack flex={1} p={4} space={4} backgroundColor={theme.backgroundHover.get()}>
      <HStack justifyContent="end">
        <CreateOrEditAsset
          trigger={
            <Button
              _text={{ style: { fontSize: FontSizes.size16, padding: wp(1) } }}
              startIcon={<AddIcon size={wp(4)} />}
            >
              Create Asset
            </Button>
          }
        />
      </HStack>

      <Heading fontSize={FontSizes.size26} color={theme.foreground.get()}>
        Your physical assets
      </Heading>

      <FlatList
        refreshing={isFetching}
        data={data}
        renderItem={({ item }) => (
          <VStack space={5} bg={theme.background.get()} rounded="md" p="4" shadow="sm" mb="4">
            <Heading color={theme.foreground.get()}>{item.name}</Heading>
            <HStack space={2} fontSize="xl">
              <Text color={'$foreground'} fontSize={FontSizes.size20}>
                Name :{' '}
              </Text>
              <Text color={'$foreground'} fontSize={FontSizes.size20} fontWeight="bold">
                {item.name}
              </Text>
            </HStack>
            <HStack space={2} fontSize="xl">
              <Text color={'$foreground'} fontSize={FontSizes.size20}>
                Current Value :{' '}
              </Text>
              <Text color={'$foreground'} fontSize={FontSizes.size20} fontWeight="bold">
                {item.market_value}
              </Text>
            </HStack>
            <HStack space={2} fontSize="xl">
              <Text color={'$foreground'} fontSize={FontSizes.size20}>
                Purchase Value :{' '}
              </Text>
              <Text color={'$foreground'} fontSize={FontSizes.size20} fontWeight="bold">
                {item.purchase_value}
              </Text>
            </HStack>
            <HStack space={2} fontSize="xl">
              <Text color={'$foreground'} fontSize={FontSizes.size20}>
                Sell Value :{' '}
              </Text>
              <Text color={'$foreground'} fontSize={FontSizes.size20} fontWeight="bold">
                {item.sell_value}
              </Text>
            </HStack>
          </VStack>
        )}
      />
    </VStack>
  )
}
