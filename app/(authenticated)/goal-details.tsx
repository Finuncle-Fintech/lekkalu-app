import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Separator, Spinner, Text, View } from 'tamagui'
import { LineChart as LC } from 'echarts/charts'
import { router, useLocalSearchParams } from 'expo-router'
import { SVGRenderer } from '@wuba/react-native-echarts'
import dayjs from 'dayjs'
import * as echarts from 'echarts/core'
import {
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'

import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import Card from '@/components/card'
import { THEME_COLORS } from '@/utils/theme'
import DatePicker from '@/components/date-picker'
import { useGetGoalDetails, useGetGoalSources, useGetGoalTimeline } from '@/queries/goal'
import {
  convertDays,
  getDataByMonth,
  getDataByWeek,
  getDataByYear,
  getTimelineSpan,
  goalReachedString,
} from '@/utils/dateTime'
import LineChart from '@/components/LineChart'

echarts.use([SVGRenderer, LegendComponent, LC, GridComponent, ToolboxComponent, DataZoomComponent, TooltipComponent])

interface IKeyValueTextProps {
  title: string
  value: string
}

type ChartViewBy = 'day' | 'week' | 'month' | 'year'

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
  const [viewChartBy, setViewChartBy] = useState<ChartViewBy | undefined>(undefined)

  const [timelineSpan, setTimelineSpan] = useState({
    firstGoalDay: dayjs().toDate(),
    lastGoalDay: dayjs().toDate(),
  })

  const params = useLocalSearchParams()

  const { data: goalDetailsQueryData, isLoading: isLoadingGoalData } = useGetGoalDetails(+params?.id)
  const {
    data: goalTimelineQueryData,
    error: timelineError,
    isLoading: isLoadingTimelineData,
  } = useGetGoalTimeline(+params?.id)

  const { data: sourcesQueryData } = useGetGoalSources()

  const goalData = goalDetailsQueryData?.data || null

  const skiaRef = useRef<any>(null)

  const SOURCE = useMemo(() => {
    return sourcesQueryData?.data?.find((each) => each?.id === goalData?.target_contribution_source)
  }, [sourcesQueryData?.data, goalData])

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
      const span = getTimelineSpan(firstGoalDay.toISOString(), lastGoalDay.toISOString())
      if (span.year >= 3) {
        setViewChartBy('year')
      } else if (span.month >= 3) {
        setViewChartBy('month')
      } else {
        setViewChartBy('week')
      }
    }
  }, [goalTimelineQueryData, isLoadingTimelineData])

  const barData = useMemo(() => {
    if (goalTimelineQueryData?.data) {
      const _barData = goalTimelineQueryData?.data
      switch (viewChartBy) {
        case 'month':
          return getDataByMonth(_barData)
        case 'week':
          return getDataByWeek(_barData)
        case 'year':
          return getDataByYear(_barData)
        default:
          return getDataByWeek(_barData)
      }
    }
    return []
  }, [goalTimelineQueryData, viewChartBy])

  const changeViewChartBy = (type: ChartViewBy) => {
    setViewChartBy(type)
  }

  useEffect(() => {
    let chart: any
    if (barData.length) {
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: barData.map((each: any) => each?.label),
          axisLabel: {
            hideOverlap: true,
            showMinLabel: true,
            showMaxLabel: true,
          },
        },
        grid: {
          containLabel: true,
        },
        yAxis: {
          type: 'value',
        },
        animationDurationUpdate: 0,
        series: [
          {
            name: 'KPI',
            type: 'line',
            data: barData,
            smooth: true,
          },
          {
            name: 'Target',
            data: barData.map(() => goalDetailsQueryData?.data?.target_value),
            type: 'line',
            color: '#d63031',
            symbol: 'none',
            smooth: true,
          },
        ],
      }
      if (skiaRef.current) {
        chart = echarts.init(skiaRef.current, 'dark', {
          renderer: 'svg',
          width: 350,
          height: 350,
        })
      }
      chart?.setOption(option)
    }
    return () => {
      chart?.dispose()
    }
  }, [barData, goalDetailsQueryData?.data?.target_value])

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/goals')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {goalData?.name}
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: hp(2) }}>
        {isLoadingGoalData ? (
          <Card mt={hp(3)}>
            <View f={1} py={hp(2)} ai="center">
              <Spinner size="large" color={THEME_COLORS.primary[100]} />
              <Text mt={hp(1.5)} fontFamily={'$heading'} fontSize={FontSizes.size18}>
                Loading Goal Detail...
              </Text>
            </View>
          </Card>
        ) : (
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
        )}

        <Card mt={hp(3)}>
          <View display="flex" flexDirection="row" justifyContent="space-between">
            <View alignSelf="center">
              <Text fontSize={FontSizes.size20} fontWeight={'bold'}>
                Timeline
              </Text>
            </View>
          </View>
          <Separator my={hp(1.5)} borderColor={THEME_COLORS.gray[200]} />

          {!!timelineError && (
            <View f={1} py={hp(2)} ai="center">
              <Text fontFamily={'$heading'} fontSize={FontSizes.size18}>
                Failed to load timeline data
              </Text>
            </View>
          )}

          {!!barData.length && !timelineError ? (
            <>
              <View fd="row" ai="center" columnGap={wp(6)} mb={hp(2)} display="none">
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
              <View display="flex" flexDirection="row" mb={10}>
                <TouchableOpacity
                  style={StyleSheet.compose(
                    { ...styles.span, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },
                    viewChartBy === 'week' ? styles.activeSpanButton : {},
                  )}
                  onPress={() => changeViewChartBy('week')}
                >
                  <Text color={'white'}>Weeks</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={StyleSheet.compose(styles.span, viewChartBy === 'month' ? styles.activeSpanButton : {})}
                  onPress={() => changeViewChartBy('month')}
                >
                  <Text color={'white'}>Months</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={StyleSheet.compose(
                    { ...styles.span, borderTopRightRadius: 5, borderBottomRightRadius: 5 },
                    viewChartBy === 'year' ? styles.activeSpanButton : {},
                  )}
                  onPress={() => changeViewChartBy('year')}
                >
                  <Text color={'white'}>Years</Text>
                </TouchableOpacity>
              </View>
              <View>
                <LineChart ref={skiaRef} />
              </View>
            </>
          ) : (
            <View f={1} py={hp(2)} ai="center">
              <Spinner size="large" color={THEME_COLORS.primary[100]} />
              <Text mt={hp(1.5)} fontFamily={'$heading'} fontSize={FontSizes.size18}>
                {isLoadingTimelineData ? 'Loading...' : 'Preparing data...'}
              </Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  span: {
    padding: 10,
    backgroundColor: THEME_COLORS.primary[400],
    margin: 0,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  activeSpanButton: {
    backgroundColor: THEME_COLORS.primary[100],
  },
})

export default GoalDetails
