import { AddIcon, Button, HStack, VStack } from 'native-base'
import CreateOrEditAsset from '@/components/create-or-edit-asset/create-or-edit-asset'

export default function BalanceSheet() {
  return (
    <VStack flex={1} p={4} space="10">
      <HStack justifyContent="end">
        <CreateOrEditAsset trigger={<Button startIcon={<AddIcon />}>Create Asset</Button>} />
      </HStack>
    </VStack>
  )
}
