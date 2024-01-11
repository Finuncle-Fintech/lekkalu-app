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
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: BASIC_HEADER,
})

apiClient.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = new AxiosHeaders()
  }

  const accessToken = getToken('access')
  console.log(accessToken)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
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
