import React from 'react'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View } from 'tamagui'

import { hp, wp } from '@/utils/responsive'
import EmiCalculatorFormula from '@/components/emi-calculator-formula'
import EmiCalculatorForm from '@/components/emi-calculator-form'
import EmiCalculatorChartCard from '@/components/emi-calculator-chart-card/emi-calculator-chart-card'
import KeyboardScrollView from '@/components/keyboard-scroll-view'
import BackButton from '@/components/back-button'

const EmiCalculator = () => {
  const { top } = useSafeAreaInsets()
  return (
    <View f={1} pt={top + hp(2)} bg="$backgroundHover">
      <KeyboardScrollView contentContainerStyle={styles.scrollContent}>
        <BackButton style={styles.back} />
        <EmiCalculatorChartCard />
        <EmiCalculatorForm />
        <EmiCalculatorFormula />
      </KeyboardScrollView>
    </View>
  )
}

export default EmiCalculator

const styles = StyleSheet.create({
  back: {
    marginHorizontal: wp(5),
  },
  scrollContent: { paddingBottom: hp(4) },
})
