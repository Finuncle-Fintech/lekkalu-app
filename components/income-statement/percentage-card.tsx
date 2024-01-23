import React from 'react'
import { Text, View } from 'tamagui'
import { FontAwesome5 } from '@expo/vector-icons'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { FontSizes } from '@/utils/fonts'
import Card from '../card/card'

const PercentageCard = ({ percentage = '0', subTitle = '' }) => {
  return (
    <Card mx={0} w={'48%'} px={wp(2)} py={hp(1.5)} columnGap={wp(3)} fd="row" ai="center">
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
    </Card>
  )
}

export default PercentageCard
