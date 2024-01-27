import AsyncStorage from '@react-native-async-storage/async-storage'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants'

type TokenTypes = 'refresh' | 'access'

/**
 * Set value for tokens in persisted query client cache
 *
 */
export function setToken(type: TokenTypes, value: string | undefined) {
  AsyncStorage.setItem(type === 'refresh' ? REFRESH_TOKEN_KEY : ACCESS_TOKEN_KEY, value || '')
}

/**
 * Get the saved tokens from persister query client cache
 */

export async function getToken(type: TokenTypes) {
  return await AsyncStorage.getItem(type === 'refresh' ? REFRESH_TOKEN_KEY : ACCESS_TOKEN_KEY)
}
