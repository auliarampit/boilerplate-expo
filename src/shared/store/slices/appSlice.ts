import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  isLoading: boolean
  isOnline: boolean
  notification: {
    visible: boolean
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
  } | null
}

const initialState: AppState = {
  isLoading: false,
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
  setOnlineStatus,
  showNotification,
  hideNotification,
} = appSlice.actions

export default appSlice.reducer
