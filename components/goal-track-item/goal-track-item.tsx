import React, { FC } from 'react'
import { Text, View, useTheme } from 'tamagui'
import { PieChart } from 'react-native-gifted-charts'

import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import Card from '../card/card'

const ChartCenterLabel: FC<{ value: number }> = ({ value }) => {
  return (
    <View bg="$backgroundHover" ai="center" rowGap={wp(2)} px={wp(1)} br={wp(50)}>
      <Text
        color="$foreground"
        numberOfLines={1}
        textAlign="center"
        adjustsFontSizeToFit
        fontSize={FontSizes.size22}
        fontFamily="$heading"
      >
        {value}%
      </Text>
    </View>
  )
}

interface GoalTrackItemProps {
  title: string
  value: number
  fillColor: string
}

const GoalTrackItem: FC<GoalTrackItemProps> = ({ title, value, fillColor }) => {
  const theme = useTheme()

  const data = [
    { value: 35, color: fillColor },
    { value: 65, color: 'lightgray' },
  ]

  return (
    <Card jc="center" w={wp(80)} mx={wp(5)} ai="center" my={hp(1)}>
      <Text
        color="$foreground"
        numberOfLines={1}
        textAlign="center"
        adjustsFontSizeToFit
        fontSize={FontSizes.size22}
        fontFamily="$heading"
        mb={hp(2)}
      >
        {title}
      </Text>

      <PieChart
        data={data}
        donut
        centerLabelComponent={() => <ChartCenterLabel value={value} />}
        radius={wp(14)}
        innerRadius={wp(10)}
        innerCircleColor={theme.backgroundHover.get()}
      />
    </Card>
  )
}

export default GoalTrackItem
