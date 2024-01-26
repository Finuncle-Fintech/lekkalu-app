import React, { Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import throttle from 'lodash/throttle'
import { calculateAssetsForEmi, calculateEmi, calculateTenureByUnit } from '@/utils/emi-calculator-helpers'

interface IEmiCalculatorContextValue {
  setLoanPrinicipal: Dispatch<SetStateAction<string>>
  setLoanInterest: Dispatch<SetStateAction<string>>
  setLoanTenure: Dispatch<SetStateAction<string>>
  setEmiDay: Dispatch<SetStateAction<string>>
  calculationResult?: {
    summary: ReturnType<typeof calculateEmi>
    assets: ReturnType<typeof calculateAssetsForEmi>
    tenure: ReturnType<typeof calculateTenureByUnit>
  }
  isValidInputs: boolean
  disbursementDate: Date
  setDisbursementDate: Dispatch<SetStateAction<Date>>
  excelData: {
    loanEmi: string | undefined
    totalInterestPayable: string | undefined
    totalPayment: string | undefined
    loanPrinicipal: string
    loanInterest: string
    loanTenure: string
    disbursementDate: Date
    emiDay: string
  }[]
}

export const EmiCalculatorContext = createContext<IEmiCalculatorContextValue>({} as IEmiCalculatorContextValue)

const getCalculation = throttle((_loanInterest: string, _loanPrinicipal: string, _loanTenure: string) => {
  const _loanPrincipalNumber = isNaN(+_loanPrinicipal) ? 0 : +_loanPrinicipal
  const _loanInterestNumber = isNaN(+_loanInterest) ? 0 : +_loanInterest
  const _loanTenureNumber = isNaN(+_loanTenure) ? 0 : +_loanTenure

  if (!_loanPrincipalNumber || !_loanInterestNumber || !_loanTenureNumber) {
    return undefined
  }
  const summary = calculateEmi(_loanPrincipalNumber, _loanInterestNumber, _loanTenureNumber, 'Months')
  const assets = calculateAssetsForEmi(_loanPrincipalNumber, summary?.total_interest_payable!)
  const tenure = calculateTenureByUnit('Months', _loanTenureNumber)

  return { summary, assets, tenure }
}, 200)

const EmiCalculatorProvider: FC<PropsWithChildren> = (props) => {
  const [loanPrinicipal, setLoanPrinicipal] = useState('0')
  const [loanInterest, setLoanInterest] = useState('0')
  const [loanTenure, setLoanTenure] = useState('0')
  const [emiDay, setEmiDay] = useState('0')
  const [disbursementDate, setDisbursementDate] = useState(dayjs().toDate())

  const calculationResult = getCalculation(loanInterest, loanPrinicipal, loanTenure)

  const excelData = useMemo(() => {
    const data = {
      loanEmi: calculationResult?.summary?.loan_emi,
      totalInterestPayable: calculationResult?.summary?.total_interest_payable,
      totalPayment: calculationResult?.summary?.total_payment,
    }
    return [{ loanPrinicipal, loanInterest, loanTenure, disbursementDate, emiDay, ...data }]
  }, [calculationResult, disbursementDate, emiDay, loanInterest, loanPrinicipal, loanTenure])

  const isValidInputs = !!(+loanInterest && +loanPrinicipal && +loanTenure && calculationResult)

  const value: IEmiCalculatorContextValue = {
    setEmiDay,
    setLoanPrinicipal,
    setLoanInterest,
    setLoanTenure,
    calculationResult,
    isValidInputs,
    disbursementDate,
    setDisbursementDate,
    excelData,
  }

  return <EmiCalculatorContext.Provider value={value}>{props.children}</EmiCalculatorContext.Provider>
}

export default EmiCalculatorProvider
