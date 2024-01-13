import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { router } from 'expo-router'
import constate from 'constate'
import Toast from 'react-native-toast-message'
import { fetchUser, login, refreshToken, signup } from '@/queries/auth'
import { AUTH } from '@/utils/query-keys'
import { setToken } from '@/utils/token'
import { onError } from '@/utils/error'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
        setIsAuthenticated(true)
        setToken('refresh', tokenData.refresh)
        setToken('access', tokenData.access)
        fetchUserData()
      }
    },
    [refreshTokenStatus, fetchUserData, tokenData?.refresh, tokenData?.access],
  )

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      /** Saving the tokens */
      setToken('refresh', data.refresh)
      setToken('access', data.access)

      /** updating the data in queryClient */
      qc.setQueryData([AUTH.LOGGED_IN], data)

      fetchUserData()

      Toast.show({
        type: 'success',
        text1: 'Successfully logged in!',
      })
    },
    onError,
  })

  const signupMutation = useMutation({
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
    setIsAuthenticated(false)
    setToken('refresh', undefined)
    setToken('access', undefined)

    router.replace('/login')
  }, [])

  return {
    isAuthenticated,
    isAuthenticationInProgress,
    tokenData,
    loginMutation,
    logout,
    signupMutation,
    userData,
  }
}

export const [AuthProvider, useAuthContext] = constate(useAuth)
