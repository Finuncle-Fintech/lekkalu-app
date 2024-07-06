import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertDialog, Button, useToast } from 'native-base'
import { cloneElement, useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { router } from 'expo-router'
import { Text, useTheme } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
import { deleteLendingAccount, deleteLendingTransaction } from '@/queries/lending'
import { LENDING } from '@/utils/query-keys/lending'
import { Transaction } from '@/types/lending'
import { queryClient } from '@/utils/query-client'

type DeleteTransactionProps = {
  id: number
  trigger: React.ReactElement<{ onPress: () => void }>
  transactions: Transaction[]
  afterFn?: () => void
}

export default function DeleteTransaction({ id, transactions, trigger, afterFn }: DeleteTransactionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const cancelRef = useRef(null)
  const qc = useQueryClient()
  const theme = useTheme()
  const toast = useToast()
  const onClose = () => setIsOpen(false)

  const deleteLendingAccountMutation = useMutation({
    mutationFn: deleteLendingAccount,
    mutationKey: [LENDING.ACCOUNTS],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LENDING.ACCOUNTS] })
      router.push('/lending')
    },
  })

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteLendingTransaction,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [LENDING.TRANSACTIONS],
      })
      afterFn?.()
      setIsOpen(false)
      if (transactions.length === 1) {
        deleteLendingAccountMutation.mutate(transactions[0].lending_account)
      }
    },
    onError: (error) => {
      afterFn?.()
      setIsOpen(false)
      if (isAxiosError(error)) {
        toast.show({ title: error?.response?.data[0] || 'Failed to delete transaction' })
      } else {
        toast.show({ title: 'Failed to delete transaction' })
      }
    },
  })

  const handleDelete = () => {
    deleteTransactionMutation.mutate(id)
  }

  return (
    <>
      {cloneElement(trigger, {
        onPress: () => {
          setIsOpen(true)
        },
      })}

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />

          <AlertDialog.Header backgroundColor={theme.backgroundHover.get()}>
            <Text fontSize={FontSizes.size18} color={theme.foreground.get()} fontFamily={'$heading'}>
              Delete Transaction
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Body backgroundColor={theme.backgroundHover.get()}>
            <Text fontSize={FontSizes.size15} color={theme.foreground.get()} fontFamily={'$heading'}>
              Are you sure you want to delete this transaction ?
            </Text>
          </AlertDialog.Body>

          <AlertDialog.Footer backgroundColor={theme.backgroundHover.get()}>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
                isLoading={deleteTransactionMutation.isPending}
                color={theme.backgroundFocus.get()}
              >
                <Text fontSize={FontSizes.size18} color={theme.foreground.get()} fontFamily={'$heading'}>
                  Cancel
                </Text>
              </Button>
              <Button colorScheme="danger" onPress={handleDelete} isLoading={deleteTransactionMutation.isPending}>
                <Text fontSize={FontSizes.size18} color={'white'} fontFamily={'$heading'}>
                  Delete
                </Text>
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  )
}
