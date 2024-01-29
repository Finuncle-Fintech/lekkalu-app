import { z } from 'zod'

const editProfileSchema = z.object({
  first_name: z.string().min(3, 'Please enter at least 3 characters!').max(150, 'Please enter at most 150 characters!'),
  last_name: z.string().min(3, 'Please enter at least 3 characters!').max(150, 'Please enter at most 150 characters!'),
  username: z.string().min(6, 'Please enter at least 6 characters!').max(150, 'Please enter at most 150 characters!'),
})

type EditProfileSchema = z.infer<typeof editProfileSchema>

const changePasswordSchema = z.object({
  email: z
    .string({
      required_error: 'Email is Required',
    })
    .email('Please enter valid email address'),
})

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

const feedbackSchema = z.object({
  name: z
    .string({ required_error: 'Please enter your name!' })
    .min(3, 'Please enter at least 3 characters!')
    .max(50, 'Please enter at most 50 characters!'),
  email: z.string({ required_error: 'Please enter your email!' }).email('Invalid Email Address!'),
  subject_and_description: z
    .string({ required_error: 'Please enter your message for us!' })
    .min(5, 'Please write at least 5 characters!')
    .max(1000, 'Please write at most 1000 characters!'),
})

type FeedbackSchema = z.infer<typeof feedbackSchema>

export { editProfileSchema, changePasswordSchema, feedbackSchema }

export type { EditProfileSchema, ChangePasswordSchema, FeedbackSchema }
