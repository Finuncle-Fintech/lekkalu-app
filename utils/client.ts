import axios, { AxiosHeaders } from 'axios'
import { getToken, setToken } from './token'

const BASIC_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

/**
 * This is general api client which will be used for most of the stuff
 */
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: BASIC_HEADER,
})

apiClient.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = new AxiosHeaders()
  }

  const accessToken = getToken('access')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(undefined, (error) => {
  if (axios.isAxiosError(error)) {
    // If we get unauthorized status code
    // That means token is expired
    if (error.response?.status === 403) {
      // Remove access token from persisted cache
      setToken('access', undefined)
      setToken('refresh', undefined)
    }
  }

  return Promise.reject(error)
})

/**
 * This is for user specific requests
 */
export const userClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_USER_BASE_URL,
  headers: BASIC_HEADER,
})

/**
 * This is for token specific requests
 */
export const tokenClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_TOKEN_BASE_URL,
  headers: BASIC_HEADER,
})
