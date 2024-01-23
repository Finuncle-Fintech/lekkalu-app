import React from 'react'
import { View } from 'tamagui'
import PercentageCard from '@/components/income-statement/percentage-card'
import IncomeStatementTabs from '@/components/income-statement/income-statement-tabs'
import { hp, wp } from '@/utils/responsive'

const IncomeStatement = () => {
  return (
    <View pt={hp(2)} bg="$backgroundHover">
      <View fd="row" ai="center" fw="wrap" jc="space-between" rowGap={wp(3)} px={wp(5)}>
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
