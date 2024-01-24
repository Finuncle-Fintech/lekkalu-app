import React from 'react'
import { Text, View } from 'tamagui'
import { FontAwesome5 } from '@expo/vector-icons'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { FontSizes } from '@/utils/fonts'

const PercentageCard = ({ percentage = 0, subTitle = '' }) => {
  return (
    <View
      bg="$background"
      br={wp(3)}
      width={'48%'}
      elevationAndroid={4}
      shadowColor={'black'}
      shadowOffset={{ height: 0, width: 0 }}
      shadowOpacity={0.1}
      shadowRadius={wp(4)}
      px={wp(2)}
      py={hp(1.5)}
      columnGap={wp(3)}
      fd="row"
      ai="center"
    >
      <View h={wp(10)} w={wp(10)} br={wp(5)} jc="center" ai="center" bg={THEME_COLORS.primary[50] + '20'}>
        <FontAwesome5 name="percent" size={wp(4)} color={THEME_COLORS.primary[50]} />
      </View>
      <View rowGap={hp(0.5)} f={1}>
        <Text fontFamily={'$heading'} fontSize={FontSizes.size18} fontWeight={'bold'}>
          {percentage}%
        </Text>
        <Text fontFamily={'$body'} fontSize={FontSizes.size14} color={'$gray9'} numberOfLines={1}>
          {subTitle}
        </Text>
      </View>
    </View>
  )
}

export default PercentageCard
