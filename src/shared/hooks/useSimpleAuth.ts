import { useToast } from '@/shared/components/ToastProvider'
import { apiClient } from '@/shared/services/simpleApiClient'
import { RegisterRequest, UpdateProfileRequest } from '@/shared/types/api'
import { useTranslate } from '@/translate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { 
  RegisterFormData, 
  UpdateProfileFormData 
} from '../schemas/validationSchemas'

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
      const registerData: RegisterRequest = {
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        firstName: userData.name.split(' ')[0] || userData.name,
        lastName: userData.name.split(' ').slice(1).join(' ') || '',
        acceptTerms: true,
      }
      const response = await apiClient.register(registerData)
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { t } = useTranslate()

  return useMutation({
    mutationFn: async (userData: UpdateProfileFormData) => {
      const updateData: UpdateProfileRequest = {
        firstName: userData.name.split(' ')[0] || userData.name,
        lastName: userData.name.split(' ').slice(1).join(' ') || '',
      }
      return apiClient.updateProfile(updateData)
    },
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { t } = useTranslate()

  return useMutation({
    mutationFn: (preferences: Record<string, unknown>) => apiClient.updatePreferences(preferences),
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
    onError: (error: Error) => {
      // Even if logout fails, clear local state
      queryClient.clear()
      showToast({
        message: t('auth.logoutSuccess'),
        type: 'success',
      })
    },
  })
}
