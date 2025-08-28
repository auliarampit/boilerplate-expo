import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useAppDispatch, useAppSelector } from './hooks'
import { loginSuccess, logout } from './slices/authSlice'
import { setTheme, showNotification } from './slices/appSlice'

// Contoh penggunaan Redux dalam komponen
export const ReduxExample = () => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { theme, notification } = useAppSelector((state) => state.app)

  const handleLogin = () => {
    dispatch(
      loginSuccess({
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'John Doe',
        },
        token: 'sample-token',
      })
    )
    dispatch(
      showNotification({
        message: 'Login berhasil!',
        type: 'success',
      })
    )
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(
      showNotification({
        message: 'Logout berhasil!',
        type: 'info',
      })
    )
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(newTheme))
  }

  return (
    <View className='flex-1 justify-center items-center p-4'>
      <Text className='text-lg font-semibold mb-4'>
        Redux Example
      </Text>
      
      {isAuthenticated ? (
        <View className='items-center'>
          <Text className='mb-2'>Welcome, {user?.name}!</Text>
          <Text className='mb-4'>Email: {user?.email}</Text>
          <TouchableOpacity
            onPress={handleLogout}
            className='bg-red-500 px-4 py-2 rounded mb-2'
          >
            <Text className='text-white'>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleLogin}
          className='bg-blue-500 px-4 py-2 rounded mb-2'
        >
          <Text className='text-white'>Login</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        onPress={toggleTheme}
        className='bg-gray-500 px-4 py-2 rounded mb-2'
      >
        <Text className='text-white'>Toggle Theme ({theme})</Text>
      </TouchableOpacity>
      
      {notification && (
        <View className='mt-4 p-2 bg-green-100 rounded'>
          <Text>{notification.message}</Text>
        </View>
      )}
    </View>
  )
}