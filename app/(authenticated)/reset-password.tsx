import React from 'react'
import { Linking, StyleSheet } from 'react-native'
import { Text, View, Button } from 'tamagui'
import { useForm } from 'react-hook-form'
import { router, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { IntentLauncherParams, startActivityAsync } from 'expo-intent-launcher'
import { useToast } from 'native-base'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChangePasswordSchema, changePasswordSchema } from '@/schema/settings'
import { hp, isAndroid, isIOS, wp } from '@/utils/responsive'
import LoaderOverlay from '@/components/loader-overlay'
import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import KeyboardScrollView from '@/components/keyboard-scroll-view'
import InputFields from '@/components/input-fields'
import { RESET_PASSWORD_FIELDS } from '@/utils/settings'
import { useResetPassword } from '@/queries/settings'
import { useGetUserDetails } from '@/queries/auth'

export default function ResetPassword() {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams()
  const toast = useToast()
  const isForgotPassword = !!params?.isForgotPassword
  const { data: userData } = useGetUserDetails()
  const { control, handleSubmit, formState, reset } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      email: isForgotPassword ? '' : userData?.email || '',
    },
  })
  const { mutate, status } = useResetPassword(reset)

  const handleSendLink = (values: ChangePasswordSchema) => {
    mutate({ email: values.email })
  }

  const handleOpenMailClientError = (e?: any) => {
    console.log('🚀 ~ handleOpenMailClientError ~ e:', e)
    toast.show({
      title: 'Failed to open mail app! Please open it manually',
    })
  }

  const openMailClientIOS = () => {
    Linking.canOpenURL('message:0')
      .then((supported) => {
        if (!supported) {
          handleOpenMailClientError()
        } else {
          return Linking.openURL('message:0').catch(handleOpenMailClientError)
        }
      })
      .catch(handleOpenMailClientError)
  }

  const openMailClientAndroid = () => {
    const activityAction = 'android.intent.action.MAIN' // Intent.ACTION_MAIN
    const intentParams: IntentLauncherParams = {
      flags: 268435456, // Intent.FLAG_ACTIVITY_NEW_TASK
      category: 'android.intent.category.APP_EMAIL', // Intent.CATEGORY_APP_EMAIL
    }

    startActivityAsync(activityAction, intentParams).catch(handleOpenMailClientError)
  }

  const handleOpenMailApp = () => {
    if (isIOS) {
      openMailClientIOS()
    }
    if (isAndroid) {
      openMailClientAndroid()
    }
  }

  const isSuccess = status === 'success'
  const isPending = status === 'pending'

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      {!!isPending && <LoaderOverlay />}
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push(isForgotPassword ? '/login' : '/(authenticated)/settings')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {isForgotPassword ? 'Forgot Password' : 'Reset Password'}
        </Text>
      </View>

      {isSuccess ? (
        <View px={wp(5)} mt={hp(2)} rowGap={hp(1.5)}>
          <Text color={'$mutedForeground'} fontSize={FontSizes.size16} mt={hp(2)} lh={hp(3)} fontFamily={'$heading'}>
            {'An email is sent to your email address containing the link to reset your password'}
          </Text>
          <Button
            fontSize={FontSizes.size18}
            h={hp(5.5)}
            onPress={handleOpenMailApp}
            bg="$primary"
            color="white"
            mt={hp(2)}
          >
            Open Mail App
          </Button>
        </View>
      ) : (
        <KeyboardScrollView contentContainerStyle={styles.scrollContent}>
          <Text color={'$mutedForeground'} fontSize={FontSizes.size16} mt={hp(2)} lh={hp(3)} fontFamily={'$heading'}>
            {"Enter the email address associated with your account and we'll send an email to reset your password."}
          </Text>
          <InputFields control={control} errors={formState.errors} inputs={RESET_PASSWORD_FIELDS} />
          <Button
            fontSize={FontSizes.size18}
            h={hp(5.5)}
            onPress={handleSubmit(handleSendLink)}
            bg="$primary"
            color="white"
            mt={hp(2)}
          >
            Send Link
          </Button>
        </KeyboardScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp(5),
    marginTop: hp(2),
    rowGap: hp(1.5),
    paddingBottom: hp(5),
  },
})
