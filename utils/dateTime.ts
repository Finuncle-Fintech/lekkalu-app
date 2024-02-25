import dayjs from 'dayjs'
import { BarChartItem } from './goal'
import { THEME_COLORS } from './theme'

type dayUnit = 'day' | 'month' | 'week' | 'year'

type GoalReachedStringType = {
  hasReached: boolean
  unit: number
  unitName: dayUnit
  subUnit?: number
  subUnitName?: dayUnit
}

function isEndOfWeek(isoDate: string): boolean {
  const date = new Date(isoDate)
  return date.getDay() === 0
}

function isStartOfMonth(isoDate: string) {
  const _isoDate = isoDate.split('T')[0]
  const [year, month, day] = _isoDate.split('-').map(Number)
  const firstDatOfMonth = new Date(year, month, 1).getDate()
  return day === firstDatOfMonth
}

function isStartOfYear(isoDate: string) {
  const date = new Date(isoDate)
  return date.getMonth() === 0 && date.getDate() === 1
}

export function getplural(number: number, unit: string) {
  return number > 1 ? `${unit}s` : unit
}

export function goalReachedString({ hasReached, subUnit, subUnitName, unit, unitName }: GoalReachedStringType) {
  if (hasReached) {
    return `${unit} ${getplural(unit, unitName)}${
      subUnit && subUnitName ? ` and ${subUnit} ${getplural(subUnit, subUnitName)} ago.` : ' ago.'
    }`
  }
  return `${unit} ${getplural(unit, unitName)} ${
    subUnit && subUnitName ? `and ${subUnit} ${getplural(subUnit, subUnitName)}.` : '.'
  }`
}

export function convertDays(days: number) {
  const _days = Math.abs(days)
  const weeks = Math.floor(_days / 7)
  const remainingDaysInWeek = _days % 7

  const months = Math.floor(_days / 30)
  const remainingDaysInMonth = _days % 30

  const years = Math.floor(_days / 365)
  const remainingMonthsInYear = Math.floor((_days % 365) / 30)

  if (years) {
    return {
      hasReached: days < 0,
      unit: years,
      unitName: 'year' as dayUnit,
      subUnit: remainingMonthsInYear,
      subUnitName: 'month' as dayUnit,
    }
  } else if (months) {
    return {
      hasReached: days < 0,
      unit: months,
      unitName: 'month' as dayUnit,
      subUnit: remainingDaysInMonth,
      subUnitName: 'day' as dayUnit,
    }
  } else if (weeks) {
    return {
      hasReached: days < 0,
      unit: weeks,
      unitName: 'week' as dayUnit,
      subUnit: remainingDaysInWeek,
      subUnitName: 'day' as dayUnit,
    }
  } else {
    return {
      hasReached: days < 0,
      unit: days,
      unitName: 'day' as dayUnit,
    }
  }
}

function getNextISODate(currentISODate: string): string {
  const date = new Date(currentISODate)
  date.setDate(date.getDate() + 1)
  const nextISODate = date.toISOString().substring(0, 10)
  return nextISODate
}

export const getDataByWeek = (arr: Array<BarChartItem>) => {
  const result: Array<BarChartItem> = []
  const current = {
    totalDays: 0,
    aggValue: 0,
    date: arr[0].label,
  }

  arr.forEach((item: any, index: number) => {
    /** for first item and is not end of week.
    /*  for example: if first time of array is 8th january and 8th january is not the end of the week.
    */
    if (index === 0 && !isEndOfWeek(item.label)) {
      current.date = item.label
      result.push({
        label: `${dayjs(item?.label).get('date')}/${dayjs(item?.label).get('month') + 1}`,
        value: item.value,
        frontColor: THEME_COLORS.primary[200],
      })
    } else {
      current.aggValue += item.value
      current.totalDays += 1
    }

    // for the last item of the array.
    if (index + 1 === arr.length) {
      result.push({
        label: `${dayjs(item?.label).get('date')}/${dayjs(item?.label).get('month') + 1}`,
        value: +((current.aggValue + item.value) / (current.totalDays + 1)).toFixed(2),
        frontColor: THEME_COLORS.primary[200],
      })
      return
    }

    /**
     * for the date which is the end of the week.
     */
    if (isEndOfWeek(item.label)) {
      result.push({
        label: `${dayjs(current.date).get('date')}/${dayjs(current.date).get('month') + 1}`,
        value: +(current.aggValue / current.totalDays).toFixed(2),
        frontColor: THEME_COLORS.primary[200],
      })
      current.totalDays = 0
      current.aggValue = 0
    } else {
      current.aggValue += item.value
      current.totalDays += 1
    }

    current.date = getNextISODate(current.date)
  })
  return result
}

