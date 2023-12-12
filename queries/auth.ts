import { getToken } from '@/utils/token'
import { tokenClient, userClient } from '@/utils/client'
import { User } from '@/types/user'
import { LoginSchema, SignupSchema } from '@/schema/auth'

export async function refreshToken() {
  const { data } = await tokenClient.post<{ access: string; refresh: string }>('/refresh/', {
    refresh: getToken('refresh'),
  })
  return data
}

export async function fetchUser() {
  const token = getToken('access')
  if (!token) {
    return
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const { data } = await userClient.get<User>('/user_profile', { headers })
  return data
}

export async function login(dto: Omit<LoginSchema, 'rememberMe'>) {
  const { data } = await tokenClient.post<{ access: string; refresh: string }>('/', dto)
  return data
}

export async function signup(dto: Omit<SignupSchema, 'termsAndConditions' | 'privacyPolicy'>) {
  const { data } = await userClient.post<{ email: string; username: string }>('/users_1', dto)
  return data
}
