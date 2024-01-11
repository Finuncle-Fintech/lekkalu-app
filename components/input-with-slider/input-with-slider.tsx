import { Feather } from '@expo/vector-icons'
import React, { Dispatch, FC, SetStateAction, memo, useState } from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { Input, Label, Text, View, useTheme } from 'tamagui'
import { Popover } from 'native-base'
import Slider from '@react-native-community/slider'
import debounce from 'lodash/debounce'
import { wp } from '@/utils/responsive'

interface IInputWithSliderProps {
  label: string
  containerStyle?: StyleProp<ViewStyle>
  sliderMaxValue: number
  defaultValue?: string
  setValue: Dispatch<SetStateAction<string>>
  showInfoTooltip?: boolean
  tooltipText?: string
  sliderstep?: number
  allowFractionDigits?: boolean
}

const InputWithSlider: FC<IInputWithSliderProps> = ({
  label,
  containerStyle,
  setValue,
  sliderMaxValue = 100,
  defaultValue = '0',
  tooltipText = '',
  showInfoTooltip = false,
  sliderstep = 0,
  allowFractionDigits = true,
}) => {
  const theme = useTheme()
  const [localvalue, setLocalValue] = useState(defaultValue)

  const debouncedSetValue = debounce(setValue, 300)

  const handleInputValueChange = (text: string) => {
    let parsedValue = ''

    if (allowFractionDigits) {
      parsedValue = text.trim().replace(' ', '')
    } else {
      parsedValue = (+text.trim().replace(' ', '').replace('.', '')).toString()
    }

    if (isNaN(+parsedValue)) {
      return
    }
    setLocalValue(parsedValue)
    debouncedSetValue(parsedValue)
  }

  const handleSliderValueChange = (val: number) => {
    const newVal = allowFractionDigits ? parseFloat(val.toString()).toFixed(2) : val.toString()
    debouncedSetValue(newVal)
    setLocalValue(newVal)
  }

  return (
    <View style={containerStyle}>
      <View fd="row" ai="center" columnGap={wp(2)}>
        <Label fontSize={'$5'}>{label}</Label>
        {!!showInfoTooltip && (
          <Popover
            trigger={(triggerProps) => {
              return (
                <TouchableOpacity hitSlop={15} {...triggerProps}>
                  <Feather name="info" size={wp(5)} color={theme.foreground.get()} />
                </TouchableOpacity>
              )
            }}
          >
            <Popover.Content accessibilityLabel="Delete Customerd" w="56">
              <Popover.Arrow bgColor={theme.backgroundHover.get()} />
              <Popover.Body bgColor={theme.backgroundHover.get()}>
                <Text color={'$foreground'} fontFamily={'$heading'} fontSize={'$4'} lineHeight={'$1'}>
                  {tooltipText}
                </Text>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        )}
      </View>
      <Input value={localvalue} onChangeText={handleInputValueChange} />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={sliderMaxValue}
        minimumTrackTintColor="#003562"
        maximumTrackTintColor="#e1e1e1"
        thumbTintColor="#003562"
        onValueChange={handleSliderValueChange}
        step={sliderstep}
      />
    </View>
  )
}

export default memo(InputWithSlider)

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: 34,
  },
})
