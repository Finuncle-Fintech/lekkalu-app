import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Redirect } from 'expo-router'
import { Button, Checkbox, H1, Input, Label, Stack, Text, XStack, YStack } from 'tamagui'
import { Check as CheckIcon } from '@tamagui/lucide-icons'
import { LoginSchema, loginSchema } from '../schema/auth'
import { useAuthContext } from '@/hooks/use-auth'
import FormControl from '@/components/form-control'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'

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
      <YStack bg="$dark" w="100%" borderRadius="$4" p="$4" space="$4">
        <YStack space="$2">
          <H1 fontWeight="bold">Log in</H1>
          <Text color="$colorFocus">Welcome back to finuncle!</Text>
        </YStack>

        <FormControl>
          <FormControl.Label fontSize={FontSizes.size15} isRequired>
            Username
          </FormControl.Label>

          <FormControl.Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                fontSize={FontSizes.size15}
                h={hp(5)}
                br={wp(1.8)}
                placeholder="Enter your username"
                onChangeText={field.onChange}
                {...field}
              />
            )}
          />

          <FormControl.ErrorMessage fontSize={FontSizes.size15}>{errors.username?.message}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl>
          <FormControl.Label isRequired>Password</FormControl.Label>
          <FormControl.Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                fontSize={FontSizes.size15}
                h={hp(5)}
                br={wp(1.8)}
                secureTextEntry
                placeholder="Enter your password"
                onChangeText={field.onChange}
                {...field}
              />
            )}
          />

          <FormControl.ErrorMessage fontSize={FontSizes.size15}>{errors.password?.message}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl>
          <FormControl.Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <XStack my={hp(0.5)} alignItems="center" space={wp(3.4)}>
                <Checkbox
                  id="rememberMe"
                  h={wp(5)}
                  w={wp(5)}
                  br={wp(1.2)}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                >
                  <Checkbox.Indicator>
                    <CheckIcon size={wp(3)} />
                  </Checkbox.Indicator>
                </Checkbox>

                <Label fontSize={FontSizes.size15} htmlFor="rememberMe">
                  Remember Me
                </Label>
              </XStack>
            )}
          />

          <FormControl.ErrorMessage fontSize={FontSizes.size15}>{errors.rememberMe?.message}</FormControl.ErrorMessage>
        </FormControl>

        <Button
          fontSize={FontSizes.size15}
          h={hp(5.5)}
          onPress={handleSubmit(handleLogin)}
          disabled={loginMutation.isPending}
          bg="$primary"
          color="white"
        >
          Login
        </Button>

        <Link href="/signup" asChild>
          <Button variant="outlined">
            <Text color="$color" fontSize={FontSizes.size15} ta="center">
              Don&rsquo;t have an account? Signup
            </Text>
          </Button>
        </Link>
      </YStack>
    </Stack>
  )
}
