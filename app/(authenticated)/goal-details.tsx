import React, { FC, useEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Separator, Spinner, Text, View } from 'tamagui'
import { BarChart } from 'react-native-gifted-charts'
import { router, useLocalSearchParams } from 'expo-router'
import dayjs from 'dayjs'

import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import Card from '@/components/card'
import { THEME_COLORS } from '@/utils/theme'
import DatePicker from '@/components/date-picker'
import { useGetGoalDetails, useGetGoalSources, useGetGoalTimeline } from '@/queries/goal'
import { getGoalTimelineData } from '@/utils/goal'
import { convertDays, goalReachedString } from '@/utils/dateTime'

interface IKeyValueTextProps {
  title: string
  value: string
}

const KeyValueText: FC<IKeyValueTextProps> = ({ title = '', value = '' }) => {
  return (
    <Text fontSize={FontSizes.size16}>
      {' '}
      <Text fontSize={FontSizes.size18} fontFamily={'$body'} fontWeight={'bold'}>
        {title}:
      </Text>{' '}
      {value}
    </Text>
  )
}

const GoalDetails = () => {
  const insets = useSafeAreaInsets()

  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)

  const [timelineSpan, setTimelineSpan] = useState({
    firstGoalDay: dayjs().toDate(),
    lastGoalDay: dayjs().toDate(),
  })

  const params = useLocalSearchParams()

  const { data: goalDetailsQueryData } = useGetGoalDetails(+params?.id)
  const {
    data: goalTimelineQueryData,
    error: timelineError,
    isLoading: isLoadingTimelineData,
  } = useGetGoalTimeline(+params?.id)

  const { data: sourcesQueryData } = useGetGoalSources()

  const goalData = goalDetailsQueryData?.data || null

  const SOURCE = useMemo(() => {
    return sourcesQueryData?.data?.find((each) => each?.id === goalData?.target_contribution_source)
  }, [sourcesQueryData?.data, goalData])

  const barData = useMemo(() => {
    if (fromDate && toDate && goalTimelineQueryData?.data) {
      return getGoalTimelineData(goalTimelineQueryData?.data, fromDate, toDate)
    } else {
      return []
    }
  }, [fromDate, goalTimelineQueryData, toDate])

  useEffect(() => {
    if (!isLoadingTimelineData) {
      const firstGoalDay = dayjs(goalTimelineQueryData?.data[0]?.time).toDate()
      const lastGoalDay = dayjs(goalTimelineQueryData?.data[goalTimelineQueryData?.data.length - 1].time).toDate()

      setFromDate(firstGoalDay)
      setToDate(lastGoalDay)
      setTimelineSpan({
        firstGoalDay,
        lastGoalDay,
      })
    }
  }, [goalTimelineQueryData, isLoadingTimelineData])

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/goals')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {goalData?.name}
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: hp(2) }}>
        <Card mt={hp(3)}>
          <Text fontSize={FontSizes.size20} fontWeight={'bold'}>
            Details
          </Text>
          <Separator my={hp(1.5)} borderColor={THEME_COLORS.gray[200]} />
          <View rowGap={hp(2)}>
            <KeyValueText title="Target" value={String(goalData?.target_value)} />
            <KeyValueText title="Source" value={String(SOURCE?.name)} />
            <KeyValueText title="KPI" value={String(goalData?.track_kpi)} />
            <KeyValueText
              title={Number(goalData?.reachable_by_days) < 0 ? 'Reached' : 'Reachable by'}
              value={goalReachedString(convertDays(goalData?.reachable_by_days || 0))}
            />
            <KeyValueText title="Proportionality" value={String(goalData?.goal_proportionality)} />
          </View>
        </Card>
        <Card mt={hp(3)}>
          <Text fontSize={FontSizes.size20} fontWeight={'bold'}>
            Timeline
          </Text>
          <Separator my={hp(1.5)} borderColor={THEME_COLORS.gray[200]} />

          {isLoadingTimelineData && (
            <View f={1} py={hp(2)} ai="center">
              <Spinner size="large" color={THEME_COLORS.primary[100]} />
              <Text mt={hp(1.5)} fontFamily={'$heading'} fontSize={FontSizes.size18}>
                Loading Timeline...
              </Text>
            </View>
          )}

          {!!timelineError && (
            <View f={1} py={hp(2)} ai="center">
              <Text fontFamily={'$heading'} fontSize={FontSizes.size18}>
                Failed to load timeline data
              </Text>
            </View>
          )}

          {!!barData.length && !timelineError && (
            <>
              <View fd="row" ai="center" columnGap={wp(6)} mb={hp(2)}>
                <View rowGap={hp(1)} f={1}>
                  <Text fontSize={FontSizes.size16} fontWeight={'bold'}>
                    From :-
                  </Text>
                  <DatePicker
                    key={fromDate?.toISOString()}
                    value={fromDate}
                    onChange={setFromDate}
                    minimumDate={timelineSpan?.firstGoalDay}
                    maximumDate={timelineSpan?.lastGoalDay}
                  />
                </View>
                <View rowGap={hp(1)} f={1}>
                  <Text fontSize={FontSizes.size16} fontWeight={'bold'}>
                    To :-
                  </Text>
                  <DatePicker
                    key={toDate?.toISOString()}
                    value={toDate}
                    onChange={setToDate}
                    minimumDate={timelineSpan?.firstGoalDay}
                    maximumDate={timelineSpan?.lastGoalDay}
                  />
                </View>
              </View>
              <BarChart
                barWidth={22}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={barData}
                yAxisThickness={0}
                xAxisThickness={0}
              />
            </>
          )}
        </Card>
      </ScrollView>
    </View>
  )
}

export default GoalDetails
