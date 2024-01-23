import React, { FC, useContext } from 'react'
import { DimensionValue, StyleSheet } from 'react-native'
import { ScrollView, Text, View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { hp, wp } from '@/utils/responsive'
import { EmiCalculatorContext } from '@/context/emi-calculator-provider'
import { formatNumberToCurrency } from '@/utils/helpers'
import { FontSizes } from '@/utils/fonts'
import BackButton from '@/components/back-button'
import Card from '@/components/card'

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
      jc="center"
      ai="center"
      mx={wp(2)}
      w={widthArr[index]}
      pt={hp(2)}
    >
      <Text fontSize={FontSizes.size15} numberOfLines={1}>
        {disableNumberFormat ? value : formatNumberToCurrency(value)}
      </Text>
    </View>
  )
}

const EmiCalculatorBreakdown: FC = () => {
  const { calculationResult } = useContext(EmiCalculatorContext)
  const { top } = useSafeAreaInsets()

  return (
    <View f={1} pt={top + hp(1.5)} bg={'$backgroundHover'}>
      <View fd="row" ai="center" columnGap={wp(4)} px={wp(5)}>
        <BackButton />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          EMI Breakdown
        </Text>
      </View>

      <View>
        <ScrollView contentContainerStyle={styles.verticalScroll}>
          <ScrollView horizontal contentContainerStyle={styles.horizontalScroll}>
            <Card my={hp(2)} px={wp(1)}>
              <View
                fd="row"
                ai="center"
                mx={wp(1)}
                alignSelf="flex-start"
                borderBottomWidth={1}
                borderBottomColor="lightgray"
                pb={hp(2)}
              >
                {tableHeaderColumn.map((item, index) => (
                  <View
                    key={`emi-calculator-header-${index}`}
                    jc="center"
                    ai="center"
                    mx={wp(2)}
                    w={widthArr[index]}
                    pt={hp(2)}
                  >
                    <Text fontSize={FontSizes.size18} numberOfLines={1}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
              {(calculationResult?.summary?.repayment_table ?? []).map((item, rowIndex) => (
                <View
                  key={`emi-calculator-row-${rowIndex}`}
                  fd="row"
                  ai="center"
                  mx={wp(1)}
                  alignSelf="flex-start"
                  borderBottomWidth={1}
                  borderBottomColor="lightgray"
                  pb={hp(2)}
                >
                  <BodyCellItem rowIndex={rowIndex} index={0} value={item.month} disableNumberFormat />
                  <BodyCellItem rowIndex={rowIndex} index={1} value={item.principal} />
                  <BodyCellItem rowIndex={rowIndex} index={2} value={item.interest} />
                  <BodyCellItem rowIndex={rowIndex} index={3} value={item.total_payment} />
                  <BodyCellItem rowIndex={rowIndex} index={4} value={item.outstandingPrincipal} />
                </View>
              ))}
            </Card>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  )
}

export default EmiCalculatorBreakdown

const styles = StyleSheet.create({
  verticalScroll: { paddingBottom: hp(6) },
  horizontalScroll: { paddingHorizontal: wp(2) },
})
