import { Button, Modal, Text, VStack } from 'native-base'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'tamagui'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useColorScheme } from 'react-native'

import InputFields from '../input-fields'
import { FeedbackSchema, feedbackSchema } from '@/schema/feedback'
import { submitFeedback } from '@/queries/feedback'
import { FEEDBACK_FIELDS } from '@/utils/feedback'
import When from '../when'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'

type FeedbackState = 'INITIAL' | 'SUBMITTED' | 'ERROR'

export default function Feedback() {
  const [status, setStatus] = useState<FeedbackState>('INITIAL')
  const [showModal, setShowModal] = useState(false)
  const theme = useTheme()
  const systemTheme = useColorScheme()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
  })

  const feedbackMutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      reset()
      setStatus('SUBMITTED')

      setTimeout(() => {
        setStatus('INITIAL')
        setShowModal(false)
      }, 4000)
    },
    onError: () => {
      setStatus('ERROR')
    },
  })

  const handleFeedbackSubmit = (values: FeedbackSchema) => {
    feedbackMutation.mutate(values)
  }

  return (
    <>
      <Button
        height={hp(5)}
        _text={{ fontSize: FontSizes.size15, color: systemTheme === 'dark' ? 'white' : THEME_COLORS.primary[600] }}
        variant="outline"
        onPress={() => {
          setShowModal(true)
        }}
      >
        Submit Feedback
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        size="full"
      >
        <Modal.Content bgColor={theme.backgroundHover.get()} width={'94%'}>
          <Modal.CloseButton _icon={{ size: wp(4) }} />
          <Modal.Header bgColor={theme.backgroundHover.get()}>
            <Text color={theme.foreground.get()} fontFamily={'heading'} fontWeight={'bold'} fontSize={FontSizes.size20}>
              Share your thoughts with us
            </Text>
          </Modal.Header>

          <Modal.Body style={{ rowGap: hp(1.5), paddingBottom: hp(2) }}>
            <When truthy={status === 'INITIAL'}>
              <InputFields control={control} errors={errors} inputs={FEEDBACK_FIELDS} />
            </When>

            <When truthy={status === 'SUBMITTED'}>
              <VStack h="56" flex={1} alignItems="center" justifyContent="center">
                <MaterialCommunityIcons name="email-check-outline" size={90} color="green" />
                <Text color="green.800">Feedback Submitted Successfully</Text>
              </VStack>
            </When>

            <When truthy={status === 'ERROR'}>
              <VStack h="56" flex={1} alignItems="center" justifyContent="center">
                <MaterialCommunityIcons name="information-outline" size={90} color="red" />
                <Text color="red.800">Could not send feedback, please try again later!</Text>
              </VStack>
            </When>
          </Modal.Body>

          <When truthy={status === 'INITIAL'}>
            <Modal.Footer bgColor={theme.backgroundHover.get()}>
              <Button.Group space={2}>
                <Button
                  _text={{
                    style: {
                      fontSize: FontSizes.size16,
                      padding: wp(1),
                      color: systemTheme === 'dark' ? 'white' : THEME_COLORS.primary[600],
                    },
                  }}
                  h={hp(5)}
                  variant="ghost"
                  onPress={() => {
                    setShowModal(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  _text={{ style: { fontSize: FontSizes.size16, paddingHorizontal: wp(2) } }}
                  h={hp(5)}
                  onPress={handleSubmit(handleFeedbackSubmit)}
                  isLoading={feedbackMutation.isPending}
                >
                  Submit
                </Button>
              </Button.Group>
            </Modal.Footer>
          </When>
        </Modal.Content>
      </Modal>
    </>
  )
}
