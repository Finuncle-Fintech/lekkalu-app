import { z } from 'zod'

export const addPhysicalAssetSchema = z.object({
  name: z.string().min(1, 'Asset name is required!'),
  purchase_value: z.coerce.number().min(1, 'Purchase value is required!'),
  purchase_date: z.date(),
  sell_value: z.coerce.number().optional(),
  sell_date: z.date().optional(),
  depreciation_percent: z.coerce.number().min(1, 'Depreciation % is required!'),
  init_dep: z.coerce.number({ required_error: 'Initial depreciation is required!' }),
  market_value: z.coerce.number().optional(),
  type: z.coerce.number(),
  tags: z.array(z.string()),
  months: z.coerce.number(),
  years: z.coerce.number(),
  user: z.number(),
})

export type AddPhysicalAssetSchema = z.infer<typeof addPhysicalAssetSchema>

export const addLiabilitySchema = z.object({
  name: z.string({ required_error: 'Name is required!' }),
  balance: z.coerce.number({ required_error: 'Balance is required!' }),
  principal: z.coerce.number({ required_error: 'Principal is required!' }),
  disbursement_date: z.date({ required_error: 'Disbursement Date is required!' }),
  emi_day: z.coerce.number({ required_error: 'Emi day is required!' }).min(1).max(30),
  emi: z.coerce.number().optional(),
  tenure: z.coerce.number({ required_error: 'Tenure is required!' }),
  interest_rate: z.coerce.number({ required_error: 'Interest Rage is required!' }),
  closure_charges: z.coerce.number({ required_error: 'Closure Charges is required!' }),
})

export type AddLiabilitySchema = Omit<z.infer<typeof addLiabilitySchema>, 'disbursement_date'> & {
  disbursement_date: string
}


export const addCashAssetSchema = z.object({
  name: z.string(),
  amount: z.coerce.number({required_error: 'Amount is required'}).min(1, 'Amount is required'),
})

export type AddCashAssetSchema = z.infer<typeof addCashAssetSchema>

export const addMutualFundAssetSchema = z.object({
  name: z.string(),
  invested_amount: z.coerce.number(),  
  expected_return: z.coerce.number(),
  purchase_date: z.string(),
})

export type AddMutualFundAssetSchema = z.infer<typeof addMutualFundAssetSchema>

export const addGoldFundAssetSchema = z.object({
  weight: z.coerce.number({required_error: 'Weight is required'}).min(1, 'Weight is required'),
})

export type AddGoldFundAssetSchema = z.infer<typeof addGoldFundAssetSchema>

export const addAccountFundAssetSchema = z.object({
  account_name: z.coerce.string(),
  balance: z.coerce.number({required_error: 'Balance is required'}).min(1, 'Balance is required'),
  interrest_rate: z.coerce.number(),
})

export type AddAccountFundAssetSchema = z.infer<typeof addAccountFundAssetSchema>

export const addPropertyAssetSchema = z.object({
  pincode: z.coerce.number(),
  area: z.coerce.number(),
  land: z.coerce.string(),
  purchase_value: z.coerce.number(),    
  purchase_date: z.string(),
})

export type AddPropertyAssetSchema = z.infer<typeof addPropertyAssetSchema>


export const addNewPhysicalAssetSchema = z.object({
  name: z.string(),
  purchase_value: z.coerce.number(),  
  type: z.coerce.string(),
  purchase_date: z.string(),
  rate: z.string(),
})

export type AddNewPhysicalAssetSchema = z.infer<typeof addNewPhysicalAssetSchema>