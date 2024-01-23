import z from 'zod'

const addGoalSchema = z.object({
  name: z.string(),
  target: z.coerce.number(),
  kpi: z.string(),
  source: z.string(),
  proportionality: z.string(),
  completionDate: z.date(),
})

type AddGoalSchemaType = z.infer<typeof addGoalSchema>

export { AddGoalSchemaType, addGoalSchema }
