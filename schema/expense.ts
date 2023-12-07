import dayjs from 'dayjs'
import z from 'zod'

export const addExpenseSchema = z.object({
  amount: z.coerce.number(),
  tags: z.array(z.coerce.number()),
  time: z.date(),
})
export type AddExpenseSchema = Omit<z.infer<typeof addExpenseSchema>, 'amount'> & {
  amount: string
}

export const expenseFiltersSchema = z
  .object({
    from: z.date(),
    to: z.date(),
  })
  .refine((data) => dayjs(data.to).isAfter(data.from), {
    message: 'To date should be after from date',
    path: ['to'],
  })
export type ExpenseFiltersSchema = z.infer<typeof expenseFiltersSchema>
