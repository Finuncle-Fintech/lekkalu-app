import React, { FC, ReactNode } from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { Text, View, useTheme } from 'tamagui'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { FontSizes } from '@/utils/fonts'

interface IFeatureCardProps {
  containerStyle?: StyleProp<ViewStyle>
  image: ReactNode
  title: string
  onPress?: () => void
}

const FeatureCard: FC<IFeatureCardProps> = ({ containerStyle, image, title, onPress }) => {
  const theme = useTheme()
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[styles.container, { backgroundColor: theme.backgroundStrong.get() }, containerStyle]}
    >
      <View h={wp(12)} w={wp(12)} br={wp(7)} jc="center" ai="center" bg={THEME_COLORS.primary[50] + '20'}>
        {image}
      </View>
      <Text numberOfLines={1} adjustsFontSizeToFit fontSize={FontSizes.size14} fontFamily={'$heading'}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default FeatureCard

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(1.5),
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    borderRadius: wp(4),
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: wp(1),
    alignItems: 'center',
    rowGap: hp(2),
  },
})
