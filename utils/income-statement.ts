import { InputField } from '@/types/input-fields'

export const getAddIncomeExpenseInputs = (): InputField[] => {
  return [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      id: 'type',
      label: 'Type',
      type: 'text',
    },
    {
      id: 'amount',
      label: 'Amount',
      type: 'number',
    },
  ]
}
