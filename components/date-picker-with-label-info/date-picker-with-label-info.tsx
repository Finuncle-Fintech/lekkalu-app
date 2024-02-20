import React, { FC } from 'react'
import { StyleProp, TouchableOpacity, View as RNView, ViewStyle, useColorScheme } from 'react-native'
import { Label, Text, View, useTheme } from 'tamagui'
import { Popover } from 'native-base'
import { Feather } from '@expo/vector-icons'
import DatePicker from '../date-picker'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'

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
  const systemTheme = useColorScheme()

  return (
    <RNView style={containerStyle}>
      <View fd="row" ai="center" columnGap={wp(2)}>
        <Label pb={hp(0.8)} fontSize={FontSizes.size18}>
          {label}
        </Label>
        <Popover
          trigger={(triggerProps) => {
            return (
              <TouchableOpacity style={{ top: -4 }} hitSlop={15} {...triggerProps}>
                <Feather name="info" size={hp(2.5)} color={theme.foreground.get()} />
              </TouchableOpacity>
            )
          }}
        >
          <Popover.Content accessibilityLabel="Delete Customerd" w={wp(60)}>
            <Popover.Arrow bgColor={theme.backgroundHover.get()} />
            <Popover.Body bgColor={theme.backgroundHover.get()}>
              <Text
                color={systemTheme === 'dark' ? '$foreground' : '$background'}
                fontFamily={'$heading'}
                fontSize={FontSizes.size15}
              >
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
