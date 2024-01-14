import React, { FC } from 'react'
import { Button, Dialog, H3, Input, Label, Text, View } from 'tamagui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { hp, wp } from '@/utils/responsive'
import { IAddEditIncomeExpenseSchema, addEditIncomeExpenseSchema } from '@/schema/income-statement'
import { FontSizes } from '@/utils/fonts'

interface IAddEditExpenseIncomeModalProps {
  type: 'income' | 'expense'
}

const AddEditExpenseIncomeModal: FC<IAddEditExpenseIncomeModalProps> = () => {
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAddEditIncomeExpenseSchema>({
    resolver: zodResolver(addEditIncomeExpenseSchema),
  })

  return (
    <Dialog>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content style={{ width: wp(90) }}>
          <Text fontFamily={'$heading'} fontSize={FontSizes.size26}>
            Add Income
          </Text>
          <Label mt={hp(1)} fontSize={FontSizes.size18}>
            Name
          </Label>
          <Input fontSize={FontSizes.size16} />
          <Label mt={hp(1)} fontSize={FontSizes.size18}>
            Type
          </Label>
          <Input fontSize={FontSizes.size16} />
          <Label mt={hp(1)} fontSize={FontSizes.size18}>
            Amount
          </Label>
          <Input fontSize={FontSizes.size16} />

          <View flexDirection="row" justifyContent="space-between" alignItems="center" mt="$6">
            <Button h={hp(5.5)} w={'45%'} fontSize={FontSizes.size15}>
              Cancel
            </Button>
            <Button h={hp(5.5)} fontSize={FontSizes.size15} w={'45%'}>
              Add
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

export default AddEditExpenseIncomeModal
