import React, { FC, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { Button, Text, useTheme } from 'tamagui'
import { router } from 'expo-router'
import round from 'lodash/round'
import { useToast } from 'native-base'
import { formatNumberToCurrency } from '@/utils/helpers'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { EmiCalculatorContext } from '@/context/emi-calculator-provider'
import { generateExcelFileForEmiCalculator } from '@/utils/emi-calculator-helpers'

const ChartCenterLabel: FC<{ emiValue: number }> = ({ emiValue }) => {
  const theme = useTheme()

  return (
    <View style={[styles.chartCenterLabel, { backgroundColor: theme.backgroundHover.val }]}>
      <Text textAlign="center" fontFamily="$heading" color={theme.foreground.val}>
        Your EMI is
      </Text>
      <Text numberOfLines={1} textAlign="center" adjustsFontSizeToFit fontSize="$7" fontFamily="$heading">
        {formatNumberToCurrency(emiValue || 0)}
      </Text>
      <Text textAlign="center" fontFamily="$heading">
        per month
      </Text>
    </View>
  )
}

const ChartAgendaItem = ({ color = '', title = '', percentage = 0 }) => {
  return (
    <View style={styles.chartAgendaItem}>
      <View style={{ height: wp(3), width: wp(3), backgroundColor: color }} />
      <Text fontFamily={'$heading'} fontSize={'$4'}>
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
    : [{ value: 100, color: theme.backgroundFocus.val }]

  const handleExportToExcel = async () => {
    await generateExcelFileForEmiCalculator(excelData, calculationResult?.summary?.repayment_table || [])
    toast.show({ title: 'File Saved to your documents' })
  }

  return (
    <View style={[styles.chartCard, { backgroundColor: theme.background.val }]}>
      <View style={styles.chartCardChartContainer}>
        <PieChart
          data={data}
          donut
          centerLabelComponent={() => <ChartCenterLabel emiValue={+(calculationResult?.summary?.loan_emi || 0)} />}
          radius={wp(24)}
          innerRadius={wp(18)}
          innerCircleColor={theme.backgroundHover.val}
        />
      </View>
      <View style={styles.chartCardBody}>
        <View style={styles.chartAgenda}>
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
        <View style={[styles.chartAgenda, styles.chartInfoRow]}>
          <View style={styles.chartInfoItem}>
            <Text fontFamily={'$heading'} fontSize={'$4'}>
              Total Interest Payable
            </Text>
            <Text fontFamily={'$heading'} fontSize={'$6'}>
              {formatNumberToCurrency(+(calculationResult?.summary?.total_interest_payable || 0))}
            </Text>
          </View>
          <View style={styles.chartInfoItem}>
            <Text fontFamily={'$heading'} fontSize={'$4'}>
              Total Payment
            </Text>
            <Text fontFamily={'$heading'} fontSize={'$6'}>
              {formatNumberToCurrency(+(calculationResult?.summary?.total_payment || 0))}
            </Text>
          </View>
        </View>
        <View style={[styles.chartAgenda, styles.chartActionButtons]}>
          <Button
            onPress={handleExportToExcel}
            disabled={!isValidInputs}
            backgroundColor={THEME_COLORS.primary[50]}
            color={'white'}
          >
            Export to Excel
          </Button>
          <Button disabled={!isValidInputs} onPress={() => router.push('/emi-calculator-breakdown')} variant="outlined">
            View EMI Breakdown
          </Button>
        </View>
      </View>
    </View>
  )
}

export default EmiCalculatorChartCard

const styles = StyleSheet.create({
  chartCenterLabel: {
    alignItems: 'center',
    rowGap: wp(2),
    paddingHorizontal: wp(1),
  },
  chartCard: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderRadius: wp(4),
    marginTop: hp(10),
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: wp(1),
    marginHorizontal: wp(4),
  },
  chartCardChartContainer: {
    top: -wp(24) + -hp(1.5),
  },
  chartCardBody: {
    top: -wp(20),
    alignItems: 'center',
    height: hp(13),
  },
  chartAgenda: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: wp(8),
  },
  chartAgendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: wp(2),
  },
  chartInfoItem: {
    alignItems: 'center',
    rowGap: hp(1),
  },
  chartInfoRow: {
    marginTop: hp(3),
    columnGap: wp(12),
  },
  chartActionButtons: {
    marginTop: hp(4),
    columnGap: wp(4),
  },
})
