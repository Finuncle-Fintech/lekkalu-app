import React, { FC, useContext } from 'react'
import { PieChart } from 'react-native-gifted-charts'
import { Button, Text, View, useTheme } from 'tamagui'
import { router } from 'expo-router'
import round from 'lodash/round'
import { useToast } from 'native-base'
import { formatNumberToCurrency } from '@/utils/helpers'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { EmiCalculatorContext } from '@/context/emi-calculator-provider'
import { generateExcelFileForEmiCalculator } from '@/utils/emi-calculator-helpers'
import { FontSizes } from '@/utils/fonts'
import Card from '../card/card'

const ChartCenterLabel: FC<{ emiValue: number }> = ({ emiValue }) => {
  return (
    <View bg="$backgroundHover" ai="center" rowGap={wp(2)} px={wp(1)} br={wp(50)}>
      <Text fontSize={FontSizes.size15} textAlign="center" fontFamily="$heading" color="$foreground">
        Your EMI is
      </Text>
      <Text
        color="$foreground"
        numberOfLines={1}
        textAlign="center"
        adjustsFontSizeToFit
        fontSize={FontSizes.size22}
        fontFamily="$heading"
      >
        {formatNumberToCurrency(emiValue || 0)}
      </Text>
      <Text fontSize={FontSizes.size15} color="$foreground" textAlign="center" fontFamily="$heading">
        per month
      </Text>
    </View>
  )
}

const ChartAgendaItem = ({ color = '', title = '', percentage = 0 }) => {
  return (
    <View fd="row" ai="center" columnGap={wp(2)}>
      <View h={wp(3)} w={wp(3)} bg={color} />
      <Text fontFamily={'$heading'} fontSize={FontSizes.size15}>
        {title} :- {percentage || 0}%
      </Text>
    </View>
  )
}

const EmiCalculatorChartCard = () => {
  const { calculationResult, isValidInputs, excelData } = useContext(EmiCalculatorContext)
  const toast = useToast()
  const theme = useTheme()

  const interestPercent = round(calculationResult?.assets.interest || 0)
  const principalPercent = round(calculationResult?.assets.principal || 0)

  const data = isValidInputs
    ? [
        { value: interestPercent, color: '#9e54dd' },
        { value: principalPercent, color: '#34c3ff' },
      ]
    : [{ value: 100, color: theme.backgroundFocus.get() }]

  const handleExportToExcel = async () => {
    await generateExcelFileForEmiCalculator(excelData, calculationResult?.summary?.repayment_table || [])
    toast.show({ title: 'File Saved to your documents' })
  }

  return (
    <Card mt={hp(10)} ai="center">
      <View top={-wp(24) + -hp(1.5)}>
        <PieChart
          data={data}
          donut
          centerLabelComponent={() => <ChartCenterLabel emiValue={+(calculationResult?.summary?.loan_emi || 0)} />}
          radius={wp(24)}
          innerRadius={wp(18)}
          innerCircleColor={theme.backgroundHover.get()}
        />
      </View>
      <View t={-wp(20)} ai="center" h={hp(13)}>
        <View fd="row" ai="center" columnGap={wp(8)}>
          <ChartAgendaItem
            color="#34c3ff"
            title="Principal"
            percentage={round(calculationResult?.assets.principal || 0, 2)}
          />
          <ChartAgendaItem
            color="#9e54dd"
            title="Interest"
            percentage={round(calculationResult?.assets.interest || 0, 2)}
          />
        </View>
        <View fd="row" ai="center" columnGap={wp(12)} mt={hp(3)}>
          <View ai="center" rowGap={hp(1)}>
            <Text fontFamily={'$heading'} fontSize={FontSizes.size15}>
              Total Interest Payable
            </Text>
            <Text fontFamily={'$heading'} fontSize={FontSizes.size20}>
              {formatNumberToCurrency(+(calculationResult?.summary?.total_interest_payable || 0))}
            </Text>
          </View>
          <View ai="center" rowGap={hp(1)}>
            <Text fontFamily={'$heading'} fontSize={FontSizes.size15}>
              Total Payment
            </Text>
            <Text fontFamily={'$heading'} fontSize={FontSizes.size20}>
              {formatNumberToCurrency(+(calculationResult?.summary?.total_payment || 0))}
            </Text>
          </View>
        </View>
        <View fd="row" ai="center" columnGap={wp(4)} mt={hp(4)}>
          <Button
            fontSize={FontSizes.size15}
            onPress={handleExportToExcel}
            disabled={!isValidInputs}
            backgroundColor={THEME_COLORS.primary[50]}
            color={'white'}
            h={hp(5.5)}
          >
            Export to Excel
          </Button>
          <Button
            fontSize={FontSizes.size15}
            disabled={!isValidInputs}
            onPress={() => router.push('/emi-calculator-breakdown')}
            variant="outlined"
            h={hp(5.5)}
          >
            View EMI Breakdown
          </Button>
        </View>
      </View>
    </Card>
  )
}

export default EmiCalculatorChartCard
