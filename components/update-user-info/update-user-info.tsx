import { Button, Divider, FormControl, Heading, Input, VStack, useToast } from 'native-base'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserProfileSchema, userProfileSchema } from '@/schema/user'

export default function UpdateUserInfo() {
  const toast = useToast()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileSchema>({
    resolver: zodResolver(userProfileSchema),
  })

  const handleUpdateProfile = () => {
    toast.show({
      title: 'Feature under development!',
      description: 'This feature is still under development and will be available soon!',
    })
  }

  return (
    <VStack space={4} p={4} rounded="md" bg="white">
      <Heading>Update your info</Heading>
      <Divider />

      <FormControl isRequired isInvalid={'first_name' in errors}>
        <FormControl.Label>First name</FormControl.Label>
        <Controller
          name="first_name"
          control={control}
          render={({ field }) => <Input placeholder="Enter your first name" onChangeText={field.onChange} {...field} />}
        />

        <FormControl.ErrorMessage>{errors.first_name?.message}</FormControl.ErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={'last_name' in errors}>
        <FormControl.Label>Last name</FormControl.Label>
        <Controller
          name="last_name"
          control={control}
          render={({ field }) => <Input placeholder="Enter your last name" onChangeText={field.onChange} {...field} />}
        />

        <FormControl.ErrorMessage>{errors.last_name?.message}</FormControl.ErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={'email' in errors}>
        <FormControl.Label>Email</FormControl.Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input placeholder="Enter your email" onChangeText={field.onChange} {...field} />}
        />

        <FormControl.ErrorMessage>{errors.email?.message}</FormControl.ErrorMessage>
      </FormControl>

      <Button onPress={handleSubmit(handleUpdateProfile)}>Update</Button>
    </VStack>
  )
}
