import React from 'react'
import { Button, Text, View } from 'tamagui'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import BackButton from '@/components/back-button'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import KeyboardScrollView from '@/components/keyboard-scroll-view'
import InputFields from '@/components/input-fields'
import { FeedbackSchema, feedbackSchema } from '@/schema/settings'
import { FEEDBACK_FIELDS } from '@/utils/settings'
import LoaderOverlay from '@/components/loader-overlay'
import { useSubmitFeedback } from '@/queries/settings'

const SubmitFeedback = () => {
  const insets = useSafeAreaInsets()

  const { handleSubmit, control, formState, reset } = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
  })

  const { mutate, isPending } = useSubmitFeedback(reset)

  const handleFeedbackSubmit = (values: FeedbackSchema) => {
    mutate(values)
  }

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      {!!isPending && <LoaderOverlay />}
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/settings')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          Share your thoughts with us
        </Text>
      </View>
      <KeyboardScrollView contentContainerStyle={styles.scrollContent}>
        <InputFields control={control} errors={formState.errors} inputs={FEEDBACK_FIELDS} />
        <Button
          fontSize={FontSizes.size18}
          h={hp(5.5)}
          onPress={handleSubmit(handleFeedbackSubmit)}
          bg="$primary"
          color="white"
          mt={hp(2)}
        >
          Submit Feedback
        </Button>
      </KeyboardScrollView>
    </View>
  )
}

export default SubmitFeedback

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp(5),
    marginTop: hp(2),
    rowGap: hp(1.5),
    paddingBottom: hp(5),
  },
})
