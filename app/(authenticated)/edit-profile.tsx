import React from 'react'
import { StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Button, Text, View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import BackButton from '@/components/back-button'
import LoaderOverlay from '@/components/loader-overlay'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import { EditProfileSchema, editProfileSchema } from '@/schema/settings'
import KeyboardScrollView from '@/components/keyboard-scroll-view'
import InputFields from '@/components/input-fields'
import { EDIT_PROFILE_FIELDS } from '@/utils/settings'
import { useGetUserDetails } from '@/queries/auth'
import { useEditProfile } from '@/queries/settings'

const EditProfile = () => {
  const insets = useSafeAreaInsets()
  const { data: userData } = useGetUserDetails()
  const { control, handleSubmit, formState } = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      first_name: userData?.first_name,
      last_name: userData?.last_name,
      username: userData?.username,
    },
  })
  const { mutate } = useEditProfile()

  const handleUpdateProfile = (values: EditProfileSchema) => {
    mutate(values)
  }

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      {/* {!!isPending && <LoaderOverlay />} */}
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/settings')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          Edit Profile
        </Text>
      </View>
      <KeyboardScrollView contentContainerStyle={styles.scrollContent}>
        <InputFields control={control} errors={formState.errors} inputs={EDIT_PROFILE_FIELDS} />
        <Button
          fontSize={FontSizes.size18}
          h={hp(5.5)}
          onPress={handleSubmit(handleUpdateProfile)}
          bg="$primary"
          color="white"
          mt={hp(2)}
        >
          Update Profile
        </Button>
      </KeyboardScrollView>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp(5),
    marginTop: hp(2),
    rowGap: hp(1.5),
    paddingBottom: hp(5),
  },
})
