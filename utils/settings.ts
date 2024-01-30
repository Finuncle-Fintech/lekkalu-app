import { InputField } from '@/types/input-fields'

const FEEDBACK_FIELDS: InputField[] = [
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

const RESET_PASSWORD_FIELDS: InputField[] = [
  {
    id: 'email',
    label: 'Email',
    type: 'text',
    required: true,
  },
]

const EDIT_PROFILE_FIELDS: InputField[] = [
  {
    id: 'first_name',
    label: 'First Name',
    type: 'text',
    required: true,
  },
  {
    id: 'last_name',
    label: 'Last Name',
    type: 'text',
    required: true,
  },
  {
    id: 'username',
    label: 'Username',
    type: 'text',
    required: true,
  },
]

const VERIFY_EMAIL_FIELDS: InputField[] = [
  {
    id: 'email',
    label: 'Email',
    type: 'text',
    required: true,
  },
]

export { FEEDBACK_FIELDS, RESET_PASSWORD_FIELDS, EDIT_PROFILE_FIELDS, VERIFY_EMAIL_FIELDS }
