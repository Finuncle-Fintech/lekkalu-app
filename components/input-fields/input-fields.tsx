import { Control, Controller, ControllerRenderProps, FieldErrors, FieldValues } from 'react-hook-form'
import { CheckIcon, FormControl, Input, Select, TextArea } from 'native-base'
import { useCallback } from 'react'
import { omit } from 'lodash'
import MultiSelect from 'react-native-multiple-select'
import { useColorScheme } from 'react-native'
import { useTheme } from 'tamagui'
import { InputField } from '@/types/input-fields'
import DatePicker from '../date-picker'
import { theme } from '@/app/_layout'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'

type InputFieldsProps = {
  inputs: InputField[]
  control: Control<any>
  errors: FieldErrors
}

export default function InputFields({ inputs, control, errors }: InputFieldsProps) {
  const tamagtheme = useTheme()
  const systemTheme = useColorScheme()

  const inputColor = systemTheme === 'dark' ? 'white' : 'black'

  const getFieldInput = useCallback(
    (input: InputField, field: ControllerRenderProps<FieldValues, string>, errors: FieldErrors) => {
      switch (input.type) {
        case 'text': {
          return (
            <Input
              placeholder={input.label}
              onChangeText={field.onChange}
              color={inputColor}
              fontSize={FontSizes.size15}
              height={hp(5)}
              borderRadius={wp(1)}
              {...field}
            />
          )
        }

        case 'number': {
          return (
            <Input
              color={inputColor}
              {...field}
              value={field.value}
              keyboardType="numeric"
              placeholder={input.label}
              onChangeText={field.onChange}
              fontSize={FontSizes.size15}
              height={hp(5)}
              borderRadius={wp(1)}
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
              height={hp(5)}
              fontSize={FontSizes.size15}
              defaultValue={field.value?.toString()}
              selectedValue={field.value?.toString()}
              onValueChange={field.onChange}
              _text={{ style: { color: tamagtheme.foreground?.get() } }}
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
              fontSize={FontSizes.size15}
              itemFontSize={FontSizes.size15}
              selectedItems={field.value}
              onSelectedItemsChange={field.onChange}
              tagRemoveIconColor={theme.colors.primary['500']}
              tagBorderColor={theme.colors.primary['500']}
              tagTextColor={theme.colors.primary['500']}
              selectedItemTextColor={theme.colors.primary['500']}
              selectedItemIconColor={theme.colors.primary['500']}
              itemTextColor={tamagtheme.foreground.get()}
              styleSelectorContainer={{ backgroundColor: tamagtheme.background.get() }}
              styleInputGroup={{
                backgroundColor: tamagtheme.background.get(),
                paddingLeft: wp(3),
                paddingRight: wp(3),
                paddingVertical: hp(1),
              }}
              submitButtonColor={theme.colors.primary['500']}
              styleTextDropdown={{ paddingHorizontal: wp(3) }}
              styleTextDropdownSelected={{ paddingHorizontal: wp(3) }}
              styleDropdownMenuSubsection={{
                borderRadius: wp(1),
                backgroundColor: tamagtheme.backgroundHover.get(),
                paddingRight: wp(1.5),
              }}
              flatListProps={{
                contentContainerStyle: { backgroundColor: tamagtheme.background.get() },
              }}
              styleIndicator={{ top: -4 }}
            />
          )
        }

        case 'textarea': {
          console.log('Testaread===>', { input, field, errors })
          return (
            <TextArea
              size={'md'}
              autoCompleteType="none"
              {...field}
              placeholder={input.label}
              onChangeText={field.onChange}
              fontSize={FontSizes.size15}
              h={20}
              color={inputColor}
              isInvalid={input.id in errors}
            />
          )
        }

        default: {
          return (
            <Input
              color={inputColor}
              placeholder={input.label}
              onChangeText={field.onChange}
              fontSize={FontSizes.size15}
              height={hp(5)}
              borderRadius={wp(1)}
              {...field}
            />
          )
        }
      }
    },
    [],
  )

  return inputs.map((input) => (
    <FormControl key={input.id} isRequired={input.required} isInvalid={input.id in errors}>
      <FormControl.Label _text={{ style: { fontSize: FontSizes.size15, paddingBottom: hp(0.8) } }}>
        {input.label}
      </FormControl.Label>
      <Controller name={input.id} control={control} render={({ field }) => getFieldInput(input, field, errors)} />
      <FormControl.ErrorMessage>{errors[input.id]?.message}</FormControl.ErrorMessage>
    </FormControl>
  ))
}
