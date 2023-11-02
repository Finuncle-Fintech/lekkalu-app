import { z } from 'zod'
import { AddLiabilitySchema, addPhysicalAssetSchema } from '@/schema/balance-sheet'
import { Liability, PhysicalAsset } from '@/types/balance-sheet'
import { apiClient } from '@/utils/client'

export type AssetCreateOrEditDto = Omit<z.infer<typeof addPhysicalAssetSchema>, 'purchase_date' | 'sell_date'> & {
  purchase_date: string
  sell_date: string
  depreciation_frequency: number
}

export async function fetchPhysicalAssets() {
  const { data } = await apiClient.get<PhysicalAsset[]>('physical_assets/')
  return data
}

export async function fetchPhysicalAssetsById(id: number) {
  const { data } = await apiClient.get<PhysicalAsset[]>(`physical_assets/${id}/`)
  return data
}

export async function deletePhysicalAsset(id: number) {
  const { data } = await apiClient.delete<{ message: string }>(`/physical_assets/${id}`)
  return data
}

export async function addPhysicalAsset(dto: AssetCreateOrEditDto) {
  const { data } = await apiClient.post<PhysicalAsset[]>('/physical_assets/', dto)
  return data
}

export async function editPhysicalAsset(id: number, dto: Partial<AssetCreateOrEditDto>) {
  const { data } = await apiClient.put(`physical_assets/${id}`, dto)
  return data
}

/** Liabilities */
export async function fetchLiabilities() {
  const { data } = await apiClient.get<Liability[]>('loans/')
  return data
}

export async function addLiability(dto: AddLiabilitySchema) {
  const { data } = await apiClient.post('loans/', dto)
  return data
}

export async function editLiability(id: number, dto: Partial<AddLiabilitySchema>) {
  const { data } = await apiClient.put(`loans/${id}`, dto)
  return data
}

export async function deleteLiability(id: number) {
  const { data } = await apiClient.delete(`loans/${id}`)
  return data
}

/** Loan Transactions */
export async function fetchLoanTransactions() {
  const { data } = await apiClient.get('loan_transactions/')
  return data
}

export async function fetchTransactionsForLoan(loanId: number) {
  const { data } = await apiClient.get(`loan_transactions/?loan=${loanId}`)
  return data
}
