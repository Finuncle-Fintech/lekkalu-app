import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Redirect } from 'expo-router'
import { Button, Checkbox, H1, Input, Label, Stack, Text, XStack, YStack } from 'tamagui'
import { Check as CheckIcon } from '@tamagui/lucide-icons'
import { LoginSchema, loginSchema } from '../schema/auth'
import { useAuthContext } from '@/hooks/use-auth'
import FormControl from '@/components/form-control'

export default function Login() {
  const { isAuthenticated, loginMutation } = useAuthContext()

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
  }

  if (isAuthenticated) {
    return <Redirect href="/dashboard" />
  }

  return (
    <Stack flex={1} bg="$background" alignItems="center" justifyContent="center" p="$4">
      <YStack bg="$muted" w="100%" borderRadius="$4" p="$4" space="$4">
        <YStack space="$2">
          <H1 fontWeight="bold">Log in</H1>
          <Text color="$colorFocus">Welcome back to finuncle!</Text>
        </YStack>

        <FormControl>
          <FormControl.Label isRequired>Username</FormControl.Label>

          <Controller
            name="username"
            control={control}
            render={({ field }) => <Input placeholder="Enter your username" onChangeText={field.onChange} {...field} />}
          />

          <FormControl.ErrorMessage>{errors.username?.message}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl>
          <FormControl.Label isRequired>Password</FormControl.Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input secureTextEntry placeholder="Enter your password" onChangeText={field.onChange} {...field} />
            )}
          />

          <FormControl.ErrorMessage>{errors.password?.message}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl>
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <XStack alignItems="center" space="$4">
                <Checkbox id="rememberMe" size="$4" checked={field.value} onCheckedChange={field.onChange}>
                  <Checkbox.Indicator>
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox>

                <Label size="$4" htmlFor="rememberMe">
                  Remember Me
                </Label>
              </XStack>
            )}
          />

          <FormControl.ErrorMessage>{errors.rememberMe?.message}</FormControl.ErrorMessage>
        </FormControl>

        <Button onPress={handleSubmit(handleLogin)} disabled={loginMutation.isPending} bg="$primary" color="white">
          Login
        </Button>

        <Link href="/signup" asChild>
          <Button variant="outlined">
            <Text color="$color" ta="center">
              Don&rsquo;t have an account? Signup
            </Text>
          </Button>
        </Link>
      </YStack>
    </Stack>
  )
}
