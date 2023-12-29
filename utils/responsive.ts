import { Dimensions, PixelRatio, Platform } from 'react-native'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

export const isiPAD = viewportHeight / viewportWidth < 1.6
export const isTablet = viewportHeight / viewportWidth < 1.6

export const isIOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'

export function wp(percentage: number) {
  // Use PixelRatio.roundToNearestPixel method in order to round the layout
  // size (dp) to the nearest one that correspons to an integer number of pixels.
  return +PixelRatio.roundToNearestPixel((viewportWidth * percentage) / 100).toFixed(2)
}

export function hp(percentage: number) {
  // Use PixelRatio.roundToNearestPixel method in order to round the layout
  // size (dp) to the nearest one that correspons to an integer number of pixels.
  return +PixelRatio.roundToNearestPixel((viewportHeight * percentage) / 100).toFixed(2)
}
