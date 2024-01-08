import React from 'react'
import { View } from 'tamagui'
import PercentageCard from '@/components/income-statement/percentage-card'
import IncomeStatementTabs from '@/components/income-statement/income-statement-tabs'

const IncomeStatement = () => {
  return (
    <View pt="$4" bg="$backgroundHover">
      <View fd="row" ai="center" fw="wrap" jc="space-between" rowGap="$3" px="$4">
        <PercentageCard subTitle="Salary" />
        <PercentageCard subTitle="Personal" />
        <PercentageCard subTitle="Loan Repayment" />
        <PercentageCard subTitle="Investment" />
      </View>
      <IncomeStatementTabs />
    </View>
  )
}

export default IncomeStatement
