import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants'
import { queryClient } from './query-client'

type TokenTypes = 'refresh' | 'access'

/**
 * Set value for tokens in persisted query client cache
 *
 */
export function setToken(type: TokenTypes, value: string | undefined) {
  queryClient.setQueryData<string | undefined>([type === 'refresh' ? REFRESH_TOKEN_KEY : ACCESS_TOKEN_KEY], value)
}

/**
 * Get the saved tokens from persister query client cache
 */

export function getToken(type: TokenTypes) {
  return queryClient.getQueryData<string | undefined>([type === 'refresh' ? REFRESH_TOKEN_KEY : ACCESS_TOKEN_KEY])
}
