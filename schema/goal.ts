import z from 'zod'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === 'number') {
      return { message: 'Required' }
    }
  }
  return { message: ctx.defaultError }
}
const addGoalSchema = z.object({
  name: z.string(),
  target: z.coerce.number({ errorMap: customErrorMap }),
  kpi: z.string(),
  source: z.string(),
  proportionality: z.string(),
  targetDate: z.date(),
})

type AddGoalSchemaType = z.infer<typeof addGoalSchema>

export { AddGoalSchemaType, addGoalSchema }
