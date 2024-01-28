import { AxiosHeaders } from 'axios'
import { getToken } from './token'

export const formatNumberToCurrency = (value: number = 0, options?: Intl.NumberFormatOptions, locale?: string) => {
  return new Intl.NumberFormat(locale || 'en-IN', {
    style: 'currency',
    currency: options?.currency || 'INR',
    compactDisplay: options?.compactDisplay || 'short',
  }).format(isNaN(value) ? 0 : value)
}

export const getAxiosHeaderWithToken = () => {
  const headers = new AxiosHeaders()
  const accessToken = getToken('access')
  if (accessToken) {
    headers.setAuthorization(`Bearer ${accessToken}`)
  }
  return headers
}
