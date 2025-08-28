import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { apiClient } from '@/shared/services/simpleApiClient'
import {
  loginSuccess,
  logout as logoutAction,
} from '@/shared/store/slices/authSlice'
import { useToast } from '@/shared/components/ToastProvider'
import { useTranslate } from '@/translate'

const QUERY_KEYS = {
  PROFILE: ['auth', 'profile'],
  PREFERENCES: ['user', 'preferences'],
}

export const useLogin = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { t } = useTranslate()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.login(email, password),
    onSuccess: (data) => {
      if (data.success) {
        dispatch(
          loginSuccess({
            user: data.data.user,
            token: data.data.tokens.accessToken,
          })
        )
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE })
      }
    },
    onError: (error: any) => {
      showToast({
        message: error.message || t('auth.loginFailed'),
        type: 'error',
      })
    },
  })
}

export const useRegister = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { t } = useTranslate()

  return useMutation({
    mutationFn: (userData: any) => apiClient.register(userData),
    onSuccess: (data) => {
      if (data.success) {
        dispatch(
          loginSuccess({
            user: data.data.user,
            token: data.data.tokens.accessToken,
          })
        )
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE })
        showToast({
          message: t('auth.registerSuccess'),
          type: 'success',
        })
      }
    },
    onError: (error: any) => {
      showToast({
        message: error.message || t('auth.registerFailed'),
        type: 'error',
      })
    },
  })
}

export const useProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: () => apiClient.getProfile(),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { t } = useTranslate()

  return useMutation({
    mutationFn: (userData: any) => apiClient.updateProfile(userData),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(QUERY_KEYS.PROFILE, data)
        showToast({
          message: t('auth.profileUpdateSuccess'),
          type: 'success',
        })
      }
    },
    onError: (error: any) => {
      showToast({
        message: error.message || t('auth.profileUpdateFailed'),
        type: 'error',
      })
    },
  })
}

export const usePreferences = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PREFERENCES,
    queryFn: () => apiClient.getPreferences(),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { t } = useTranslate()

  return useMutation({
    mutationFn: (preferences: any) => apiClient.updatePreferences(preferences),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(QUERY_KEYS.PREFERENCES, data)
        showToast({
          message: t('auth.preferencesUpdateSuccess'),
          type: 'success',
        })
      }
    },
    onError: (error: any) => {
      showToast({
        message: error.message || t('auth.preferencesUpdateFailed'),
        type: 'error',
      })
    },
  })
}

export const useLogout = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { t } = useTranslate()

  return useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      dispatch(logoutAction())
      queryClient.clear()
      showToast({
        message: t('auth.logoutSuccess'),
        type: 'success',
      })
    },
    onError: (error: any) => {
      // Even if logout fails, clear local state
      dispatch(logoutAction())
      queryClient.clear()
      showToast({
        message: t('auth.logoutSuccess'),
        type: 'success',
      })
    },
  })
}
