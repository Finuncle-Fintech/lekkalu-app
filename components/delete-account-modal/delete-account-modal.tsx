import React from 'react'
import { Icon, Button as NBButton } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'
import { AlertDialog, Button, XStack, YStack } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import CustomAlertDialog from '../custom-alert-dialog'
import { useAuthContext } from '@/hooks/use-auth'

const DeleteAccountModal = () => {
  const { deleteAccountMutation } = useAuthContext()

  const isLoading = deleteAccountMutation.isPending

  const modalTrigger = (
    <NBButton
      height={hp(5)}
      _text={{ fontSize: FontSizes.size15, color: 'red.500' }}
      endIcon={<Icon as={MaterialIcons} name="delete" size={wp(4)} color="red.500" />}
      mb={8}
      variant="outline"
      borderColor={'red.500'}
    >
      Delete Account
    </NBButton>
  )

  return (
    <CustomAlertDialog trigger={modalTrigger}>
      <YStack space>
        <AlertDialog.Title fontSize={FontSizes.size24}>Are you sure ?</AlertDialog.Title>
        <AlertDialog.Description fontSize={FontSizes.size18} lineHeight={hp(2.5)}>
          Do you really want to delete your account? This process cannot be undone.
        </AlertDialog.Description>
        <XStack space="$3" justifyContent="flex-end">
          <AlertDialog.Cancel asChild>
            <Button disabled={isLoading} variant="outlined" h={hp(5)} fontSize={FontSizes.size16}>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button
              color="white"
              onPress={() => deleteAccountMutation.mutate()}
              bg="$red10Light"
              h={hp(5)}
              fontSize={FontSizes.size16}
              theme="active"
              disabled={isLoading}
            >
              Delete Account
            </Button>
          </AlertDialog.Action>
        </XStack>
      </YStack>
    </CustomAlertDialog>
  )
}

export default DeleteAccountModal
