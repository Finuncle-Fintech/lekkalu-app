import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Divider, FormControl, Heading, Input, VStack, useToast } from 'native-base'
import { ChangePasswordSchema, changePasswordSchema } from '@/schema/user'

export default function ChangePassword() {
  const toast = useToast()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  })

  const handleChangePassword = () => {
    toast.show({
      title: 'Feature under development!',
      description: 'This feature is still under development and will be available soon!',
    })
  }

  return (
    <VStack space={4} p={4} rounded="md" bg="white">
      <Heading>Change Password</Heading>
      <Divider />

      <FormControl isRequired isInvalid={'current_password' in errors}>
        <FormControl.Label>Current Password</FormControl.Label>
        <Controller
          name="current_password"
          control={control}
          render={({ field }) => (
            <Input type="password" placeholder="Enter your current password" onChangeText={field.onChange} {...field} />
          )}
        />

        <FormControl.ErrorMessage>{errors.current_password?.message}</FormControl.ErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={'new_password' in errors}>
        <FormControl.Label>New Password</FormControl.Label>
        <Controller
          name="new_password"
          control={control}
          render={({ field }) => (
            <Input type="password" placeholder="Enter your new password" onChangeText={field.onChange} {...field} />
          )}
        />

        <FormControl.ErrorMessage>{errors.new_password?.message}</FormControl.ErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={'confirm_password' in errors}>
        <FormControl.Label>Confirm Password</FormControl.Label>
        <Controller
          name="confirm_password"
          control={control}
          render={({ field }) => (
            <Input type="password" placeholder="Confirm Password" onChangeText={field.onChange} {...field} />
          )}
        />

        <FormControl.ErrorMessage>{errors.confirm_password?.message}</FormControl.ErrorMessage>
      </FormControl>

      <Button onPress={handleSubmit(handleChangePassword)}>Change</Button>
    </VStack>
  )
}
