import { useMemo } from 'react'
import { Button, VStack, useToast } from 'native-base'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import { View, useTheme } from 'tamagui'
import InputFields from '@/components/input-fields'
import { EXPENSES, TAGS } from '@/utils/query-keys'
import { fetchTags } from '@/queries/tag'
import { addExpense, fetchExpenses } from '@/queries/expense'
import { AddExpenseSchema, addExpenseSchema } from '@/schema/expense'
import { Success } from '@/utils/toast'
import { checkIsExpenseExists, getExpenseInputs } from '@/utils/expense'

export default function CreateExpense() {
  const toast = useToast()
  const qc = useQueryClient()
  const theme = useTheme()

  const [tagsQuery, expensesQuery] = useQueries({
    queries: [
      {
        queryKey: [TAGS.TAGS],
        queryFn: fetchTags,
      },
      {
        queryKey: [EXPENSES.EXPENSES],
        queryFn: () => fetchExpenses(),
      },
    ],
  })

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddExpenseSchema>({
    resolver: zodResolver(addExpenseSchema),
  })

  const createExpenseMutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      reset()
      qc.invalidateQueries({ queryKey: [EXPENSES.EXPENSES] })
      toast.show({ render: () => Success('Expense created successfully!') })
      router.push('/expenses')
    },
  })

  const inputs = useMemo(() => getExpenseInputs(tagsQuery.data ?? []), [tagsQuery.data])

  const handleAddExpense = (values: AddExpenseSchema) => {
    const newExpense = {
      amount: values.amount,
      tags: values.tags,
      time: values.time,
    }
    /** Handling case of expense creation */
    const exists = checkIsExpenseExists(expensesQuery.data ?? [], {
      ...newExpense,
      amount: newExpense.amount.toString(),
    })
    if (exists) {
      toast.show({ title: 'Expense already exists!' })
    }

    createExpenseMutation.mutate(newExpense)
  }

  return (
    <VStack flex={1} p={4} space={4} backgroundColor={theme.backgroundHover.val}>
      <View rowGap="$2.5">
        <InputFields control={control} errors={errors} inputs={inputs} />
      </View>

      <Button
        onPress={handleSubmit(handleAddExpense)}
        isDisabled={createExpenseMutation.isPending}
        isLoading={createExpenseMutation.isPending}
      >
        Create
      </Button>
    </VStack>
  )
}
