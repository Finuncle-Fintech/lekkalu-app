import { cloneElement, useMemo, useState } from 'react'
import { Button, Modal, useToast } from 'native-base'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Expense } from '@/types/expense'
import { AddExpenseSchema, addExpenseSchema } from '@/schema/expense'
import { addExpense, fetchExpenses, updateExpense } from '@/queries/expense'
import { EXPENSES, TAGS } from '@/utils/query-keys'
import { Success } from '@/utils/toast'
import { InputField } from '@/types/input-fields'
import { fetchTags } from '@/queries/tag'
import { checkIsExpenseExists } from '@/utils/expense'
import InputFields from '../input-fields'

type CreateOrEditExpenseProps = {
  trigger: React.ReactElement<{ onPress: () => void }>
  expense?: Expense
}

export default function CreateOrEditExpense({ trigger, expense }: CreateOrEditExpenseProps) {
  const [showModal, setShowModal] = useState(false)
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(expense)
  const title = isEdit ? 'Edit Expense' : 'Create Expense'

  const { data: tags } = useQuery({
    queryKey: [TAGS.TAGS],
    queryFn: fetchTags,
    enabled: !!showModal,
  })
  const { data: expenses } = useQuery({
    queryKey: [EXPENSES.EXPENSES],
    queryFn: () => fetchExpenses(),
    enabled: !!showModal,
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddExpenseSchema>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      amount: expense?.amount ? Number(expense.amount) : undefined,
      // @TODO: Add multiple tags
      tags: expense?.tags ? expense.tags[0] : undefined,
      time: expense?.time ? new Date(expense.time) : undefined,
    },
  })

  const createExpenseMutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EXPENSES.EXPENSES] })
      toast.show({ render: () => Success('Expense created successfully!') })
      setShowModal(false)
    },
  })

  const editExpenseMutation = useMutation({
    mutationFn: (dto: Omit<AddExpenseSchema, 'tags'> & { tags: number[] }) => updateExpense(expense?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EXPENSES.EXPENSES] })
      toast.show({ render: () => Success('Expense updated successfully!') })
      setShowModal(false)
    },
  })

  const inputs = useMemo(() => {
    return [
      {
        id: 'amount',
        label: 'Provide the amount',
        type: 'number',
      },
      {
        id: 'tags',
        label: 'Select tags',
        type: 'select',
        options: tags?.map((tag) => ({ id: tag.id, label: tag.name })) ?? [],
        valueFormatter: (value) => Number(value),
      },
      {
        id: 'time',
        label: 'Choose the Date',
        type: 'date',
        defaultDate: expense?.time ? new Date(expense.time) : undefined,
      },
    ] as InputField[]
  }, [tags, expense?.time])

  const handleAddOrEditExpense = (values: AddExpenseSchema) => {
    const newExpense = {
      amount: values.amount,
      tags: [values.tags],
      time: values.time,
    }
    /** Handling case of expense updation */
    if (expense) {
      editExpenseMutation.mutate(newExpense)
      return
    }

    /** Handling case of expense creation */
    const exists = checkIsExpenseExists(expenses ?? [], { ...newExpense, amount: newExpense.amount.toString() })
    if (exists) {
      toast.show({ title: 'Expense already exists!' })
      return
    }

    createExpenseMutation.mutate(newExpense)
  }

  return (
    <>
      {cloneElement(trigger, {
        onPress: () => {
          setShowModal(true)
        },
      })}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
      >
        <Modal.Content maxW="sm" w="full">
          <Modal.CloseButton />
          <Modal.Header>{title}</Modal.Header>

          <Modal.Body>
            <InputFields control={control} errors={errors} inputs={inputs} />
          </Modal.Body>

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
              <Button
                onPress={handleSubmit(handleAddOrEditExpense)}
                isDisabled={createExpenseMutation.isPending || editExpenseMutation.isPending}
                isLoading={createExpenseMutation.isPending || editExpenseMutation.isPending}
              >
                {title}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
