import { InputField, Option } from '@/types/input-fields'

export const getAddIncomeExpenseInputs = (typeOptions?: Option[]): InputField[] => {
  return [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      id: 'type',
      label: 'Type',
      type: 'select',
      valueKey: 'label',
      options: typeOptions || [],
      required: true,
    },
    {
      id: 'amount',
      label: 'Amount',
      type: 'number',
      required: true,
    },
  ]
}
