import z from 'zod'

export const addAccountSchema = z.object({
  type: z.string(),
  name: z.string(),
  principal: z.coerce.number(),
  started: z.date(),
})
export const addTransactionSchema = z.object({
  amount: z.coerce.number(),
  time: z.date(),
})
