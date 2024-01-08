import round from 'lodash/round'
import XLSX from 'xlsx'
import * as FileSystem from 'expo-file-system'

export function calculateEmi(
  loanPrincipal: number,
  loanInterest: number,
  loanTenure: number,
  unit: 'Months' | 'Years',
) {
  if (loanPrincipal && loanInterest && loanTenure) {
    const P = Math.abs(loanPrincipal)
    const r = Math.abs(loanInterest / (12 * 100))
    const n = Math.abs(loanTenure) //* 12 when year
    const nYear = Math.abs(loanTenure * 12)
    const E =
      (P * r * Math.pow(1 + r, unit === 'Months' ? n : nYear)) / (Math.pow(1 + r, unit === 'Months' ? n : nYear) - 1)

    const repaymentTable = []
    let outstandingPrincipal = P

    for (let i = 1; unit === 'Months' ? i <= n : i <= nYear; i++) {
      const interestComponent = outstandingPrincipal * r
      const principalComponent = E - interestComponent
      outstandingPrincipal -= principalComponent

      const monthly_payment = interestComponent + principalComponent

      const repaymentRecord = {
        month: i,
        principal: round(principalComponent, 2),
        interest: round(interestComponent, 2),
        total_payment: round(monthly_payment, 2),
        outstandingPrincipal: round(outstandingPrincipal, 2),
      }
      repaymentTable.push(repaymentRecord)
    }

    const total_interest_payable = E * (unit === 'Months' ? n : nYear) - P
    const total_payment = P + total_interest_payable

    return {
      loan_emi: isNaN(E) ? '0' : E.toFixed(2),
      total_interest_payable: isNaN(total_interest_payable) ? '0' : total_interest_payable.toFixed(2),
      total_payment: isNaN(total_payment) ? '0' : total_payment.toFixed(2),
      repayment_table: repaymentTable,
    }
  }
}

export function calculateAssetsForEmi(loanPrincipal: number, totalInterestPayable: string) {
  const totalAmount = loanPrincipal + +totalInterestPayable

  const interest = round((+totalInterestPayable / totalAmount) * 100, 2)

  return {
    principal: round(100 - interest, 2),
    interest,
  }
}

export function calculateTenureByUnit(unit: 'Months' | 'Years', loanTenure: number) {
  let tenure = 0

  if (unit === 'Years') {
    tenure = Math.floor(loanTenure / 12)
  } else {
    tenure = Math.floor(loanTenure * 12)
  }

  return tenure
}

export const generateExcelFileForEmiCalculator = async (data: any, repayment_table: any[]) => {
  const wb = XLSX.utils.book_new()
  const emiCalculationWorksheet = XLSX.utils.json_to_sheet(data) ?? []
  const emiMonthlyCalculationWorksheet = XLSX.utils.json_to_sheet(repayment_table ?? []) ?? []
  const emiCalculationJson = XLSX.utils.sheet_to_json(emiCalculationWorksheet, { header: 1 })
  const emiMonthlyCalculationJson = XLSX.utils.sheet_to_json(emiMonthlyCalculationWorksheet, { header: 1 })
  const mergedWorksheet = emiCalculationJson.concat([[''], [''], ['']]).concat(emiMonthlyCalculationJson)
  const finalWorksheet = XLSX.utils.json_to_sheet(mergedWorksheet, { skipHeader: true })
  XLSX.utils.book_append_sheet(wb, finalWorksheet, 'EMI Calculation')
  const wbout = XLSX.write(wb, {
    type: 'base64',
    bookType: 'xlsx',
  })
  const uri = FileSystem.documentDirectory + 'emi_calculation.xlsx'
  await FileSystem.writeAsStringAsync(uri, wbout, {
    encoding: FileSystem.EncodingType.Base64,
  })
}
