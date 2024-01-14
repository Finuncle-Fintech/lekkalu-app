import { Button, Icon } from 'native-base'
import { Fontisto } from '@expo/vector-icons'
import { useState } from 'react'
import dayjs from 'dayjs'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useColorScheme } from 'react-native'

import { SERVER_DATE_FORMAT } from '@/utils/constants'
import { hp, isTablet, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'

export type DatePickerProps = {
  placeholder?: string
  value?: Date
  onChange?: (date: Date) => void
}

export default function DatePicker({ placeholder, value, onChange }: DatePickerProps) {
  const [date, setDate] = useState(value ?? dayjs().toDate())
  const systemTheme = useColorScheme()

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

  const _placeholder = placeholder ?? 'Select Date'

  const showDatePicker = () => {
    setIsDatePickerVisible(true)
  }

  return (
    <>
      <Button
        height={hp(5)}
        _text={{
          style: { fontSize: FontSizes.size15, color: systemTheme === 'dark' ? 'white' : THEME_COLORS.primary[600] },
        }}
        variant="outline"
        endIcon={
          <Icon
            as={Fontisto}
            name="date"
            size={isTablet ? hp(1.5) : wp(4)}
            style={{ marginHorizontal: wp(1) }}
            color={systemTheme === 'dark' ? 'white' : THEME_COLORS.primary[600]}
          />
        }
        onPress={showDatePicker}
      >
        {dayjs(date).format(SERVER_DATE_FORMAT) ?? _placeholder}
      </Button>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        display="spinner"
        onCancel={() => setIsDatePickerVisible(false)}
        onConfirm={(date) => {
          onChange?.(date)
          setDate(date)
          setIsDatePickerVisible(false)
        }}
        date={date}
      />
    </>
  )
}
