import dayjs from 'dayjs'

type dayUnit = 'day' | 'month' | 'week' | 'year'

type BarChartItem = {
  time: string
  kpi_value: number
}

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

function isLastDayOfYear(isoDate: string) {
  const dateObj = new Date(isoDate)
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  const year = dateObj.getFullYear()
  if (month === 12) {
    if (day === 31) {
      return true
    } else if (day === 30) {
      const nextDay = new Date(year, month, day + 1)
      return nextDay.getMonth() === 0 && nextDay.getDate() === 1
    }
  }

  return false
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
  const result: any = []
  const current = {
    totalDays: 0,
    aggValue: 0,
    date: arr[0].time,
  }

  arr.forEach((item: BarChartItem, index: number) => {
    /** for first item and is not end of week.
    /*  for example: if first time of array is 8th january and 8th january is not the end of the week.
    */
    if (index === 0 && !isEndOfWeek(item.time)) {
      current.date = item.time
      result.push({
        label: dayjs(item?.time).format('YYYY-MM-DD'),
        value: item.kpi_value,
      })
    } else {
      current.aggValue += item.kpi_value
      current.totalDays += 1
    }

    // for the last item of the array.
    if (index + 1 === arr.length) {
      result.push({
        label: dayjs(item?.time).format('YYYY-MM-DD'),
        value: +((current.aggValue + item.kpi_value) / (current.totalDays + 1)).toFixed(2),
      })
      return
    }

    /**
     * for the date which is the end of the week.
     */
    if (isEndOfWeek(item.time)) {
      result.push({
        label: dayjs(current.date).format('YYYY-MM-DD'),
        value: +(current.aggValue / current.totalDays).toFixed(2),
      })
      current.totalDays = 0
      current.aggValue = 0
    } else {
      current.aggValue += item.kpi_value
      current.totalDays += 1
    }

    current.date = getNextISODate(current.date)
  })
  return result
}

export const getDataByMonth = (arr: Array<BarChartItem>) => {
  // const result: Array<BarChartItem> = []
  const result: any = []
  const current = {
    totalDays: 0,
    aggValue: 0,
    date: arr[0]?.time,
  }

  arr.forEach((item: BarChartItem, index: number) => {
    // for the first item of the array which is not the start of the month
    if (index === 0 && !isStartOfMonth(item.time)) {
      current.date = item.time
      result.push({
        label: dayjs(item?.time).format('YYYY-MM'),
        value: item.kpi_value,
      })
    } else {
      current.aggValue += item.kpi_value
      current.totalDays += 1
    }

    // for last day in the given array.
    if (index + 1 === arr.length) {
      result.push({
        label: dayjs(item?.time).format('YYYY-MM'),
        value: +((current.aggValue + item.kpi_value) / (current.totalDays + 1)).toFixed(2),
      })
      return
    }

    if (isStartOfMonth(item.time)) {
      result.push({
        label: dayjs(current.date).format('YYYY-MM'),
        value: +(current.aggValue / current.totalDays).toFixed(2),
      })
      current.totalDays = 0
      current.aggValue = 0
    } else {
      current.aggValue += item.kpi_value
      current.totalDays += 1
    }
    current.date = getNextISODate(current.date)
  })
  return result
}

export const getDataByYear = (arr: Array<BarChartItem>) => {
  const result: any = []
  const current = {
    totalDays: 1,
    agg_value: arr[0]?.kpi_value,
    date: arr[0]?.time,
  }
  arr.forEach(({ time, kpi_value }, index) => {
    if (isLastDayOfYear(time)) {
      result.push({ label: dayjs(time).format('YYYY'), value: +(current.agg_value / current.totalDays).toFixed(2) })
      current.totalDays = 0
      current.agg_value = 0
    } else {
      current.totalDays += 1
      current.agg_value += kpi_value
    }
    if (arr.length - 1 === index) {
      result.push({ label: dayjs(time).format('YYYY'), value: +(current.agg_value / current.totalDays).toFixed(2) })
    }
    current.date = getNextISODate(current.date)
  })
  return result
}

export const getDataByDay = (arr: Array<BarChartItem>) => {
  return arr.map((item) => ({
    ...item,
    label: dayjs(item.time).format('YYYY-MM-DD'),
  }))
}

export function getTimelineSpan(firstDay: string, lastDay: string) {
  const startDate: any = new Date(firstDay)
  const endDate: any = new Date(lastDay)

  const millisecondsDiff = endDate - startDate
  const secondsDiff = millisecondsDiff / 1000
  const minutesDiff = secondsDiff / 60
  const hoursDiff = minutesDiff / 60
  const daysDiff = hoursDiff / 24
  const weeksDiff = daysDiff / 7
  const monthsDiff = endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear())
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear()
  return {
    week: weeksDiff,
    month: monthsDiff,
    year: yearsDiff,
  }
}
