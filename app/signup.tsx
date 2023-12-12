import { Button, Checkbox, FormControl, Input, Pressable, ScrollView, Text, VStack } from 'native-base'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Redirect } from 'expo-router'
import { SignupSchema, signupSchema } from '@/schema/auth'
import { useAuthContext } from '@/hooks/use-auth'

export default function Signup() {
  const { isAuthenticated, signupMutation } = useAuthContext()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      termsAndConditions: false,
      privacyPolicy: false,
    },
  })

  const handleSignup = (values: SignupSchema) => {
    signupMutation.mutate(values)
  }

  if (isAuthenticated) {
    return <Redirect href="/dashboard" />
  }

  return (
    <ScrollView bg="brand.900" contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <VStack maxW="sm" w="full" bg="white" rounded="lg" p="4" space={4}>
        <Text fontSize="3xl" fontWeight="bold">
          Sign Up
        </Text>

        <FormControl isRequired isInvalid={'username' in errors}>
          <FormControl.Label>Username</FormControl.Label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => <Input placeholder="Enter your username" onChangeText={field.onChange} {...field} />}
          />

          <FormControl.ErrorMessage>{errors.username?.message}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={'email' in errors}>
          <FormControl.Label>Email</FormControl.Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input placeholder="Enter your email address" onChangeText={field.onChange} {...field} />
            )}
          />

          <FormControl.ErrorMessage>{errors.email?.message}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={'password' in errors}>
          <FormControl.Label>Password</FormControl.Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input type="password" placeholder="Enter your password" onChangeText={field.onChange} {...field} />
            )}
          />

          <FormControl.ErrorMessage>{errors.password?.message}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isInvalid={'termsAndConditions' in errors}>
          <Controller
            name="termsAndConditions"
            control={control}
            render={({ field }) => (
              <Checkbox
                value="termsAndConditions"
                isChecked={field.value}
                onChange={(value) => {
                  field.onChange(value)
                }}
              >
                <Text mx={2}>I have read, understood and agreed to Finuncle&apos;s Terms and Conditions</Text>
              </Checkbox>
            )}
          />

          <FormControl.ErrorMessage>{errors.termsAndConditions?.message}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isInvalid={'privacyPolicy' in errors}>
          <Controller
            name="privacyPolicy"
            control={control}
            render={({ field }) => (
              <Checkbox
                value="privacyPolicy"
                isChecked={field.value}
                onChange={(value) => {
                  field.onChange(value)
                }}
              >
                <Text mx={2}>I have read, understood and agreed to Finuncle&apos;s Privacy Policy</Text>
              </Checkbox>
            )}
          />

          <FormControl.ErrorMessage>{errors.privacyPolicy?.message}</FormControl.ErrorMessage>
        </FormControl>

        <Button onPress={handleSubmit(handleSignup)} isLoading={signupMutation.isPending}>
          Submit
        </Button>

        <Link href="/login" asChild>
          <Pressable>
            <Text color="gray.500">Already have an account? Login</Text>
          </Pressable>
        </Link>
      </VStack>
    </ScrollView>
  )
}
