import React, { FC } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, View, useTheme } from 'tamagui'
import { PieChart } from 'react-native-gifted-charts'
import { useNavigation } from 'expo-router/src/useNavigation'
import dayjs from 'dayjs'

import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { FontSizes } from '@/utils/fonts'
import { useGetGoalProgress } from '@/queries/goal'

const ChartCenterLabel: FC<{ value: number }> = ({ value }) => {
  return (
    <View bg="$backgroundHover" ai="center" rowGap={wp(2)} px={wp(1)} br={wp(50)}>
      <Text
        color="$foreground"
        numberOfLines={2}
        textAlign="center"
        adjustsFontSizeToFit
        fontSize={FontSizes.size12}
        fontFamily="$heading"
      >
        {value}%
      </Text>
    </View>
  )
}

interface GoalItemProps {
  id: number
  goalTitle: string
  category: string
  createdAt: string
}

const GoalItem: FC<GoalItemProps> = (props) => {
  const { category, createdAt, goalTitle, id } = props
  const theme = useTheme()
  const navigation = useNavigation()
  const { data: goalProgressQueryData } = useGetGoalProgress(id)

  const progressValue = Math.abs(+parseFloat(goalProgressQueryData?.data?.progress_percent || 0).toFixed(2))

  const data = [
    {
      value: progressValue,
      color: THEME_COLORS.violet[500],
    },
    { value: 100 - progressValue, color: 'lightgray' },
  ]

  const handleNavigateGoalDetails = () => {
    navigation.navigate('goal-details', { id })
  }

  return (
    <TouchableOpacity
      onPress={handleNavigateGoalDetails}
      style={[styles.container, { backgroundColor: theme.background.get() }]}
    >
      <PieChart
        data={data}
        donut
        centerLabelComponent={() => <ChartCenterLabel value={progressValue} />}
        radius={wp(8)}
        innerRadius={wp(6)}
        innerCircleColor={theme.backgroundHover.get()}
      />
      <View f={1} rowGap={hp(0.6)}>
        <Text fontSize={FontSizes.size18} color={theme.foreground.get()} fontWeight={'bold'}>
          {goalTitle}
        </Text>
        <Text color={theme.mutedForeground.get()} fontSize={FontSizes.size14} fontWeight={'500'}>
          {category}
        </Text>
        <Text color={theme.mutedForeground.get()} fontWeight={'500'} fontSize={FontSizes.size12}>
          {dayjs(createdAt).fromNow()}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default GoalItem

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: wp(0.5),
    borderLeftColor: THEME_COLORS.violet[500],
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: wp(1),
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: wp(4),
  },
})
