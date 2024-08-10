import { queryClient } from '@/utils/query-client'

type Budget = {
  id: string
  limit: number
  month: Date
}

// Define the type for an item
type Item = Budget

// Function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// Function to get the current list of budget
export const getItemList = (key: string): Item[] => {
  try {
    return queryClient.getQueryData<Item[]>([key]) || []
  } catch (error) {
    console.log(error)
    return []
  }
}

// Function to add an item locally
export const addItem = (key: string, newItem: Omit<Item, 'id'>) => {
  try {
    const isExist = getMonthWiseBudgetItems(newItem.month)

    if (!isExist) {
      const currentItems = getItemList(key)
      const newItemWithId = { ...newItem, id: generateId() }
      queryClient.setQueryData([key], [...currentItems, newItemWithId])
      return true
    }
    return false
  } catch (error) {
    console.log(error)
  }
}

// Function to edit an item locally
export const editItem = (key: string, updatedItem: Item) => {
  try {
    const currentItems = getItemList(key)
    const updatedItems = currentItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    queryClient.setQueryData([key], updatedItems)
  } catch (error) {
    console.log(error)
  }
}

// Function to delete an item locally
export const deleteItem = (key: string, itemId: string) => {
  try {
    const currentItems = getItemList(key)
    const updatedItems = currentItems.filter((item) => item.id !== itemId)
    queryClient.setQueryData([key], updatedItems)
  } catch (error) {
    console.log(error)
  }
}

// Function to get an item locally
export const getMonthWiseBudgetItems = (date: Date): Budget | null => {
  try {
    const allBudgetItems = getItemList('budget')
    const monthWiseBudgetItems = allBudgetItems.filter((item) => {
      const itemMonth = new Date(item.month).getMonth() // Month in JavaScript Date object is 0-based
      const itemYear = new Date(item.month).getFullYear()
      return itemMonth === date.getMonth() && itemYear === date.getFullYear()
    })
    return monthWiseBudgetItems?.[0] ?? null
  } catch (error) {
    console.log(error)
    return null
  }
}