export const getDataByMonth = (arr: Array<BarChartItem>) => {
  const result: Array<BarChartItem> = []
  const current = {
    totalDays: 0,
    aggValue: 0,
    date: arr[0]?.label,
  }

  arr.forEach((item: any, index: number) => {
    // for the first item of the array which is not the start of the month
    if (index === 0 && !isStartOfMonth(item.label)) {
      current.date = item.label
      result.push({
        label: `${dayjs(item?.label).get('date')}/${dayjs(item?.label).get('month') + 1}`,
        value: item.value,
        frontColor: THEME_COLORS.primary[200],
      })
    } else {
      current.aggValue += item.value
      current.totalDays += 1
    }

    // for last day in the given array.
    if (index + 1 === arr.length) {
      result.push({
        // label: item.label,
        label: `${dayjs(item?.label).get('date')}/${dayjs(item?.label).get('month') + 1}`,
        value: +((current.aggValue + item.value) / (current.totalDays + 1)).toFixed(2),
        frontColor: THEME_COLORS.primary[200],
      })
      return
    }

    if (isStartOfMonth(item.label)) {
      result.push({
        // label: current.date,
        label: `${dayjs(current.date).get('date')}/${dayjs(current.date).get('month') + 1}`,
        value: +(current.aggValue / current.totalDays).toFixed(2),
        frontColor: THEME_COLORS.primary[200],
      })
      current.totalDays = 0
      current.aggValue = 0
    } else {
      current.aggValue += item.value
      current.totalDays += 1
    }
    current.date = getNextISODate(current.date)
  })
  return result
}

export const getDataByYear = (arr: Array<BarChartItem>) => {
  const result: Array<BarChartItem> = []
  const current = {
    totalDays: 0,
    aggValue: 0,
    date: arr[0].label,
  }

  arr.forEach((item: any, index: number) => {
    // for the first item of the array which is not the start of the month
    if (index === 0 && !isStartOfYear(item.label)) {
      current.date = item.label
      result.push({
        label: `${dayjs(item?.label).get('year')}`,
        value: item.value,
        frontColor: THEME_COLORS.primary[200],
      })
    } else {
      current.aggValue += item.value
      current.totalDays += 1
    }

    // for last day in the given array.
    if (index + 1 === arr.length) {
      result.push({
        label: `${dayjs(item?.label).get('year')}`,
        value: +((current.aggValue + item.value) / (current.totalDays + 1)).toFixed(2),
        frontColor: THEME_COLORS.primary[200],
      })
      return
    }

    if (isStartOfYear(item.label)) {
      result.push({
        label: `${dayjs(current?.date).get('year')}`,
        value: +(current.aggValue / current.totalDays).toFixed(2),
        frontColor: THEME_COLORS.primary[200],
      })
      current.totalDays = 0
      current.aggValue = 0
    } else {
      current.aggValue += item.value
      current.totalDays += 1
    }
    current.date = getNextISODate(current.date)
  })
  return result
}

export const getDataByDay = (arr: Array<BarChartItem>) => {
  return arr.map((item) => ({
    ...item,
    label: `${dayjs(item?.label).get('date')}/${dayjs(item?.label).get('month') + 1}`,
  }))
}
