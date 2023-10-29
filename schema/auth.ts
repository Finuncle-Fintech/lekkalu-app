import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string({ required_error: 'Username is required!' })
    .min(6, 'Enter at least 6 characters!')
    .max(20, 'Enter at most 30 characters!'),
  password: z.string({ required_error: 'Password is required!' }),
  rememberMe: z.boolean().optional(),
})
export type LoginSchema = z.infer<typeof loginSchema>
