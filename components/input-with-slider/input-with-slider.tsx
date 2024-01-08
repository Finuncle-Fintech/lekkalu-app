import { Feather } from '@expo/vector-icons'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Input, Label, Slider, Text, useTheme } from 'tamagui'
import { Popover } from 'native-base'
import { wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'

interface IInputWithSliderProps {
  label: string
  containerStyle?: StyleProp<ViewStyle>
  sliderMaxValue: number
  value: string
  setValue: Dispatch<SetStateAction<string>>
  showInfoTooltip?: boolean
  tooltipText?: string
}

const InputWithSlider: FC<IInputWithSliderProps> = ({
  label,
  containerStyle,
  setValue,
  sliderMaxValue = 100,
  value = '0',
  tooltipText = '',
  showInfoTooltip = false,
}) => {
  const theme = useTheme()

  return (
    <View style={containerStyle}>
      <View style={styles.labelContainer}>
        <Label fontSize={'$5'}>{label}</Label>
        {!!showInfoTooltip && (
          <Popover
            trigger={(triggerProps) => {
              return (
                <TouchableOpacity hitSlop={15} {...triggerProps}>
                  <Feather name="info" size={wp(5)} color={theme.foreground.val} />
                </TouchableOpacity>
              )
            }}
          >
            <Popover.Content accessibilityLabel="Delete Customerd" w="56">
              <Popover.Arrow />
              <Popover.Body>
                <Text color={theme.foreground.val} fontFamily={'$heading'} fontSize={'$4'} lineHeight={'$1'}>
                  {tooltipText}
                </Text>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        )}
      </View>
      <Input
        value={value.toString()}
        onChangeText={(text) => {
          const parsedValue = text.trim().replace(' ', '')
          if (isNaN(+parsedValue)) {
            return
          }
          setValue(parsedValue)
        }}
      />
      <Slider
        value={[value]}
        onValueChange={(val) => setValue(val[0])}
        mt="$4"
        size="$4"
        width={'100%'}
        max={sliderMaxValue}
      >
        <Slider.Track>
          <Slider.TrackActive backgroundColor={THEME_COLORS.primary[50]} />
        </Slider.Track>
        <Slider.Thumb backgroundColor={THEME_COLORS.primary[50]} circular index={0} size={'$1'} />
      </Slider>
    </View>
  )
}

export default InputWithSlider

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: wp(2),
  },
})
