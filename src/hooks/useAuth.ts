import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AUTH_STORAGE_KEY, USER_STORAGE_KEY, STORAGE_KEYS } from '@/utils/storage'
import { apiClient } from '@/services/apiClient'
import { RootState } from '../store'
import {
  loginSuccess,
  logout as logoutAction,
  setLoading,
  updateUser
} from '@/store/slices/authSlice'
import { User } from '../types'
import { removeFromStorage, saveToStorage } from '@/utils/storage'

export const useAuth = () => {
  const dispatch = useDispatch()
  const authState = useSelector((state: RootState) => state.auth)

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch(setLoading(true))
      const response = await apiClient.login(email, password)

      if (response.success) {
        await Promise.all([
          saveToStorage(AUTH_STORAGE_KEY, 'true'),
          saveToStorage(USER_STORAGE_KEY, response.data.user),
          AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.tokens.accessToken),
          AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.tokens.refreshToken),
        ])

        dispatch(loginSuccess({
          user: response.data.user,
          token: response.data.tokens.accessToken,
        }))

        return { success: true }
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      await Promise.all([
        removeFromStorage(AUTH_STORAGE_KEY),
        removeFromStorage(USER_STORAGE_KEY),
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      ])
      dispatch(logoutAction())
    }
  }, [dispatch])

  const updateUserProfile = useCallback((userData: Partial<User>) => {
    dispatch(updateUser(userData))
  }, [dispatch])

  return {
    ...authState,
    login,
    logout,
    updateUserProfile,
  }
}
