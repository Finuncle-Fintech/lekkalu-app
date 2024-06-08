import { formatIndianMoneyNotation } from './format-money'

export const describeTransaction = (amount: string | number) => {
  if (typeof amount === 'string') {
    const balance = parseFloat(amount)
    if (balance < 0) {
      return `You borrowed ${formatIndianMoneyNotation(Math.abs(balance))}`
    } else if (balance > 0) {
      return `You lent ${formatIndianMoneyNotation(balance)}`
    } else {
      return 'The balance is zero'
    }
  }
}
