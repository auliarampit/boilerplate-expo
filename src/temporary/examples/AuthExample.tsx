import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import {
  useLogin,
  useRegister,
  useProfile,
  useLogout,
} from '@/shared/hooks/useSimpleAuth'
import { useTranslate } from '@/translate'

// Contoh penggunaan Login
export const LoginExample = () => {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password123')
  const loginMutation = useLogin()
  const { t } = useTranslate()

  const handleLogin = () => {
    loginMutation.mutate({ email, password })
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>{t('auth.loginTitle')}</Text>
      <TextInput
        placeholder={t('auth.email')}
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />
      <TextInput
        placeholder={t('auth.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loginMutation.isPending}
        style={{ backgroundColor: 'blue', padding: 15, alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>
          {loginMutation.isPending ? t('common.loading') : t('auth.login')}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

// Contoh penggunaan Register
export const RegisterExample = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const registerMutation = useRegister()
  const { t } = useTranslate()

  const handleRegister = () => {
    registerMutation.mutate(formData)
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>{t('auth.registerTitle')}</Text>
      <TextInput
        placeholder={t('profile.name')}
        value={formData.firstName}
        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />
      <TextInput
        placeholder={t('profile.name')}
        value={formData.lastName}
        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />
      <TextInput
        placeholder={t('auth.email')}
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />
      <TextInput
        placeholder={t('auth.password')}
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />
      <TouchableOpacity
        onPress={handleRegister}
        disabled={registerMutation.isPending}
        style={{ backgroundColor: 'green', padding: 15, alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>
          {registerMutation.isPending
            ? t('common.loading')
            : t('auth.register')}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

// Contoh penggunaan Profile
export const ProfileExample = () => {
  const { data: profile, isLoading, error } = useProfile()
  const logoutMutation = useLogout()
  const { t } = useTranslate()

  if (isLoading) {
    return <Text>{t('common.loading')}</Text>
  }

  if (error) {
    return <Text>{t('common.error')}</Text>
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>{t('profile.title')}</Text>
      {profile && (
        <View>
          <Text>
            {t('profile.name')}: {profile.firstName} {profile.lastName}
          </Text>
          <Text>
            {t('auth.email')}: {profile.email}
          </Text>
          <Text>
            Verified: {profile.emailVerified ? t('common.yes') : t('common.no')}
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => logoutMutation.mutate()}
        style={{
          backgroundColor: 'red',
          padding: 15,
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Text style={{ color: 'white' }}>{t('auth.logout')}</Text>
      </TouchableOpacity>
    </View>
  )
}
