import React, { FC } from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Label, Text, useTheme } from 'tamagui'
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
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelContainer}>
        <Label fontSize={'$5'}>{label}</Label>
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
                {infoText}
              </Text>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      </View>
      <DatePicker value={props.value} onChange={(date) => props.onChangeDate(date)} />
    </View>
  )
}

export default DatePickerWithLabelInfo

const styles = StyleSheet.create({
  container: {},
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: wp(2),
  },
})
