import React from 'react'
import { StyleSheet, View } from 'react-native'
import { hp, wp } from '@/utils/responsive'
import PercentageCard from '@/components/income-statement/percentage-card'
import IncomeStatementTabs from '@/components/income-statement/income-statement-tabs'

const IncomeStatement = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
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

const styles = StyleSheet.create({
  container: {
    paddingTop: hp(1.5),
  },
  cardsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: hp(1),
    paddingHorizontal: wp(5),
  },
})
