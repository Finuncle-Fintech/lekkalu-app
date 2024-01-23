import React, { FC } from 'react'
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { router } from 'expo-router'
import { Entypo } from '@expo/vector-icons'
import { useTheme } from 'tamagui'

import { hp, isTablet, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'

interface BackButtonProps {
  style?: ViewStyle
  onPress?: () => void
}

const BackButton: FC<BackButtonProps> = ({ style, onPress }) => {
  const theme = useTheme()
  return (
    <TouchableOpacity onPress={onPress || router.back} style={[styles.back, style]}>
      <Entypo name="chevron-thin-left" size={wp(5)} color={theme.foreground.get()} />
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
  back: {
    height: isTablet ? hp(5) : wp(10),
    width: isTablet ? hp(5) : wp(10),
    backgroundColor: THEME_COLORS.primary[100] + 20,
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
})
