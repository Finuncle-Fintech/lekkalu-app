import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { THEME_COLORS } from '@/utils/theme'

const LoaderOverlay = () => {
  return <ActivityIndicator color={THEME_COLORS.primary[100]} size={'large'} style={styles.loaderStyle} />
}

export default LoaderOverlay

const styles = StyleSheet.create({
  loaderStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000095',
    zIndex: 999999,
  },
})
