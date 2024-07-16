import { InputField } from '@/types/input-fields'

export const LIABILITIY_INPUTS_FOR_SCENARIO: InputField[] = [
  {
    id: 'name',
    label: 'Loan Name',
    type: 'text',
    required: true,
  },
  {
    id: 'principal',
    label: 'Principal',
    type: 'number',
    required: true,
  },
  {
    id: 'disbursement_date',
    label: 'Disbursement Date',
    type: 'date',
    defaultDate: undefined,
    required: true,
  },
  {
    id: 'interest_rate',
    label: 'Interest',
    type: 'number',
    required: true,
  },
  {
    id: 'tenure',
    label: 'Tenure',
    type: 'number',
    required: true,
  },
  {
    id: 'balance',
    label: 'Balance',
    type: 'number',
  },
  {
    id: 'emi_day',
    label: 'EMI Day',
    type: 'number',
  },
  {
    id: 'emi',
    label: 'EMI',
    type: 'number',
  },
  {
    id: 'closure_charges',
    label: 'Closure Charges',
    type: 'number',
  },
]
