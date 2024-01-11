import { AddIcon, Button, FlatList, HStack, Heading, Text, VStack } from 'native-base'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from 'tamagui'
import CreateOrEditAsset from '@/components/create-or-edit-asset/create-or-edit-asset'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { fetchPhysicalAssets } from '@/queries/balance-sheet'

export default function BalanceSheet() {
  const { data, isFetching } = useQuery({ queryKey: [BALANCE_SHEET.ASSETS], queryFn: fetchPhysicalAssets })
  const theme = useTheme()

  return (
    <VStack flex={1} p={4} space={4} backgroundColor={theme.backgroundHover.get()}>
      <HStack justifyContent="end">
        <CreateOrEditAsset trigger={<Button startIcon={<AddIcon />}>Create Asset</Button>} />
      </HStack>

      <Heading color={theme.foreground.get()}>Your physical assets</Heading>

      <FlatList
        refreshing={isFetching}
        data={data}
        renderItem={({ item }) => (
          <VStack space={4} bg={theme.background.get()} rounded="md" p="4" shadow="sm" mb="4">
            <Heading color={theme.foreground.get()}>{item.name}</Heading>
            <HStack space={2} fontSize="xl">
              <Text color={theme.foreground.get()} fontSize="lg">
                Name :{' '}
              </Text>
              <Text color={theme.foreground.get()} fontSize="lg" fontWeight="bold">
                {item.name}
              </Text>
            </HStack>
            <HStack space={2} fontSize="xl">
              <Text color={theme.foreground.get()} fontSize="lg">
                Current Value :{' '}
              </Text>
              <Text color={theme.foreground.get()} fontSize="lg" fontWeight="bold">
                {item.market_value}
              </Text>
            </HStack>
            <HStack space={2} fontSize="xl">
              <Text color={theme.foreground.get()} fontSize="lg">
                Purchase Value :{' '}
              </Text>
              <Text color={theme.foreground.get()} fontSize="lg" fontWeight="bold">
                {item.purchase_value}
              </Text>
            </HStack>
            <HStack space={2} fontSize="xl">
              <Text color={theme.foreground.get()} fontSize="lg">
                Sell Value :{' '}
              </Text>
              <Text color={theme.foreground.get()} fontSize="lg" fontWeight="bold">
                {item.sell_value}
              </Text>
            </HStack>
          </VStack>
        )}
      />
    </VStack>
  )
}
