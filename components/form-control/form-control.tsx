import { Stack } from 'tamagui'
import { Controller } from 'react-hook-form'
import Label from './components/label'
import ErrorMessage from './components/error-message'

type FormControlProps = {
  children: React.ReactNode
}

export default function FormControl({ children }: FormControlProps) {
  return <Stack space="$1">{children}</Stack>
}

FormControl.Label = Label
FormControl.ErrorMessage = ErrorMessage
FormControl.Controller = Controller
