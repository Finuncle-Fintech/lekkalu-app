import React, { FC } from 'react'
import { Text, View } from 'tamagui'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import Card from '../card/card'

interface IKeyValueTextProps {
  title: string
  value: string
}

const KeyValueText: FC<IKeyValueTextProps> = ({ title = '', value = '' }) => {
  return (
    <Text fontSize={FontSizes.size15}>
      -{' '}
      <Text fontSize={FontSizes.size15} fontFamily={'$body'} fontWeight={'bold'}>
        {title}:
      </Text>{' '}
      {value}
    </Text>
  )
}

const EmiCalculatorFormula = () => {
  return (
    <Card pt={hp(1.5)} mt={hp(2)} rowGap={hp(1)} pb={hp(3)}>
      <Text fontFamily={'$heading'} fontSize={FontSizes.size24} fontWeight={'bold'}>
        EMI Formula
      </Text>
      <Text fontSize={FontSizes.size15} fontFamily={'$body'}>
        EMI = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
      </Text>
      <Text fontSize={FontSizes.size15} fontFamily={'$body'}>
        Where:
      </Text>
      <View ml={wp(2)} rowGap={hp(1)}>
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
      <Text fontSize={FontSizes.size15} fontFamily={'$body'}>
        The EMI formula helps you calculate the monthly repayment amount for a loan based on the principal, interest
        rate, and loan tenure.
      </Text>
    </Card>
  )
}

export default EmiCalculatorFormula
