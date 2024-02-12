export type PhysicalAsset = {
  id: number
  name: string
  purchase_value: string
  sell_value: string
  purchase_date: string
  type: string
  sell_date: string
  type: string
  depreciation_percent: string
  depreciation_frequency: number
  market_value: string
  user: number
  type: number
  tags: []
}

export type Liability = {
  id: number
  balance: string
  closure_charges: string
  disbursement_date: string
  type: string
  emi: string
  emi_day: string
  interest_rate: string
  name: string
  principal: string
  tenure: number
  user: number
}

export type CashAssets = {
  name: string,
  amount: number
}

export type MutualFundAssets = {
  name: string,
  invested_amount: number,
  expected_return: number,
  purchase_date: string
  type: string
}

export type GoldAssets = {
  weight: number
}

export type AccountAssets = {
  account_name: string,
  balance: number,
  interrest_rate: number,  
}

export type PropertyAssets = {
  pincode: number,
  area: number,
  land: string,  
  purchase_value: number,  
  purchase_date: string
}

export type PhysicalFundAssets = {
  name: string,
  purchase_value: number,  
  purchase_date: string,
  type: string,
  rate: string
}
