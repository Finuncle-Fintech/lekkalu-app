import React, { useEffect, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Text, View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { router, useNavigation } from 'expo-router'

import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import KeyboardScrollView from '@/components/keyboard-scroll-view'
import InputFields from '@/components/input-fields'
import { AddGoalSchemaType, addGoalSchema } from '@/schema/goal'
import { getAddGoalInputs } from '@/utils/goal'
import {
  AddGoalPayloadType,
  useAddGoalMutation,
  useGetGoalKpiData,
  useGetGoalSources,
  useGetProportionality,
} from '@/queries/goal'
import LoaderOverlay from '@/components/loader-overlay'

const AddGoal = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const { data: kpiQueryData } = useGetGoalKpiData()
  const { data: proportionalityQueryData } = useGetProportionality()
  const { data: sourcesQueryData } = useGetGoalSources()
  const { mutate, isPending } = useAddGoalMutation()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddGoalSchemaType>({
    resolver: zodResolver(addGoalSchema),
    defaultValues: {
      completionDate: new Date(),
      kpi: '',
      name: '',
      proportionality: undefined,
      source: undefined,
      target: undefined,
    },
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
      const payload: AddGoalPayloadType = {
        name: values.name,
        target_value: values.target,
        target_contribution_source: +values.source,
        track_kpi: values.kpi,
        goal_proportionality: values.proportionality,
        target_date: values.completionDate.toISOString(),
      }
      mutate(payload)
    } catch (error) {}
  }

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      {!!isPending && <LoaderOverlay />}
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/goals')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          Create a new goal
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
          Create Goal
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
