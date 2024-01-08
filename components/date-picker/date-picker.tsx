import { Button, Icon } from 'native-base'
import { Fontisto } from '@expo/vector-icons'
import { useState } from 'react'
import dayjs from 'dayjs'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { SERVER_DATE_FORMAT } from '@/utils/constants'

export type DatePickerProps = {
  placeholder?: string
  value?: Date
  onChange?: (date: Date) => void
}

export default function DatePicker({ placeholder, value, onChange }: DatePickerProps) {
  const [date, setDate] = useState(value ?? dayjs().toDate())

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

  const _placeholder = placeholder ?? 'Select Date'

  const showDatePicker = () => {
    setIsDatePickerVisible(true)
  }

  return (
    <>
      <Button variant="outline" endIcon={<Icon as={Fontisto} name="date" />} onPress={showDatePicker}>
        {dayjs(date).format(SERVER_DATE_FORMAT) ?? _placeholder}
      </Button>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        display="inline"
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
