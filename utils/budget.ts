import dayjs from 'dayjs'

export const BUDGET_MONTH_OPTIONS = Array.from({ length: 12 }).map((_, idx) => {
  const month = dayjs().month(idx)

  return {
    value: idx.toString(),
    label: month.format('MMMM'),
  }
})

export const MONTH_COLOR_MAP: Record<number, string> = {
  0: '$red9',
  1: '$dark',
  2: '$blue9',
  3: '$gray9',
  4: '$green9',
  5: '$orange9',
  6: '$pink9',
  7: '$purple9',
  8: '$yellow7',
  9: '$blue7Dark',
  10: '$orange7Dark',
  11: '$green10Dark',
}
