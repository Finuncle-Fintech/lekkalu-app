import { cloneElement, useMemo, useState } from 'react'
import { Button, Modal, useToast } from 'native-base'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Text, useTheme } from 'tamagui'
import { useColorScheme } from 'react-native'
import { AssetCreateOrEditDto, editPhysicalAsset } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import InputFields from '../input-fields'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import { InputField } from '@/types/input-fields'
import { PAYMENT_METHODS, TRANSACTION_TYPES, calculateTransactionAmount } from '@/utils/lending'
import { LENDING } from '@/utils/query-keys/lending'
import { addLendingTransaction } from '@/queries/lending'
import { AddTransactionSchema } from '@/types/lending'
import { addTransactionSchema } from '@/schema/lending'

type CreateOrEditTransactionProps = {
  trigger: React.ReactElement<{ onPress: () => void }>
  transaction?: AddTransactionSchema
  lending_account: string
}

export default function CreateOrEditLendingAccount({
  lending_account,
  trigger,
  transaction,
}: CreateOrEditTransactionProps) {
  const [showModal, setShowModal] = useState(false)
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(transaction)
  const title = isEdit ? 'Edit Transaction' : 'Create Transaction'
  const theme = useTheme()
  const systemTheme = useColorScheme()
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm<AddTransactionSchema>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      type: (transaction?.amount as number) < 0 ? 'borrow' : 'lend',
      amount: Number(transaction?.amount),
      time: transaction?.time ? new Date(transaction.time) : new Date(),
      payment_method: transaction?.payment_method,
      reference_no: transaction?.reference_no,
      note: transaction?.note,
    },
  })
  const addLendingAccountMutation = useMutation({
    mutationFn: addLendingTransaction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LENDING.TRANSACTIONS] })
      qc.invalidateQueries({ queryKey: [LENDING.ACCOUNTS] })
      toast.show({ title: 'Transaction created successfully!' })
      setShowModal(false)
      reset()
    },
    onError: () => {
      reset()
      setShowModal(false)
      toast.show({ title: 'Failed to create transaction' })
    },
  })
  const editLendingAccountMutation = useMutation({
    mutationFn: (dto: AssetCreateOrEditDto) => editPhysicalAsset(transaction?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ASSETS] })
      toast.show({ title: 'Asset updated successfully!' })
      setShowModal(false)
    },
  })

  const handleAddOrEditTransaction = (values: AddTransactionSchema) => {
    const { type, ...rest } = getValues()
    const valuesToSubmit = {
      ...rest,
      lending_account,
      amount: calculateTransactionAmount(type, values.amount as number)?.toString(),
    }
    addLendingAccountMutation.mutate(valuesToSubmit)
  }

  const inputs = useMemo(
    () =>
      [
        {
          id: 'type',
          label: 'Select Type',
          type: 'select',
          options: TRANSACTION_TYPES,
        },
        {
          id: 'amount',
          label: 'Amount',
          type: 'number',
        },
        {
          id: 'time',
          label: 'Date',
          type: 'date',
          defaultDate: new Date(),
        },
        {
          id: 'payment_method',
          label: 'Payment Method',
          type: 'select',
          options: PAYMENT_METHODS,
        },
        {
          id: 'reference_no',
          label: 'Enter Reference No',
          type: 'text',
          helpText: 'Enter a reference number for this transaction if available.',
        },
        {
          id: 'note',
          label: 'Enter Note',
          type: 'text',
          helpText: 'Add any additional notes or details for this transaction.',
        },
      ] as InputField[],
    [],
  )
  const handleClose = () => {
    setShowModal(false)
    reset()
  }

  return (
    <>
      {cloneElement(trigger, {
        onPress: () => {
          setShowModal(true)
        },
      })}

      <Modal avoidKeyboard isOpen={showModal} onClose={handleClose} size="full">
        <Modal.Content height={'75%'} width={'94%'} bg={theme.background.get()}>
          <Modal.CloseButton _icon={{ size: wp(4) }} />
          <Modal.Header bg={theme.background.get()}>
            <Text fontFamily={'$heading'} fontSize={FontSizes.size20} color={theme.foreground.get()}>
              {title}
            </Text>
          </Modal.Header>

          <Modal.Body style={{ rowGap: hp(1) }}>
            <InputFields control={control} errors={errors} inputs={inputs} />
          </Modal.Body>

          <Modal.Footer bg={theme.background.get()}>
            <Button.Group space={2}>
              <Button
                _text={{
                  style: {
                    fontSize: FontSizes.size15,
                    color: systemTheme === 'dark' ? 'white' : THEME_COLORS.primary[600],
                  },
                }}
                height={hp(4.5)}
                px={wp(4)}
                variant="ghost"
                onPress={handleClose}
              >
                Cancel
              </Button>
              <Button
                _text={{ style: { fontSize: FontSizes.size15 } }}
                px={wp(4)}
                onPress={handleSubmit(handleAddOrEditTransaction)}
                isDisabled={addLendingAccountMutation.isPending || editLendingAccountMutation.isPending}
                isLoading={addLendingAccountMutation.isPending || editLendingAccountMutation.isPending}
              >
                {title}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
