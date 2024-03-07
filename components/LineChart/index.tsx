import React, { forwardRef } from 'react'

import { SvgChart } from '@wuba/react-native-echarts'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { View } from 'tamagui'

const LineChart = forwardRef(function LineChartComponent(_, ref) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View flex={1} alignItems="center" justifyContent="center">
        <SvgChart ref={ref} useRNGH />
      </View>
    </GestureHandlerRootView>
  )
})

export default LineChart
