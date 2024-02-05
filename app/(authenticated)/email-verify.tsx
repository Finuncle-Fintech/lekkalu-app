import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, View, Button } from 'tamagui'
import { useForm } from 'react-hook-form'
import { router, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { zodResolver } from '@hookform/resolvers/zod'
import { VerifyEmailSchema, verifyEmailSchema } from '@/schema/settings'
import { hp, wp } from '@/utils/responsive'
import LoaderOverlay from '@/components/loader-overlay'
import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import KeyboardScrollView from '@/components/keyboard-scroll-view'
import InputFields from '@/components/input-fields'
import { VERIFY_EMAIL_FIELDS } from '@/utils/settings'
import { useVerifyEmail } from '@/queries/settings'
import { openDeviceMailClientApp } from '@/utils/helpers'

const EmailVerify = () => {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams()
  const { control, handleSubmit, formState, reset } = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: params?.email || '' },
  })
  const { mutate, status } = useVerifyEmail(reset)

  const handleSendLink = (values: VerifyEmailSchema) => {
    mutate({ email: values.email })
  }

  const isSuccess = status === 'success'
  const isPending = status === 'pending'

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      {!!isPending && <LoaderOverlay />}
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/settings')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {'Verify Email'}
        </Text>
      </View>

      {isSuccess ? (
        <View px={wp(5)} mt={hp(2)} rowGap={hp(1.5)}>
          <Text color={'$mutedForeground'} fontSize={FontSizes.size16} mt={hp(2)} lh={hp(3)} fontFamily={'$heading'}>
            {'We have sent an mail to the email. Please open your inbox'}
          </Text>
          <Button
            fontSize={FontSizes.size18}
            h={hp(5.5)}
            onPress={openDeviceMailClientApp}
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
            {"We'll send an verification link to the entered email to verify it"}
          </Text>
          <InputFields control={control} errors={formState.errors} inputs={VERIFY_EMAIL_FIELDS} />
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

export default EmailVerify

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp(5),
    marginTop: hp(2),
    rowGap: hp(1.5),
    paddingBottom: hp(5),
  },
})
