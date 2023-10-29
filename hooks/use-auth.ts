import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from 'native-base'
import { useCallback, useEffect } from 'react'
import { router } from 'expo-router'
import constate from 'constate'
import { fetchUser, login, refreshToken, signup } from '@/queries/auth'
import { AUTH } from '@/utils/query-keys'
import { setToken } from '@/utils/token'

export function useAuth() {
  const qc = useQueryClient()
  const toast = useToast()

  const { mutate: fetchUserData, data: userData } = useMutation({
    mutationKey: [AUTH.USER_DATA],
    mutationFn: fetchUser,
  })

  const {
    isLoading: isAuthenticationInProgress,
    data: tokenData,
    status: refreshTokenStatus,
  } = useQuery({
    queryKey: [AUTH.LOGGED_IN],
    queryFn: refreshToken,
  })

  useEffect(
    function updateTokenData() {
      if (refreshTokenStatus === 'success') {
        setToken('refresh', tokenData.refresh)
        setToken('access', tokenData.access)
        fetchUserData()
      }
    },
    [refreshTokenStatus, fetchUserData, tokenData?.refresh, tokenData?.access],
  )

  const loginMutation = useMutation({
    mutationKey: [AUTH.LOGIN],
    mutationFn: login,
    onSuccess: (data) => {
      toast.show({ title: 'Successfully logged in!' })

      /** Saving the tokens */
      setToken('refresh', data.refresh)
      setToken('access', data.access)

      /** updating the data in queryClient */
      qc.setQueryData([AUTH.LOGGED_IN], data)

      fetchUserData()
    },
    onError: () => {
      toast.show({
        title: 'Invalid Credentials!',
        description: 'You have entered the wrong credentials!',
      })
    },
  })

  const signupMutation = useMutation({
    mutationKey: [AUTH.SIGNUP],
    mutationFn: signup,
    onSuccess: () => {
      toast.show({
        title: 'Signup Success!',
        description: 'Your account has been created successfully now you can login to you account!',
      })

      router.replace('/login')
    },
  })

  const logout = useCallback(() => {
    setToken('refresh', undefined)
    setToken('access', undefined)

    router.replace('/login')
  }, [])

  return {
    isAuthenticationInProgress,
    tokenData,
    loginMutation,
    logout,
    signupMutation,
    userData,
  }
}

export const [AuthProvider, useAuthContent] = constate(useAuth)
