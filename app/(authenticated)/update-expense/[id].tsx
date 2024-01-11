import { Button, VStack, useToast } from 'native-base'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { View, useTheme } from 'tamagui'
import InputFields from '@/components/input-fields'
import { EXPENSES, TAGS } from '@/utils/query-keys'
import { fetchTags } from '@/queries/tag'
import { fetchExpenses, updateExpense } from '@/queries/expense'
import { AddExpenseSchema, addExpenseSchema } from '@/schema/expense'
import { Success } from '@/utils/toast'
import { getExpenseInputs } from '@/utils/expense'

export default function UpdateExpense() {
  const toast = useToast()
  const qc = useQueryClient()
  const { id } = useLocalSearchParams<{ id: string }>()
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

  const expense = expensesQuery.data?.find((expense) => expense.id === Number(id))

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddExpenseSchema>({
    resolver: zodResolver(addExpenseSchema),
  })

  useEffect(
    function updateFormValues() {
      if (expense) {
        reset({ amount: expense.amount, tags: expense.tags, time: new Date(expense.time) })
      }
    },
    [expense, reset],
  )

  const editExpenseMutation = useMutation({
    mutationFn: (dto: Omit<AddExpenseSchema, 'tags'> & { tags: number[] }) => updateExpense(expense?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EXPENSES.EXPENSES] })
      toast.show({ render: () => Success('Expense updated successfully!') })
      router.push('/expenses')
    },
  })

  const inputs = useMemo(() => {
    if (!tagsQuery.data) {
      return []
    }

    return getExpenseInputs(tagsQuery.data)
  }, [tagsQuery.data])

  const handleEditExpense = (values: AddExpenseSchema) => {
    const newExpense = {
      amount: values.amount,
      tags: values.tags.map(Number),
      time: values.time,
    }

    editExpenseMutation.mutate(newExpense)
  }

  return (
    <VStack bgColor={theme.backgroundHover.get()} flex={1} p={4} space={4}>
      <View rowGap="$2.5">
        <InputFields control={control} errors={errors} inputs={inputs} />
      </View>

      <Button
        onPress={handleSubmit(handleEditExpense)}
        isDisabled={editExpenseMutation.isPending}
        isLoading={editExpenseMutation.isPending}
      >
        Update
      </Button>
    </VStack>
  )
}
