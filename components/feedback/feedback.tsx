import { Button, Modal, Text, VStack } from 'native-base'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import InputFields from '../input-fields'
import { FeedbackSchema, feedbackSchema } from '@/schema/feedback'
import { submitFeedback } from '@/queries/feedback'
import { FEEDBACK_FIELDS } from '@/utils/feedback'

import When from '../when'

type FeedbackState = 'INITIAL' | 'SUBMITTED' | 'ERROR'

export default function Feedback() {
  const [status, setStatus] = useState<FeedbackState>('INITIAL')
  const [showModal, setShowModal] = useState(false)

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
      >
        <Modal.Content maxW="sm" w="full">
          <Modal.CloseButton />
          <Modal.Header>Share your thoughts with us</Modal.Header>

          <Modal.Body>
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
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  onPress={() => {
                    setShowModal(false)
                  }}
                >
                  Cancel
                </Button>
                <Button onPress={handleSubmit(handleFeedbackSubmit)} isLoading={feedbackMutation.isPending}>
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
