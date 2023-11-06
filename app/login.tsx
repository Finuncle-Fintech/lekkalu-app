import { Box, Button, Checkbox, FormControl, Input, Pressable, Text, VStack } from 'native-base'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Redirect, router } from 'expo-router'
import { LoginSchema, loginSchema } from '../schema/auth'
import { useAuthContext } from '@/hooks/use-auth'

export default function Login() {
  const { tokenData, loginMutation } = useAuthContext()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const handleLogin = (values: LoginSchema) => {
    loginMutation.mutate(values)
    router.replace('/(drawer)/SipCalculator')
  }

  if (!tokenData) {
    return <Redirect href="/(drawer)/SipCalculator/" />
  }

  return (
    <Box flex={1} bg="brand.900" alignItems="center" justifyContent="center">
      <VStack maxW="sm" w="full" bg="white" rounded="lg" p="4" space={4}>
        <Box>
          <Text fontSize="3xl" fontWeight="bold">
            Log in
          </Text>
          <Text color="gray.500">Welcome back to finuncle!</Text>
        </Box>

        <FormControl isRequired isInvalid={'username' in errors}>
          <FormControl.Label>Username</FormControl.Label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => <Input placeholder="Enter your username" onChangeText={field.onChange} {...field} />}
          />

          <FormControl.ErrorMessage>{errors.username?.message}</FormControl.ErrorMessage>
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

        <FormControl isInvalid={'rememberMe' in errors}>
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                value="rememberMe"
                isChecked={field.value}
                onChange={(value) => {
                  field.onChange(value)
                }}
              >
                <Text mx={2}>Remember Me</Text>
              </Checkbox>
            )}
          />

          <FormControl.ErrorMessage>{errors.password?.message}</FormControl.ErrorMessage>
        </FormControl>
        <Link href={'/(drawer)/home'} style={{ marginTop: 16, fontSize: 18 }}>
          {/* <Text>Hellosd</Text> */}
          <Button onPress={handleSubmit(handleLogin)}>Submit</Button>
        </Link>
        <Link href="/signup" asChild>
          <Pressable>
            <Text color="gray.500">Don&rsquo;t have an account? Signup</Text>
          </Pressable>
        </Link>
      </VStack>
    </Box>
  )
}
