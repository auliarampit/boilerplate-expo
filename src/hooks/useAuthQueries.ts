import { useToast } from '@/components/ToastProvider'
import { apiClient } from '@/services/apiClient'
import { useTranslate } from '@/i18n'
import { UpdatePreferencesRequest } from '@/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import {
  RegisterFormData,
  UpdateProfileFormData,
} from '@/utils/validationSchemas'

const QUERY_KEYS = {
  PROFILE: ['auth', 'profile'],
  PREFERENCES: ['user', 'preferences'],
}

export const useLogin = () => {
  const { login: authLogin } = useAuth()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { t } = useTranslate()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authLogin(email, password),
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE })
      }
    },
    onError: (error: Error) => {
      showToast({
        message: error.message || t('auth.loginFailed'),
        type: 'error',
      })
    },
  })
}

export const useRegister = () => {
  const { login: authLogin } = useAuth()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { t } = useTranslate()

  return useMutation({
    mutationFn: async (userData: RegisterFormData) => {
      const response = await apiClient.register(userData)
      if (response.success) {
        await authLogin(userData.email, userData.password)
      }
      return response
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE })
        showToast({
          message: t('auth.registerSuccess'),
          type: 'success',
        })
      }
    },
    onError: (error: Error) => {
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
    staleTime: 5 * 60 * 1000,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { t } = useTranslate()

  return useMutation({
    mutationFn: (userData: UpdateProfileFormData) =>
      apiClient.updateProfile(userData),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(QUERY_KEYS.PROFILE, data)
        showToast({
          message: t('auth.profileUpdateSuccess'),
          type: 'success',
        })
      }
    },
    onError: (error: Error) => {
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
    staleTime: 5 * 60 * 1000,
  })
}

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { t } = useTranslate()

  return useMutation({
    mutationFn: (preferences: UpdatePreferencesRequest) => apiClient.updatePreferences(preferences),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(QUERY_KEYS.PREFERENCES, data)
        showToast({
          message: t('auth.preferencesUpdateSuccess'),
          type: 'success',
        })
      }
    },
    onError: (error: Error) => {
      showToast({
        message: error.message || t('auth.preferencesUpdateFailed'),
        type: 'error',
      })
    },
  })
}

export const useLogout = () => {
  const { logout: authLogout } = useAuth()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { t } = useTranslate()

  return useMutation({
    mutationFn: () => authLogout(),
    onSuccess: () => {
      queryClient.clear()
      showToast({
        message: t('auth.logoutSuccess'),
        type: 'success',
      })
    },
    onError: () => {
      // Even if logout fails, clear local state
      queryClient.clear()
      showToast({
        message: t('auth.logoutSuccess'),
        type: 'success',
      })
    },
  })
}
