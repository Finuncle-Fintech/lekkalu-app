import React, { useMemo } from 'react'
import { View } from 'tamagui'
import round from 'lodash/round'

import PercentageCard from '@/components/income-statement/percentage-card'
import IncomeStatementTabs from '@/components/income-statement/income-statement-tabs'
import { hp, wp } from '@/utils/responsive'
import { useGetIncomeExpense, useGetIncomeSource } from '@/queries/income-statement'
import { useRefetchOnFocus } from '@/hooks/use-refetch-on-focus'

const IncomeStatement = () => {
  const { data: incomeSourceQueryData, refetch: refetchIncomeSource } = useGetIncomeSource()
  const { data: incomeExpenseQueryData, refetch: refetchIncomeExpense } = useGetIncomeExpense()
  useRefetchOnFocus(refetchIncomeSource)
  useRefetchOnFocus(refetchIncomeExpense)

  const stats = useMemo(() => {
    if (!incomeSourceQueryData || !incomeExpenseQueryData) {
      return {}
    }

    const totalExpenses = incomeExpenseQueryData.data?.reduce((acc, curr) => (acc += Number(curr.amount)), 0)
    const totalSources = incomeSourceQueryData.data?.reduce((acc, curr) => (acc += Number(curr.amount)), 0)

    const personalTotal = incomeExpenseQueryData.data?.reduce(
      (acc, curr) => (acc += curr.type === 'Personal' ? Number(curr.amount) : 0),
      0,
    )
    const loanRepaymentTotal = incomeExpenseQueryData.data?.reduce(
      (acc, curr) => (acc += curr.type === 'Loan_repayment' ? Number(curr.amount) : 0),
      0,
    )

    const investmentTotal = incomeExpenseQueryData.data?.reduce(
      (acc, curr) => (acc += curr.type === 'Investment' ? Number(curr.amount) : 0),
      0,
    )

    const salaryTotal = incomeSourceQueryData.data?.reduce(
      (acc, curr) => (acc += curr.type === 'Salary' ? Number(curr.amount) : 0),
      0,
    )

    const personalPercentage = round((personalTotal / totalExpenses) * 100, 2)
    const loanRepaymentPercentage = round((loanRepaymentTotal / totalExpenses) * 100, 2)
    const investmentPercentage = round((investmentTotal / totalExpenses) * 100, 2)
    const salaryPercentage = round((salaryTotal / totalSources) * 100, 2)

    return {
      personalPercentage,
      loanRepaymentPercentage,
      investmentPercentage,
      salaryPercentage,
    }
  }, [incomeExpenseQueryData, incomeSourceQueryData])

  return (
    <View pt={hp(2)} bg="$backgroundHover">
      <View fd="row" ai="center" fw="wrap" jc="space-between" rowGap={wp(3)} px={wp(5)}>
        <PercentageCard subTitle="Salary" percentage={stats.salaryPercentage} />
        <PercentageCard subTitle="Personal" percentage={stats.personalPercentage} />
        <PercentageCard subTitle="Loan Repayment" percentage={stats.loanRepaymentPercentage} />
        <PercentageCard subTitle="Investment" percentage={stats.investmentPercentage} />
      </View>
      <IncomeStatementTabs
        expenseList={incomeExpenseQueryData?.data || []}
        incomeList={incomeSourceQueryData?.data || []}
        refetchIncomeExpense={refetchIncomeExpense}
        refetchIncomeSource={refetchIncomeSource}
      />
    </View>
  )
}

export default IncomeStatement
