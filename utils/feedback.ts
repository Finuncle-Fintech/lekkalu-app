import { InputField } from '@/types/input-fields'

export const FEEDBACK_FIELDS: InputField[] = [
  {
    type: 'text',
    id: 'name',
    label: 'Name',
    required: true,
  },
  {
    type: 'text',
    id: 'email',
    label: 'Email',
    required: true,
  },
  {
    type: 'textarea',
    id: 'subject_and_description',
    label: 'Message',
    required: true,
  },
]
