import { EvilIcons } from '@expo/vector-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertDialog, Button, IconButton } from 'native-base'
import { useRef, useState } from 'react'
import { Text, useTheme } from 'tamagui'
import { deleteExpense } from '@/queries/expense'
import { EXPENSES } from '@/utils/query-keys'

type DeleteExpenseProps = {
  id: number
}

export default function DeleteExpense({ id }: DeleteExpenseProps) {
  const [isOpen, setIsOpen] = useState(false)
  const cancelRef = useRef(null)
  const qc = useQueryClient()
  const theme = useTheme()

  const onClose = () => setIsOpen(false)

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [EXPENSES.EXPENSES],
      })
      setIsOpen(false)
    },
  })

  const handleDelete = () => {
    deleteExpenseMutation.mutate(id)
  }

  return (
    <>
      <IconButton
        size={10}
        variant="solid"
        colorScheme="danger"
        _icon={{
          as: EvilIcons,
          name: 'trash',
          size: 7,
        }}
        onPress={() => {
          setIsOpen(true)
        }}
      />

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />

          <AlertDialog.Header backgroundColor={theme.backgroundHover.get()}>
            <Text fontSize={'$5'} color={'$foreground'} fontFamily={'$heading'}>
              Delete Expense
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Body backgroundColor={theme.backgroundHover.get()}>
            <Text color={'$foreground'} fontFamily={'$heading'}>
              Are you sure you want to delete this expense ?
            </Text>
          </AlertDialog.Body>

          <AlertDialog.Footer backgroundColor={theme.backgroundHover.get()}>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
                isLoading={deleteExpenseMutation.isPending}
                color={theme.backgroundFocus.get()}
              >
                <Text fontSize={'$5'} color={'$foreground'} fontFamily={'$heading'}>
                  Cancel
                </Text>
              </Button>
              <Button colorScheme="danger" onPress={handleDelete} isLoading={deleteExpenseMutation.isPending}>
                <Text fontSize={'$5'} color={'white'} fontFamily={'$heading'}>
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
