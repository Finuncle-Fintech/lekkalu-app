import React, { FC } from 'react'
import { StyleSheet } from 'react-native'
import { wp } from '@/utils/responsive'
import { Button, Dialog, H3, Input, Label, View } from 'tamagui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IAddEditIncomeExpenseSchema, addEditIncomeExpenseSchema } from '@/schema/income-statement'

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
    <Dialog defaultOpen>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content style={{ width: wp(90) }}>
          <H3>Add Income</H3>
          <Label fontSize={'$5'}>Name</Label>
          <Input />
          <Label fontSize={'$5'}>Type</Label>
          <Input />
          <Label fontSize={'$5'}>Amount</Label>
          <Input />

          <View flexDirection="row" justifyContent="space-between" alignItems="center" mt="$6">
            <Button width={'45%'}>Cancel</Button>
            <Button width={'45%'}>Add</Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

export default AddEditExpenseIncomeModal

const styles = StyleSheet.create({})
