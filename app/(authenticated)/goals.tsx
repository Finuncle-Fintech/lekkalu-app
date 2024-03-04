import React, { useMemo } from 'react'
import { Text, View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { Plus } from '@tamagui/lucide-icons'
import { router } from 'expo-router'

import { hp, wp } from '@/utils/responsive'
import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import GoalTrackItem from '@/components/goal-track-item'
import { THEME_COLORS } from '@/utils/theme'
import GoalItem from '@/components/goal-item'
import { useGetGoals } from '@/queries/goal'
import { useRefetchOnFocus } from '@/hooks/use-refetch-on-focus'
import { getGoalProgressData, getGoalsProgressChartData } from '@/utils/goal'

const Goals = () => {
  const insets = useSafeAreaInsets()
  const { data, refetch, isLoading } = useGetGoals()
  useRefetchOnFocus(refetch)

  const goalProgressData = useMemo(() => getGoalProgressData(data?.data || []), [data])

  const chartData = useMemo(() => getGoalsProgressChartData(goalProgressData), [goalProgressData])

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          Your Goals
        </Text>
      </View>
      <Carousel
        loop
        autoPlay={true}
        width={wp(95)}
        height={wp(50)}
        pagingEnabled
        data={chartData}
        style={styles.carousel}
        autoPlayInterval={2000}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => <GoalTrackItem fillColor={item.color} title={item.title} value={item.value} />}
      />
      <Text mx={wp(5)} mt={hp(2)} mb={hp(3)} fontSize={FontSizes.size24} fontFamily={'$heading'}>
        Your ongoing financial goals
      </Text>
      <FlatList
        ListEmptyComponent={() => {
          if (isLoading) {
            return (
              <View>
                <Text>Loading...</Text>
              </View>
            )
          }
          return (
            <View h={hp(35)} jc="center" ai="center">
              <Text fontSize={FontSizes.size24} fontWeight={'bold'}>
                No Goals Added
              </Text>
            </View>
          )
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        data={data?.data || []}
        renderItem={({ item }) => <GoalItem data={item} />}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(authenticated)/add-goal')}>
        <Plus size={wp(8)} color={'white'} />
      </TouchableOpacity>
    </View>
  )
}

export default Goals

const styles = StyleSheet.create({
  carousel: {
    alignSelf: 'center',
    marginTop: hp(2),
    marginLeft: wp(5),
  },
  listContent: {
    paddingHorizontal: wp(5),
    rowGap: hp(1.5),
    paddingBottom: hp(10),
  },
  fab: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    backgroundColor: THEME_COLORS.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    bottom: hp(3),
    position: 'absolute',
    right: wp(8),
  },
})
