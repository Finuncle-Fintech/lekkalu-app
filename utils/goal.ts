import dayjs from 'dayjs'
import round from 'lodash/round'
import { InputField } from '@/types/input-fields'
import { THEME_COLORS } from './theme'
import { GoalItemType } from '@/queries/goal'

interface OptionItem {
  id: number
  label: string
}

interface ISourcesItem {
  id: number
  name: string
  type: string
  amount: string
}

interface TimelineItem {
  time: string
  kpi_value: number
}

interface BarChartItem {
  value: number
  label: string
  frontColor: string
}

interface GoalsProgressDataType {
  onTrackGoals: number
  offTrackGoals: number
  completedGoals: number
}

const getAddGoalInputs = (
  kpiData?: OptionItem[],
  proportionalityData?: OptionItem[],
  sourcesData?: ISourcesItem[],
): InputField[] => {
  const transformedSources = sourcesData
    ? sourcesData?.map((item) => ({ id: item.id?.toString(), label: item.name }))
    : []

  return [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      id: 'target',
      label: 'Target',
      type: 'number',
    },
    {
      id: 'kpi',
      label: 'KPI',
      type: 'select',
      options: kpiData || [],
      valueKey: 'value',
    },
    {
      id: 'source',
      label: 'Source',
      type: 'select',
      options: transformedSources || [],
    },
    {
      id: 'proportionality',
      label: 'Proportionality',
      type: 'select',
      options: proportionalityData || [],
      valueKey: 'value',
    },
    {
      id: 'targetDate',
      label: 'Target Date',
      type: 'date',
    },
  ]
}

const getGoalTimelineData = (timelineData?: TimelineItem[], fromDate?: Date, toDate?: Date): BarChartItem[] => {
  if (!timelineData || !timelineData?.length) {
    return []
  }

  const newTimelineData: BarChartItem[] = timelineData
    .filter((tItem) => {
      const isValidForFromDate = dayjs(tItem.time).isAfter(fromDate) || dayjs(tItem.time).isSame(fromDate, 'date')
      const isValidForToDate = dayjs(tItem.time).isBefore(toDate) || dayjs(tItem.time).isBefore(toDate, 'date')

      return isValidForFromDate && isValidForToDate
    })
    .map((tItem) => ({
      value: tItem.kpi_value,
      label: `${dayjs(tItem.time).get('date')}/${dayjs(tItem.time).get('month') + 1}`,
      frontColor: '#177AD5',
    }))

  return newTimelineData
}

const getGoalsProgressChartData = (progressData: GoalsProgressDataType) => {
  return [
    {
      title: 'On Track',
      value: progressData.onTrackGoals,
      color: THEME_COLORS.green['500'],
    },
    {
      title: 'Off Track',
      value: progressData.offTrackGoals,
      color: THEME_COLORS.red['500'],
    },
    {
      title: 'Completed',
      value: progressData.completedGoals,
      color: THEME_COLORS.indigo['500'],
    },
  ]
}

const getGoalProgressData = (goals: GoalItemType[]): GoalsProgressDataType => {
  const totalGoals = goals.length

  let onTrackGoals = 0
  let offTrackGoals = 0
  let completedGoals = 0

  goals.forEach((goalItem) => {
    const goalCompletionDate = dayjs(goalItem.target_date)
    if (dayjs().isBefore(goalCompletionDate) || dayjs().isSame(goalCompletionDate)) {
      onTrackGoals++
    } else if (dayjs().isAfter(goalCompletionDate)) {
      offTrackGoals++
    }
    if (goalItem.met) {
      completedGoals++
    }
  })

  onTrackGoals = round((onTrackGoals / totalGoals) * 100)
  offTrackGoals = round((offTrackGoals / totalGoals) * 100)
  completedGoals = 100 - onTrackGoals - offTrackGoals

  return {
    onTrackGoals: isNaN(onTrackGoals) ? 0 : onTrackGoals,
    offTrackGoals: isNaN(offTrackGoals) ? 0 : offTrackGoals,
    completedGoals: isNaN(completedGoals) ? 0 : completedGoals,
  }
}

export { getAddGoalInputs, getGoalTimelineData, getGoalsProgressChartData, getGoalProgressData }
