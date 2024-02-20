import { z } from 'zod'

export const addEditIncomeExpenseSchema = z.object({
  name: z.string().min(1, 'Name is required!'),
  type: z.string().min(1, 'Type is required!'),
  amount: z.coerce.number({
    required_error: 'Amount is required!',
    invalid_type_error: 'Amount should be a number',
  }),
})

export type IAddEditIncomeExpenseSchema = z.infer<typeof addEditIncomeExpenseSchema>
