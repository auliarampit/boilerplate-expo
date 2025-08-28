import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  isLoading: boolean
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'id'
  isOnline: boolean
  notification: {
    visible: boolean
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
  } | null
}

const initialState: AppState = {
  isLoading: false,
  theme: 'system',
  language: 'en',
  isOnline: true,
  notification: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
    },
    setLanguage: (state, action: PayloadAction<'en' | 'id'>) => {
      state.language = action.payload
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload
    },
    showNotification: (
      state,
      action: PayloadAction<{
        message: string
        type: 'success' | 'error' | 'warning' | 'info'
      }>
    ) => {
      state.notification = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type,
      }
    },
    hideNotification: (state) => {
      state.notification = null
    },
  },
})

export const {
  setLoading,
  setTheme,
  setLanguage,
  setOnlineStatus,
  showNotification,
  hideNotification,
} = appSlice.actions

export default appSlice.reducer
