import { Button, Checkbox, FormControl, Input, Pressable } from 'native-base'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Redirect } from 'expo-router'
import { ScrollView, Text, View, useTheme } from 'tamagui'
import { SignupSchema, signupSchema } from '@/schema/auth'
import { useAuthContext } from '@/hooks/use-auth'
import CustomFormControl from '@/components/form-control/form-control'

export default function Signup() {
  const { isAuthenticated, signupMutation } = useAuthContext()
  const theme = useTheme()

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

  const inputTextColor = theme.foreground.val

  return (
    <ScrollView
      bg="$background"
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
      p="$4"
    >
      <View bg="$muted" borderRadius={'$4'} p="$4" w={'100%'} rowGap="$4">
        <Text fontSize={'$9'} fontWeight="bold">
          Sign Up
        </Text>

        <View rowGap="$2">
          <FormControl isRequired isInvalid={'username' in errors}>
            <CustomFormControl.Label isRequired>Username</CustomFormControl.Label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  color={inputTextColor}
                  selectionColor={inputTextColor}
                  placeholder="Enter your username"
                  onChangeText={field.onChange}
                  size={'md'}
                  {...field}
                />
              )}
            />

            <FormControl.ErrorMessage>{errors.username?.message}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={'email' in errors}>
            <CustomFormControl.Label isRequired>Email</CustomFormControl.Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  color={inputTextColor}
                  selectionColor={inputTextColor}
                  placeholder="Enter your email address"
                  onChangeText={field.onChange}
                  size={'md'}
                  {...field}
                />
              )}
            />

            <FormControl.ErrorMessage>{errors.email?.message}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={'password' in errors}>
            <CustomFormControl.Label isRequired>Password</CustomFormControl.Label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  color={inputTextColor}
                  selectionColor={inputTextColor}
                  type="password"
                  placeholder="Enter your password"
                  onChangeText={field.onChange}
                  size={'md'}
                  {...field}
                />
              )}
            />

            <FormControl.ErrorMessage>{errors.password?.message}</FormControl.ErrorMessage>
          </FormControl>
        </View>

        <View py="$2" rowGap="$3">
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
                  bg={theme.muted.val}
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
                  bg={theme.muted.val}
                >
                  <Text mx={2}>I have read, understood and agreed to Finuncle&apos;s Privacy Policy</Text>
                </Checkbox>
              )}
            />

            <FormControl.ErrorMessage>{errors.privacyPolicy?.message}</FormControl.ErrorMessage>
          </FormControl>
        </View>

        <Button onPress={handleSubmit(handleSignup)} isLoading={signupMutation.isPending}>
          Submit
        </Button>

        <Link href="/login" asChild>
          <Pressable>
            <Text>Already have an account? Login</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  )
}
