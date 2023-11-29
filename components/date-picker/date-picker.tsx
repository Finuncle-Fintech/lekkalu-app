import { Button, Icon } from 'native-base'
import { Fontisto } from '@expo/vector-icons'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { useState } from 'react'
import dayjs from 'dayjs'
import { SERVER_DATE_FORMAT } from '@/utils/constants'

export type DatePickerProps = {
  placeholder?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
}

export default function DatePicker({ placeholder, value, onChange }: DatePickerProps) {
  const [date, setDate] = useState(value ?? dayjs().toDate())
  const _placeholder = placeholder ?? 'Select Date'

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (_, selectedDate) => {
        setDate(selectedDate ?? dayjs().toDate())
        onChange?.(selectedDate)
      },
    })
  }

  return (
    <Button variant="outline" endIcon={<Icon as={Fontisto} name="date" />} onPress={showDatePicker}>
      {dayjs(date).format(SERVER_DATE_FORMAT) ?? _placeholder}
    </Button>
  )
}
