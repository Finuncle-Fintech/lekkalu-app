import React, { useEffect, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Text, View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import dayjs from 'dayjs'

import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import KeyboardScrollView from '@/components/keyboard-scroll-view'
import InputFields from '@/components/input-fields'
import { AddGoalSchemaType, addGoalSchema } from '@/schema/goal'
import { getAddGoalInputs } from '@/utils/goal'
import {
  AddGoalPayloadType,
  GoalItemType,
  useAddGoalMutation,
  useEditGoal,
  useGetGoalKpiData,
  useGetGoalSources,
  useGetProportionality,
} from '@/queries/goal'
import LoaderOverlay from '@/components/loader-overlay'
import { SERVER_DATE_FORMAT } from '@/utils/constants'

const AddGoal = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const { data: kpiQueryData } = useGetGoalKpiData()
  const { data: proportionalityQueryData } = useGetProportionality()
  const { data: sourcesQueryData } = useGetGoalSources()
  const { mutate: mutateAddGoal, isPending: isPendingAddGoal } = useAddGoalMutation()
  const params = useLocalSearchParams()

  const isEdit: boolean = !!params?.edit
  const editGoalDetails: GoalItemType = params?.goalDetails ? JSON.parse(params?.goalDetails as any) : null

  const { mutate: mutateEditGoal, isPending: isPendingEditGoal } = useEditGoal()
  const formDefaultValues = {
    targetDate: isEdit ? dayjs(editGoalDetails.target_date || new Date()).toDate() : new Date(),
    kpi: isEdit ? editGoalDetails.track_kpi : undefined,
    name: isEdit ? editGoalDetails.name : undefined,
    proportionality: isEdit ? editGoalDetails.goal_proportionality : undefined,
    source: isEdit ? String(editGoalDetails.target_contribution_source) : undefined,
    target: isEdit ? Number(editGoalDetails.target_value) : undefined,
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddGoalSchemaType>({
    resolver: zodResolver(addGoalSchema),
    defaultValues: formDefaultValues,
  })

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      reset()
    })
    return () => {
      unsubscribe()
    }
  }, [navigation, reset])

  const addGoalInputs = useMemo(
    () => getAddGoalInputs(kpiQueryData?.data, proportionalityQueryData?.data, sourcesQueryData?.data),
    [kpiQueryData, proportionalityQueryData, sourcesQueryData],
  )

  const handleAddGoal = (values: AddGoalSchemaType) => {
    try {
      const target_date_value = dayjs(values.targetDate).format(SERVER_DATE_FORMAT)
      const payload: AddGoalPayloadType = {
        name: values.name,
        target_value: values.target,
        target_contribution_source: +values.source,
        track_kpi: values.kpi,
        goal_proportionality: values.proportionality,
        target_date: target_date_value,
      }
      if (isEdit) {
        mutateEditGoal({ id: editGoalDetails.id, payload })
      } else {
        mutateAddGoal(payload)
      }
    } catch (error) {}
  }

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      {!!(isPendingAddGoal || isPendingEditGoal) && <LoaderOverlay />}
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/goals')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {isEdit ? 'Edit goal' : 'Create a new goal'}
        </Text>
      </View>
      <KeyboardScrollView contentContainerStyle={styles.scrollContent}>
        <InputFields control={control} errors={errors} inputs={addGoalInputs} />
        <Button
          fontSize={FontSizes.size18}
          h={hp(5.5)}
          onPress={handleSubmit(handleAddGoal)}
          bg="$primary"
          color="white"
          mt={hp(2)}
        >
          {isEdit ? 'Edit Goal' : 'Create Goal'}
        </Button>
      </KeyboardScrollView>
    </View>
  )
}

export default AddGoal

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp(5),
    marginTop: hp(2),
    rowGap: hp(1.5),
    paddingBottom: hp(5),
  },
})
