import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import dayjs from 'dayjs'
import { Dialog, Input, XStack, Unspaced, Button } from 'tamagui'
import { X } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Budget } from '@/types/budget'
import { UpdateBudgetSchema, updateBudgetSchema } from '@/schema/budget'
import { updateBudget } from '@/queries/budget'
import { onError } from '@/utils/error'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import FormControl from '@/components/form-control'
import CustomButton from '@/components/custom-button'
import Select from '@/components/select'
import { BUDGET_MONTH_OPTIONS } from '@/utils/budget'
import { BUDGET_QUERY_KEYS } from '@/utils/query-keys'

type UpdateBudgetProps = {
  budget: Budget
  children: React.ReactNode // trigger
}

export default function UpdateBudget({ budget, children }: UpdateBudgetProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ limit: string; month: string }>({
    resolver: zodResolver(updateBudgetSchema),
    defaultValues: {
      limit: budget.limit,
      month: dayjs(budget.month).month().toString(),
    },
  })

  const updateBudgetMutation = useMutation({
    mutationFn: (dto: UpdateBudgetSchema) => updateBudget(budget.id, dto),
    onError,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [BUDGET_QUERY_KEYS.BUDGETS],
      })

      setOpen(false)

      Toast.show({
        type: 'success',
        text1: 'Budget set successfully!',
      })
    },
  })

  function handleUpdateBudget(values: { limit: string; month: string }) {
    updateBudgetMutation.mutate({
      limit: Number(values.limit),
      month: dayjs().set('month', Number(values.month)).format(SERVER_DATE_FORMAT),
    })
  }

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

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
            <CustomButton onPress={handleSubmit(handleUpdateBudget)} loading={updateBudgetMutation.isPending}>
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
