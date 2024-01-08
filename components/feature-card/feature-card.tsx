import React, { FC, ReactNode } from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'

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
      style={[styles.container, { backgroundColor: theme.backgroundStrong.val }, containerStyle]}
    >
      <View style={styles.iconContainer}>{image}</View>
      <Text numberOfLines={1} adjustsFontSizeToFit fontSize={'$2'} fontFamily={'$heading'}>
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
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    borderRadius: wp(4),
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: wp(1),
    alignItems: 'center',
    rowGap: hp(2),
  },
  iconContainer: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(7),
    backgroundColor: THEME_COLORS.primary[50] + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
