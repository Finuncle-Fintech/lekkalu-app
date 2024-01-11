import { X } from '@tamagui/lucide-icons'
import { Button, Dialog, Input, Unspaced, XStack } from 'tamagui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useToastController } from '@tamagui/toast'
import CustomButton from '@/components/custom-button'
import { setBudgetSchema } from '@/schema/budget'
import FormControl from '@/components/form-control'
import { BUDGET_MONTH_OPTIONS } from '@/utils/budget'
import Select from '@/components/select'
import { setBudget } from '@/queries/budget'
import { SERVER_DATE_FORMAT } from '@/utils/constants'

export default function SetBudget() {
  const toast = useToastController()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ limit: string; month: string }>({
    resolver: zodResolver(setBudgetSchema),
  })

  const setBudgetMutation = useMutation({
    mutationFn: setBudget,
    onSuccess() {
      reset({})
      toast.show('Budget set successfully!')
    },
    onError() {
      toast.show('Something went wrong while setting budget. Please try again!')
    },
  })

  function handleSetBudget(values: { limit: string; month: string }) {
    setBudgetMutation.mutate({
      limit: Number(values.limit),
      month: dayjs().set('month', Number(values.month)).format(SERVER_DATE_FORMAT),
    })
  }

  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <CustomButton>Set Budget</CustomButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          width={'90%'}
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
          <Dialog.Title>Set Budget</Dialog.Title>
          <Dialog.Description>Set and track your monthly budgets.</Dialog.Description>

          <Button
            onPress={() => {
              toast.show('Testing')
            }}
          >
            Test
          </Button>

          <FormControl>
            <FormControl.Label isRequired>Month</FormControl.Label>

            <FormControl.Controller
              name="month"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange} items={BUDGET_MONTH_OPTIONS} />
              )}
            />

            <FormControl.ErrorMessage>{errors.month?.message}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl>
            <FormControl.Label isRequired>Budget</FormControl.Label>

            <FormControl.Controller
              name="limit"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter budget for month"
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                />
              )}
            />

            <FormControl.ErrorMessage>{errors.limit?.message}</FormControl.ErrorMessage>
          </FormControl>

          <XStack alignSelf="flex-end" gap="$4">
            <CustomButton onPress={handleSubmit(handleSetBudget)} loading={setBudgetMutation.isPending}>
              Save changes
            </CustomButton>
          </XStack>

          <Unspaced>
            <Dialog.Close asChild>
              <Button position="absolute" top="$3" right="$3" size="$2" circular icon={X} />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
