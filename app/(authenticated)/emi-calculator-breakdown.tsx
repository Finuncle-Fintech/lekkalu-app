import React, { FC, useContext } from 'react'
import { DimensionValue, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, useTheme } from 'tamagui'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { EmiCalculatorContext } from '@/context/emi-calculator-provider'
import { formatNumberToCurrency } from '@/utils/helpers'

const tableHeaderColumn = ['Month', 'Principal', 'Interest', 'Total Payment', 'Outstanding Principal']

const widthArr: DimensionValue[] = [wp(15), wp(30), wp(30), wp(30), wp(40)]

interface IBodyCellItem {
  index: number
  value: number
  rowIndex: number
  disableNumberFormat?: boolean
}

const BodyCellItem: FC<IBodyCellItem> = ({ index, value, rowIndex, disableNumberFormat = false }) => {
  return (
    <View
      key={`emi-calculator-row-${rowIndex}-${index}`}
      style={[styles.tableCell, { width: widthArr[index], paddingTop: hp(2) }]}
    >
      <Text numberOfLines={1}>{disableNumberFormat ? value : formatNumberToCurrency(value)}</Text>
    </View>
  )
}

const EmiCalculatorBreakdown: FC = () => {
  const { calculationResult } = useContext(EmiCalculatorContext)
  const theme = useTheme()
  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.backgroundHover.val }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back} style={styles.back}>
          <Entypo name="chevron-thin-left" size={wp(5)} color={theme.foreground.val} />
        </TouchableOpacity>
        <Text fontSize={'$6'} fontFamily={'$heading'}>
          EMI Breakdown
        </Text>
      </View>

      <View>
        <ScrollView contentContainerStyle={{ paddingBottom: hp(4) }}>
          <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: wp(2) }}>
            <View style={[styles.table, { backgroundColor: theme.background.val }]}>
              <View style={styles.tableHeader}>
                {tableHeaderColumn.map((item, index) => (
                  <View key={`emi-calculator-header-${index}`} style={[styles.tableCell, { width: widthArr[index] }]}>
                    <Text numberOfLines={1}>{item}</Text>
                  </View>
                ))}
              </View>
              {(calculationResult?.summary?.repayment_table ?? []).map((item, rowIndex) => (
                <View key={`emi-calculator-row-${rowIndex}`} style={styles.tableHeader}>
                  <BodyCellItem rowIndex={rowIndex} index={0} value={item.month} disableNumberFormat />
                  <BodyCellItem rowIndex={rowIndex} index={1} value={item.principal} />
                  <BodyCellItem rowIndex={rowIndex} index={2} value={item.interest} />
                  <BodyCellItem rowIndex={rowIndex} index={3} value={item.total_payment} />
                  <BodyCellItem rowIndex={rowIndex} index={4} value={item.outstandingPrincipal} />
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default EmiCalculatorBreakdown

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(2),
  },
  back: {
    height: wp(10),
    width: wp(10),
    backgroundColor: THEME_COLORS.primary[100] + 20,
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: hp(4),
    backgroundColor: 'white1',
    marginTop: hp(3),
    marginHorizontal: wp(1),
    borderRadius: wp(3),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: wp(4),
    paddingHorizontal: wp(5),
  },
  table: {
    marginVertical: hp(2),
    borderRadius: wp(3),
    paddingVertical: hp(2),
    paddingHorizontal: wp(1),
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: wp(1),
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(1),
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingBottom: hp(2),
  },
  tableCell: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
  },
})
