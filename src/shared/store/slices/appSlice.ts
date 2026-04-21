import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  isLoading: boolean
  isOnline: boolean
}

const initialState: AppState = {
  isLoading: false,
  isOnline: true,
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
  },
})

export const { setLoading, setOnlineStatus } = appSlice.actions

export default appSlice.reducer
