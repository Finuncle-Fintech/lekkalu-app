import React, { useContext } from 'react'
import { View } from 'tamagui'
import InputWithSlider from '@/components/input-with-slider'
import { hp, wp } from '@/utils/responsive'
import DatePickerWithLabelInfo from '../date-picker-with-label-info'
import { EmiCalculatorContext } from '@/context/emi-calculator-provider'

const EmiCalculatorForm = () => {
  const { setEmiDay, setLoanPrinicipal, setLoanInterest, setLoanTenure, disbursementDate, setDisbursementDate } =
    useContext(EmiCalculatorContext)

  return (
    <View
      bg="$background"
      px={wp(4)}
      pt={hp(1.5)}
      br={wp(4)}
      mt={hp(2)}
      rowGap={hp(1)}
      pb={hp(3)}
      elevationAndroid={3}
      shadowColor={'black'}
      shadowOpacity={0.1}
      shadowOffset={{ height: 0, width: 0 }}
      shadowRadius={wp(1)}
      mx={wp(4)}
    >
      <InputWithSlider
        label="Loan Principal"
        sliderMaxValue={10000000}
        sliderMinValue={0}
        setValue={setLoanPrinicipal}
        showInfoTooltip
        tooltipText="This is the total amount of money you wish to borrow.It's the initial loan amount you receive. For example, if you want to borrow Rs 50,000 this is your loan principal."
      />
      <InputWithSlider
        label="Loan Interest"
        sliderMaxValue={30}
        sliderMinValue={0}
        setValue={setLoanInterest}
        showInfoTooltip
        tooltipText="The loan interest rate is the annual rate at which you are borrowing money. It's expressed as a percentage. For instance, if your loan carries an annual interest rate of 5%, you'd enter 5 as the interest rate."
        sliderstep={1}
      />
      <InputWithSlider
        label="Loan Tenure (in Months)"
        sliderMaxValue={240}
        sliderMinValue={0}
        setValue={setLoanTenure}
        showInfoTooltip
        tooltipText="This field represents the total duration, provided in months, over which you will be repaying the loan. For example, if you plan to repay the loan in 3 years, which is 36 months, you would enter 36 months as the loan tenure."
        sliderstep={1}
        allowFractionDigits={false}
      />
      <InputWithSlider
        label="Emi Day"
        sliderMaxValue={31}
        sliderMinValue={0}
        setValue={setEmiDay}
        showInfoTooltip
        tooltipText="The EMI day is the day of each month on which you want to make your EMI payment. Different lenders may offer various options for selecting the EMI date."
        sliderstep={1}
        allowFractionDigits={false}
      />
      <DatePickerWithLabelInfo
        label="Disbursement Date"
        infoText="This is the date when you receive the loan amount. It's essential for calculating the exact interest applicable for each installment."
        value={disbursementDate}
        onChangeDate={setDisbursementDate}
      />
    </View>
  )
}

export default EmiCalculatorForm
