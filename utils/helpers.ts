export const formatNumberToCurrency = (value: number = 0, options?: Intl.NumberFormatOptions, locale?: string) => {
  return new Intl.NumberFormat(locale || 'en-IN', {
    style: 'currency',
    currency: options?.currency || 'INR',
    compactDisplay: options?.compactDisplay || 'short',
  }).format(isNaN(value) ? 0 : value)
}
