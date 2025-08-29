import * as AppleAuthentication from 'expo-apple-authentication'
import * as AuthSession from 'expo-auth-session'
import * as Crypto from 'expo-crypto'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { SocialAuthConfig } from '../types/navigation'
import { FACEBOOK_CONFIG, FACEBOOK_SCOPES, FACEBOOK_FIELDS } from '@/shared/constants/facebook'
import { useTranslate } from '@/translate'

// Conditional import for Google Sign-in to handle Expo Go compatibility
let GoogleSignin: any = null
let statusCodes: any = null

try {
  const googleSigninModule = require('@react-native-google-signin/google-signin')
  GoogleSignin = googleSigninModule.GoogleSignin
  statusCodes = googleSigninModule.statusCodes
} catch (error) {
  console.warn('Google Sign-in not available in Expo Go. Use development build for full functionality.')
}

export interface SocialAuthUser {
  id: string
  email: string | null
  name: string | null
  photo: string | null
  provider: 'google' | 'apple' | 'facebook'
}

export interface SocialAuthState {
  user: SocialAuthUser | null
  isLoading: boolean
  error: string | null
  isGoogleAvailable: boolean
  isAppleAvailable: boolean
  isFacebookAvailable: boolean
}

const useSocialAuth = (config?: SocialAuthConfig) => {
  const { t } = useTranslate()
  const [state, setState] = useState<SocialAuthState>({
    user: null,
    isLoading: false,
    error: null,
    isGoogleAvailable: false,
    isAppleAvailable: false,
    isFacebookAvailable: false,
  })

  useEffect(() => {
    initializeProviders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initializeProviders = async () => {
    try {
      // Initialize Google Sign-In (only if module is available)
      if (config?.google && GoogleSignin) {
        await GoogleSignin.configure({
          webClientId: config.google.webClientId,
          iosClientId: config.google.iosClientId,
          offlineAccess: true,
        })
        setState((prev) => ({ ...prev, isGoogleAvailable: true }))
      } else if (config?.google && !GoogleSignin) {
        console.warn('Google Sign-in configuration provided but module not available')
      }

      // Check Apple Sign-In availability
      if (Platform.OS === 'ios') {
        const isAvailable = await AppleAuthentication.isAvailableAsync()
        setState((prev) => ({ ...prev, isAppleAvailable: isAvailable }))
      }

      // Facebook is available if config is provided
      if (config?.facebook) {
        setState((prev) => ({ ...prev, isFacebookAvailable: true }))
      }
    } catch (error) {
      console.error('Error initializing social auth providers:', error)
    }
  }

  const signInWithGoogle = async (): Promise<SocialAuthUser | null> => {
    if (!GoogleSignin) {
      throw new Error(t('socialAuth.googleNotAvailable'))
    }

    if (!state.isGoogleAvailable) {
      throw new Error(t('socialAuth.googleNotAvailable'))
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()

      const user: SocialAuthUser = {
        id: userInfo.data?.user.id || '',
        email: userInfo.data?.user.email || null,
        name: userInfo.data?.user.name || null,
        photo: userInfo.data?.user.photo || null,
        provider: 'google',
      }

      setState((prev) => ({ ...prev, user, isLoading: false }))
      return user
    } catch (error: any) {
      let errorMessage = t('socialAuth.signInFailed')

      if (statusCodes && error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = t('socialAuth.signInCancelled')
      } else if (statusCodes && error.code === statusCodes.IN_PROGRESS) {
        errorMessage = t('socialAuth.signInInProgress')
      } else if (statusCodes && error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = t('socialAuth.playServicesNotAvailable')
      }

      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }))
      throw new Error(errorMessage)
    }
  }

  const signInWithApple = async (): Promise<SocialAuthUser | null> => {
    if (!state.isAppleAvailable) {
      throw new Error('Apple Sign-In is not available')
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      const user: SocialAuthUser = {
        id: credential.user,
        email: credential.email,
        name: credential.fullName
          ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
          : null,
        photo: null,
        provider: 'apple',
      }

      setState((prev) => ({ ...prev, user, isLoading: false }))
      return user
    } catch (error: any) {
      let errorMessage = t('auth.appleSignInFailed')

      if (error.code === 'ERR_CANCELED') {
        errorMessage = t('auth.signInCancelled')
      }

      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }))
      throw new Error(errorMessage)
    }
  }

  const signInWithFacebook = async (): Promise<SocialAuthUser | null> => {
    if (!state.isFacebookAvailable || !config?.facebook) {
      throw new Error('Facebook Sign-In is not available')
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const redirectUri = AuthSession.makeRedirectUri()
      const state = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString()
      )

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const authUrl =
        `${FACEBOOK_CONFIG.OAUTH_URL}?` +
        `client_id=${config.facebook.clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${FACEBOOK_SCOPES.EMAIL},${FACEBOOK_SCOPES.PUBLIC_PROFILE}&` +
        `state=${state}`

      const request = new AuthSession.AuthRequest({
        clientId: config.facebook.clientId,
        scopes: [FACEBOOK_SCOPES.EMAIL, FACEBOOK_SCOPES.PUBLIC_PROFILE],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        state,
      })

      const result = await request.promptAsync({
        authorizationEndpoint: FACEBOOK_CONFIG.OAUTH_URL,
      })

      if (result.type === 'success' && result.params.code) {
        // Exchange code for access token
        const tokenResponse = await fetch(
          `${FACEBOOK_CONFIG.TOKEN_URL}?` +
            `client_id=${config.facebook.clientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `code=${result.params.code}`
        )

        const tokenData = await tokenResponse.json()

        if (tokenData.access_token) {
          // Get user info
          const userResponse = await fetch(
            `${FACEBOOK_CONFIG.USER_INFO_URL}?fields=${FACEBOOK_FIELDS.USER_INFO}&access_token=${tokenData.access_token}`
          )

          const userData = await userResponse.json()

          const user: SocialAuthUser = {
            id: userData.id,
            email: userData.email || null,
            name: userData.name || null,
            photo: userData.picture?.data?.url || null,
            provider: 'facebook',
          }

          setState((prev) => ({ ...prev, user, isLoading: false }))
          return user
        }
      }

      throw new Error('Facebook authentication failed')
    } catch (error: any) {
      const errorMessage = error.message || 'Facebook sign-in failed'
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }))
      throw new Error(errorMessage)
    }
  }

  const signOut = async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Sign out from Google if user was signed in with Google and GoogleSignin is available
      if (state.user?.provider === 'google' && state.isGoogleAvailable && GoogleSignin) {
        await GoogleSignin.signOut()
      }

      setState((prev) => ({
        ...prev,
        user: null,
        isLoading: false,
        error: null,
      }))
    } catch (error: any) {
      const errorMessage = error.message || t('socialAuth.signOutFailed')
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }))
      throw new Error(errorMessage)
    }
  }

  const getCurrentUser = async (): Promise<SocialAuthUser | null> => {
    try {
      if (state.isGoogleAvailable && GoogleSignin) {
        const userInfo = await GoogleSignin.getCurrentUser()
        if (userInfo) {
          const user: SocialAuthUser = {
            id: userInfo.user.id,
            email: userInfo.user.email,
            name: userInfo.user.name,
            photo: userInfo.user.photo,
            provider: 'google',
          }
          setState((prev) => ({ ...prev, user }))
          return user
        }
      }
      return null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  return {
    ...state,
    signInWithGoogle,
    signInWithApple,
    signInWithFacebook,
    signOut,
    getCurrentUser,
  }
}

export default useSocialAuth
