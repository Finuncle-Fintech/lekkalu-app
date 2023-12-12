import { Control, Controller, ControllerRenderProps, FieldErrors, FieldValues } from 'react-hook-form'
import { CheckIcon, FormControl, Input, Select, TextArea } from 'native-base'
import { useCallback } from 'react'
import { omit } from 'lodash'
import MultiSelect from 'react-native-multiple-select'
import { InputField } from '@/types/input-fields'
import DatePicker from '../date-picker'
import { theme } from '@/app/_layout'

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

      case 'multi-select': {
        return (
          <MultiSelect
            items={input.options}
            uniqueKey="id"
            displayKey="label"
            selectedItems={field.value}
            onSelectedItemsChange={field.onChange}
            tagRemoveIconColor={theme.colors.primary['500']}
            tagBorderColor={theme.colors.primary['500']}
            tagTextColor={theme.colors.primary['500']}
            selectedItemTextColor={theme.colors.primary['500']}
            selectedItemIconColor={theme.colors.primary['500']}
            itemTextColor={theme.colors.black}
            styleSelectorContainer={{ backgroundColor: theme.colors.red['500'] }}
            submitButtonColor={theme.colors.primary['500']}
          />
        )
      }

      case 'textarea': {
        return (
          <TextArea autoCompleteType="none" {...field} placeholder={input.label} onChangeText={field.onChange} h={20} />
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
