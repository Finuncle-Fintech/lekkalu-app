import { z } from 'zod'

export const setBudgetSchema = z.object({
  id: z.number(),
  limit: z.coerce.number().min(1, 'Limit is required!'),
  month: z.string(),
  year: z.string()
})
export type SetBudgetSchema = z.infer<typeof setBudgetSchema>

export const setBudgetSchema2 = z.object({
  limit: z.coerce.number().min(1, 'Limit is required!'),
  month: z.string(),
  year: z.string()
})
export type SetBudgetSchema2 = z.infer<typeof setBudgetSchema2>

export const setBudgetSchema3 = z.object({
  limit: z.coerce.number().min(1, 'Limit is required!'),
})
export type SetBudgetSchema3 = z.infer<typeof setBudgetSchema3>

export const updateBudgetSchema = setBudgetSchema.partial()
export type UpdateBudgetSchema = z.infer<typeof updateBudgetSchema>