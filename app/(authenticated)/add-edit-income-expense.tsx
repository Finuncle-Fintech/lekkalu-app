import React, { useEffect } from 'react'
import { Button, Text, View } from 'tamagui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'

import { hp, wp } from '@/utils/responsive'
import { IAddEditIncomeExpenseSchema, addEditIncomeExpenseSchema } from '@/schema/income-statement'
import { FontSizes } from '@/utils/fonts'
import BackButton from '../../components/back-button'
import KeyboardScrollView from '../../components/keyboard-scroll-view'
import InputFields from '../../components/input-fields'
import { getAddIncomeExpenseInputs } from '@/utils/income-statement'
import LoaderOverlay from '../../components/loader-overlay'

const AddEditIncomeExpense = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const params = useLocalSearchParams()
  console.log('🚀 ~ AddEditIncomeExpense ~ params:', params)

  const isIncome = params?.type === 'income'
  const editItem = params?.editItem
  const pageTitle = isIncome ? `${editItem ? 'Edit' : 'Add'} Income` : `${editItem ? 'Edit' : 'Add'} Expense`

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAddEditIncomeExpenseSchema>({
    resolver: zodResolver(addEditIncomeExpenseSchema),
  })

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      reset()
    })
    return () => {
      unsubscribe()
    }
  }, [navigation, reset])

  const handleAddIncomeExpense = () => {}

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      {!!false && <LoaderOverlay />}
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/income-statement')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {pageTitle}
        </Text>
      </View>
      <KeyboardScrollView style={{ paddingHorizontal: wp(5), marginTop: hp(3) }}>
        <View rowGap={hp(1)}>
          <InputFields control={control} errors={errors} inputs={getAddIncomeExpenseInputs()} />
        </View>
        <Button
          fontSize={FontSizes.size18}
          h={hp(5.5)}
          onPress={handleSubmit(handleAddIncomeExpense)}
          bg="$primary"
          color="white"
          mt={hp(4)}
        >
          {pageTitle}
        </Button>
      </KeyboardScrollView>
    </View>
  )
}

export default AddEditIncomeExpense
