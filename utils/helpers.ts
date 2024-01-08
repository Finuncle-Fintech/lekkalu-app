export const formatNumberToCurrency = (value: number = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    compactDisplay: 'short',
  }).format(value)
}
