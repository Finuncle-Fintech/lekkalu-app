import React, { FC } from 'react'
import { StyleProp, TouchableOpacity, View as RNView, ViewStyle } from 'react-native'
import { Label, Text, View, useTheme } from 'tamagui'
import { Popover } from 'native-base'
import { Feather } from '@expo/vector-icons'
import DatePicker from '../date-picker'
import { wp } from '@/utils/responsive'

interface IDatePickerWithLabelInfo {
  containerStyle?: StyleProp<ViewStyle>
  label: string
  infoText: string
  value: Date
  onChangeDate: (date: Date) => void
}

const DatePickerWithLabelInfo: FC<IDatePickerWithLabelInfo> = (props) => {
  const { label, containerStyle, infoText } = props
  const theme = useTheme()

  return (
    <RNView style={containerStyle}>
      <View fd="row" ai="center" columnGap={wp(2)}>
        <Label fontSize={'$5'}>{label}</Label>
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
                {infoText}
              </Text>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      </View>
      <DatePicker value={props.value} onChange={(date) => props.onChangeDate(date)} />
    </RNView>
  )
}

export default DatePickerWithLabelInfo
