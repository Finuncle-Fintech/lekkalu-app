import { ActivityIndicator } from 'react-native'
import React from 'react'
import { Button, ButtonProps, Spinner, TextContextStyles } from 'tamagui'
import { THEME_COLORS } from '@/utils/theme'
import { View,Text } from 'tamagui'
import { wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'

interface CustomButtonProps {
  text: string
  onPress: () => void
  hasLikeOutline?: boolean
  isLoading?: boolean
  isDisable?: boolean
  textStyle?: TextContextStyles
  buttonStyle?: ButtonProps
}

const CustomButton: React.FC<CustomButtonProps> = ({
  hasLikeOutline = false,
  onPress,
  text,
  isLoading = false,
  isDisable = false,
  textStyle,
  buttonStyle
}) => {
  return (
    <Button
      themeInverse
      size={wp(10)}
      paddingHorizontal={wp(10)}
      backgroundColor={THEME_COLORS.primary[700]}
      onPress={onPress}
      disabled={isDisable}
      flex={1}
      {...buttonStyle}
      {...hasLikeOutline ? {borderColor:THEME_COLORS.primary[700],borderWidth:0.5,backgroundColor:'white'}: null}
      {...(isLoading || isDisable) ? {opacity:0.5} : null}
      
    >
      <View flexDirection='row' gap={wp(1)}>
        {isLoading && <Spinner size="small" color={THEME_COLORS.primary[50]} />}
        {!isLoading && <Text fontSize={FontSizes.size20} {...textStyle} {...hasLikeOutline ? {color:'black'} : {color:'white'}}>{text}</Text>}
      </View>
    </Button>
  )
}

export default CustomButton
