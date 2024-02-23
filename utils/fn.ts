import dayjs from 'dayjs'
import { monthName } from './constant/constant'

export const formatDate = (date: Date | string, formate: string = 'MMM DD, YYYY'): string => {
  return dayjs(date).format(formate)
}

export const getLastTenYears = () : string[] => {
  const currentYear = new Date().getFullYear()
  const lastTenYears : string[] = []

  for (let i = currentYear; i > currentYear - 10; i--) {
    lastTenYears.push(String(i))
  }

  return lastTenYears
}

// Function to convert month name to its respective index
export const getMonthIndex = (month  :string) : number =>  {
  const months : string[] = monthName;
  return months.indexOf(month);
}
