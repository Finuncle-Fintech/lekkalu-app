import { FormControl, Input, Pressable } from 'native-base'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Redirect } from 'expo-router'
import { ScrollView, Text, View, XStack, useTheme, Checkbox, Label, Button, Spinner } from 'tamagui'
import { Check } from '@tamagui/lucide-icons'

import { SignupSchema, signupSchema } from '@/schema/auth'
import { useAuthContext } from '@/hooks/use-auth'
import CustomFormControl from '@/components/form-control/form-control'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'

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

  const inputTextColor = theme.foreground.get()

  return (
    <ScrollView
      bg="$background"
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
      p={wp(4)}
    >
      <View bg="$muted" borderRadius={wp(4)} p={wp(4)} w={'100%'} rowGap={hp(2)}>
        <Text fontSize={FontSizes.size34} fontWeight="bold">
          Sign Up
        </Text>

        <View rowGap={hp(1)}>
          <FormControl isRequired isInvalid={'username' in errors}>
            <CustomFormControl.Label fontSize={FontSizes.size15} isRequired>
              Username
            </CustomFormControl.Label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  color={inputTextColor}
                  fontSize={FontSizes.size15}
                  h={hp(5)}
                  borderRadius={wp(1.8)}
                  selectionColor={inputTextColor}
                  placeholder="Enter your username"
                  onChangeText={field.onChange}
                  size={'md'}
                  {...field}
                />
              )}
            />

            <FormControl.ErrorMessage _text={{ fontSize: FontSizes.size15 }}>
              {errors.username?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={'email' in errors}>
            <CustomFormControl.Label fontSize={FontSizes.size15} isRequired>
              Email
            </CustomFormControl.Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  color={inputTextColor}
                  fontSize={FontSizes.size15}
                  h={hp(5)}
                  borderRadius={wp(1.8)}
                  selectionColor={inputTextColor}
                  placeholder="Enter your email address"
                  onChangeText={field.onChange}
                  size={'md'}
                  {...field}
                />
              )}
            />

            <FormControl.ErrorMessage _text={{ fontSize: FontSizes.size15 }}>
              {errors.email?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={'password' in errors}>
            <CustomFormControl.Label fontSize={FontSizes.size15} isRequired>
              Password
            </CustomFormControl.Label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  color={inputTextColor}
                  fontSize={FontSizes.size15}
                  h={hp(5)}
                  borderRadius={wp(1.8)}
                  selectionColor={inputTextColor}
                  type="password"
                  placeholder="Enter your password"
                  onChangeText={field.onChange}
                  size={'md'}
                  {...field}
                />
              )}
            />

            <FormControl.ErrorMessage _text={{ fontSize: FontSizes.size15 }}>
              {errors.password?.message}
            </FormControl.ErrorMessage>
          </FormControl>
        </View>

        <View py={hp(1)} rowGap={hp(1.5)}>
          <FormControl isInvalid={'termsAndConditions' in errors}>
            <Controller
              name="termsAndConditions"
              control={control}
              render={({ field }) => (
                <XStack my={hp(0.5)} alignItems="center" space={wp(3)}>
                  <Checkbox
                    id="termsAndConditions"
                    h={wp(5)}
                    w={wp(5)}
                    br={wp(1.2)}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    bg={'$muted'}
                  >
                    <Checkbox.Indicator>
                      <Check size={wp(3)} />
                    </Checkbox.Indicator>
                  </Checkbox>

                  <Label f={1} fontSize={FontSizes.size15} lineHeight={hp(2.5)} htmlFor="termsAndConditions">
                    I have read, understood and agreed to Finuncle&apos;s Terms and Conditions
                  </Label>
                </XStack>
              )}
            />

            <FormControl.ErrorMessage fontSize={FontSizes.size15}>
              {errors.termsAndConditions?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={'privacyPolicy' in errors}>
            <Controller
              name="privacyPolicy"
              control={control}
              render={({ field }) => (
                <XStack my={hp(0.5)} alignItems="center" space={wp(3)}>
                  <Checkbox
                    id="privacyPolicy"
                    h={wp(5)}
                    w={wp(5)}
                    br={wp(1.2)}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    bg={'$muted'}
                  >
                    <Checkbox.Indicator>
                      <Check size={wp(3)} />
                    </Checkbox.Indicator>
                  </Checkbox>

                  <Label f={1} fontSize={FontSizes.size15} lineHeight={hp(2.5)} htmlFor="privacyPolicy">
                    I have read, understood and agreed to Finuncle&apos;s Privacy Policy
                  </Label>
                </XStack>
              )}
            />

            <FormControl.ErrorMessage fontSize={FontSizes.size15}>
              {errors.privacyPolicy?.message}
            </FormControl.ErrorMessage>
          </FormControl>
        </View>

        <Button
          fontSize={FontSizes.size15}
          h={hp(5.5)}
          onPress={handleSubmit(handleSignup)}
          bg="$primary"
          color="white"
          disabled={signupMutation.isPending}
        >
          {signupMutation?.isPending && <Spinner color={'$backgroundFocus'} />}
          Submit
        </Button>

        <Link href="/login" asChild>
          <Pressable>
            <Text fontSize={FontSizes.size15}>Already have an account? Login</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  )
}
