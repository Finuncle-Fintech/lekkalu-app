import { SetBudgetSchema, SetBudgetSchema2, UpdateBudgetSchema } from '@/schema/budget'
import { Budget } from '@/types/budget'
import { apiClient } from '@/utils/client'

export async function fetchBudgets() {
  const { data } = await apiClient.get<Budget[]>('/budget')
  return data
}

export async function deleteBudget(id: number) {
  const { data } = await apiClient.delete<{ message: string }>(`/budget/${id}`)
  return data
}

export async function setBudget(dto: SetBudgetSchema2) {
  const { data } = await apiClient.post<Budget[]>('/budget/', dto)
  return data
}

export async function updateBudget(id: number, dto: UpdateBudgetSchema) {
  const { data } = await apiClient.put<{ data: Budget }>(`/budget/${id}`, dto)
  return data
}

export async function getSingleMonthBudget(date: Date,allBudgetList: SetBudgetSchema[]) {
    
  const data = allBudgetList?.filter((item) => {    

    const itemMonth = new Date(item.month).getMonth() + 1
    const itemYear = new Date(item.month).getFullYear()
    
    return itemMonth === new Date(date).getMonth() + 1 && itemYear === new Date(date).getFullYear()
  })
  return data?.[0] || null;
}

