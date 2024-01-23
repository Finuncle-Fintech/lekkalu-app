import dayjs from 'dayjs'
import { InputField } from '@/types/input-fields'

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

const getAddGoalInputs = (
  kpiData?: OptionItem[],
  proportionalityData?: OptionItem[],
  sourcesData?: ISourcesItem[],
): InputField[] => {
  const transformedSources = sourcesData
    ? sourcesData?.map((item) => ({ id: item.id?.toString(), label: item.name }))
    : []

  const dummyProportionality = [
    { id: 1, label: 'HigherTheBetter' },
    { id: 2, label: 'LowerTheBetter' },
  ]

  const dummyKPI = [{ id: 1, label: 'LiabilityPercent' }]

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
      options: dummyKPI || [], // ! replace dummyKPI with kpiData once api is fixed
      valueKey: 'label',
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
      options: dummyProportionality || [], // ! replace dummyProportionality with proportionalityData once api is fixed
      valueKey: 'label',
    },
    {
      id: 'completionDate',
      label: 'Completion Date',
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

export { getAddGoalInputs, getGoalTimelineData }
