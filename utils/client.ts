import axios, { AxiosHeaders } from 'axios'
import { getToken } from './token'

const BASIC_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

/**
 * This is general api client which will be used for most of the stuff
 */
export const apiClient = axios.create({
  baseURL: 'https://api.finuncle.com/api/v1' || process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: BASIC_HEADER,
})

apiClient.interceptors.request.use((config) => {
  config.headers = new AxiosHeaders(config.headers)
  const accessToken = getToken('access')
  if (accessToken) {
    config.headers.setAuthorization(`Bearer ${accessToken}`)
  }
  return config
})

export const apiv2Client = axios.create({
  baseURL: 'https://api.finuncle.com/api/v2' || process.env.EXPO_PUBLIC_API_V2_BASE_URL,
  headers: BASIC_HEADER,
})

apiv2Client.interceptors.request.use((config) => {
  config.headers = new AxiosHeaders(config.headers)
  const accessToken = getToken('access')
  if (accessToken) {
    config.headers.setAuthorization(`Bearer ${accessToken}`)
  }
  return config
})

/**
 * This is for user specific requests
 */
export const userClient = axios.create({
  baseURL: 'https://api.finuncle.com/users/api' || process.env.EXPO_PUBLIC_USER_BASE_URL,
  headers: BASIC_HEADER,
})

/**
 * This is for token specific requests
 */
export const tokenClient = axios.create({
  baseURL: 'https://api.finuncle.com/token' || process.env.EXPO_PUBLIC_TOKEN_BASE_URL,
  headers: BASIC_HEADER,
})
