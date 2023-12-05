import { Control, Controller, ControllerRenderProps, FieldErrors, FieldValues } from 'react-hook-form'
import { CheckIcon, FormControl, Input, Select } from 'native-base'
import { useCallback } from 'react'
import { omit } from 'lodash'
import { InputField } from '@/types/input-fields'
import DatePicker from '../date-picker'

type InputFieldsProps = {
  inputs: InputField[]
  control: Control<any>
  errors: FieldErrors
}

export default function InputFields({ inputs, control, errors }: InputFieldsProps) {
  const getFieldInput = useCallback((input: InputField, field: ControllerRenderProps<FieldValues, string>) => {
    switch (input.type) {
      case 'text': {
        return <Input placeholder={input.label} onChangeText={field.onChange} {...field} />
      }

      case 'number': {
        return (
          <Input
            {...field}
            value={field.value}
            keyboardType="numeric"
            placeholder={input.label}
            onChangeText={field.onChange}
          />
        )
      }

      case 'date': {
        return <DatePicker {...field} />
      }

      case 'select': {
        return (
          <Select
            {...omit(field, 'ref', 'value')}
            placeholder={input.label}
            _selectedItem={{
              bg: 'blue.100',
              endIcon: <CheckIcon size={5} />,
            }}
            defaultValue={field.value?.toString()}
            selectedValue={field.value?.toString()}
            onValueChange={field.onChange}
          >
            {input.options.map((option) => (
              <Select.Item key={option.id} label={option.label} value={option.id?.toString()} />
            ))}
          </Select>
        )
      }

      default: {
        return <Input placeholder={input.label} onChangeText={field.onChange} {...field} />
      }
    }
  }, [])

  return inputs.map((input) => (
    <FormControl key={input.id} isRequired={input.required} isInvalid={input.id in errors}>
      <FormControl.Label>{input.label}</FormControl.Label>
      <Controller name={input.id} control={control} render={({ field }) => getFieldInput(input, field)} />

      <FormControl.ErrorMessage>{errors[input.id]?.message}</FormControl.ErrorMessage>
    </FormControl>
  ))
}
