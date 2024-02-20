import { InputField, Option } from '@/types/input-fields'

export const getAddIncomeExpenseInputs = (typeOptions?: Option[]): InputField[] => {
  return [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      id: 'type',
      label: 'Type',
      type: 'select',
      valueKey: 'label',
      options: typeOptions || [],
    },
    {
      id: 'amount',
      label: 'Amount',
      type: 'number',
    },
  ]
}
