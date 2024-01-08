import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { hp, wp } from '@/utils/responsive'

interface IKeyValueTextProps {
  title: string
  value: string
}

const KeyValueText: FC<IKeyValueTextProps> = ({ title = '', value = '' }) => {
  return (
    <Text>
      -{' '}
      <Text fontFamily={'$body'} fontWeight={'bold'}>
        {title}:
      </Text>{' '}
      {value}
    </Text>
  )
}

const EmiCalculatorFormula = () => {
  const theme = useTheme()
  return (
    <View style={[styles.configureEMICard, { backgroundColor: theme.background.val }]}>
      <Text fontFamily={'$heading'} fontSize={'$7'} fontWeight={'bold'}>
        EMI Formula
      </Text>
      <Text fontFamily={'$body'}>EMI = P * (r * (1 + r)^n) / ((1 + r)^n - 1)</Text>
      <Text fontFamily={'$body'}>Where:</Text>
      <View style={styles.whereBlock}>
        <KeyValueText title="EMI" value="Equated Monthly Installment, the fixed amount you need to pay every month." />
        <KeyValueText title="P" value="Loan Principal, the initial loan amount you receive." />
        <KeyValueText title="r" value="Monthly interest rate, calculated from the Loan Interest Rate." />
        <KeyValueText title="n" value="Total number of EMIs you need to pay over the Loan Tenure (in months)." />
      </View>
      <KeyValueText title="Total Interest Payable" value="The total amount you pay in interest over the loan tenure." />
      <KeyValueText
        title="Total Payment"
        value="The total amount you repay, including both the principal and interest."
      />
      <Text fontFamily={'$body'}>
        The EMI formula helps you calculate the monthly repayment amount for a loan based on the principal, interest
        rate, and loan tenure.
      </Text>
    </View>
  )
}

export default EmiCalculatorFormula

const styles = StyleSheet.create({
  configureEMICard: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
    backgroundColor: 'white',
    borderRadius: wp(4),
    marginTop: hp(2),
    rowGap: hp(1),
    paddingBottom: hp(3),
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: wp(1),
    marginHorizontal: wp(4),
  },
  whereBlock: {
    marginLeft: wp(2),
    rowGap: hp(1),
  },
})
