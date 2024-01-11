import React, { FC, useContext } from 'react'
import { DimensionValue, StyleSheet, TouchableOpacity } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ScrollView, Text, View, useTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
      jc="center"
      ai="center"
      mx={wp(2)}
      w={widthArr[index]}
      pt={hp(2)}
    >
      <Text numberOfLines={1}>{disableNumberFormat ? value : formatNumberToCurrency(value)}</Text>
    </View>
  )
}

const EmiCalculatorBreakdown: FC = () => {
  const { calculationResult } = useContext(EmiCalculatorContext)
  const theme = useTheme()
  const { top } = useSafeAreaInsets()

  return (
    <View f={1} pt={top + hp(1.5)} bg={'$backgroundHover'}>
      <View fd="row" ai="center" columnGap={wp(4)} px={wp(5)}>
        <TouchableOpacity onPress={router.back} style={styles.back}>
          <Entypo name="chevron-thin-left" size={wp(5)} color={theme.foreground.get()} />
        </TouchableOpacity>
        <Text fontSize={'$6'} fontFamily={'$heading'}>
          EMI Breakdown
        </Text>
      </View>

      <View>
        <ScrollView contentContainerStyle={styles.verticalScroll}>
          <ScrollView horizontal contentContainerStyle={styles.horizontalScroll}>
            <View
              bg={'$background'}
              my={hp(2)}
              br={wp(3)}
              px={wp(1)}
              elevationAndroid={3}
              shadowColor={'black'}
              shadowOpacity={0.1}
              shadowOffset={{ height: 0, width: 0 }}
              shadowRadius={wp(1)}
            >
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
                    <Text numberOfLines={1}>{item}</Text>
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
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  )
}

export default EmiCalculatorBreakdown

const styles = StyleSheet.create({
  back: {
    height: wp(10),
    width: wp(10),
    backgroundColor: THEME_COLORS.primary[100] + 20,
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalScroll: { paddingBottom: hp(6) },
  horizontalScroll: { paddingHorizontal: wp(2) },
})
