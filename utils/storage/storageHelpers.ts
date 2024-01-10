import AsyncStorage from '@react-native-async-storage/async-storage'

type Value = string

export const storeData = async (key: Value, value: Value): Promise<boolean | null> => {
  try {
    await AsyncStorage.setItem(key, value)
    return true
  } catch (e) {
    return null
  }
}

export const getData = async (key: Value): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value
  } catch (e) {
    return null
  }
}

export const removeData = async (key: Value): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key)
    return true
  } catch (e) {
    return false
  }
}

export const resetStorage = async (): Promise<boolean> => {
  try {
    await AsyncStorage.clear()
    return true
  } catch (e) {
    return false
  }
}
