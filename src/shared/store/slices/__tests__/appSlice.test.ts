import appReducer, {
  setLoading,
  setTheme,
  setLanguage,
  setOnlineStatus,
  showNotification,
  hideNotification,
} from '../appSlice'

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

const mockNotification = {
  message: 'Test notification',
  type: 'success' as const,
}

describe('appSlice', () => {
  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(appReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    describe('setLoading', () => {
      it('should set loading to true', () => {
        const action = setLoading(true)
        const state = appReducer(initialState, action)
        expect(state.isLoading).toBe(true)
      })

      it('should set loading to false', () => {
        const previousState = { ...initialState, isLoading: true }
        const action = setLoading(false)
        const state = appReducer(previousState, action)
        expect(state.isLoading).toBe(false)
      })
    })

    describe('setTheme', () => {
      it('should set theme to light', () => {
        const action = setTheme('light')
        const state = appReducer(initialState, action)
        expect(state.theme).toBe('light')
      })

      it('should set theme to dark', () => {
        const action = setTheme('dark')
        const state = appReducer(initialState, action)
        expect(state.theme).toBe('dark')
      })

      it('should set theme to system', () => {
        const previousState = { ...initialState, theme: 'light' as const }
        const action = setTheme('system')
        const state = appReducer(previousState, action)
        expect(state.theme).toBe('system')
      })
    })

    describe('setLanguage', () => {
      it('should set language to Indonesian', () => {
        const action = setLanguage('id')
        const state = appReducer(initialState, action)
        expect(state.language).toBe('id')
      })

      it('should set language to English', () => {
        const previousState = { ...initialState, language: 'id' as const }
        const action = setLanguage('en')
        const state = appReducer(previousState, action)
        expect(state.language).toBe('en')
      })

      it('should handle switching between supported languages', () => {
        const previousState = { ...initialState, language: 'en' as const }
        const action = setLanguage('id')
        const state = appReducer(previousState, action)
        expect(state.language).toBe('id')
      })
    })

    describe('setOnlineStatus', () => {
      it('should set online status to false', () => {
        const action = setOnlineStatus(false)
        const state = appReducer(initialState, action)
        expect(state.isOnline).toBe(false)
      })

      it('should set online status to true', () => {
        const previousState = { ...initialState, isOnline: false }
        const action = setOnlineStatus(true)
        const state = appReducer(previousState, action)
        expect(state.isOnline).toBe(true)
      })
    })

    describe('showNotification', () => {
      it('should show a success notification', () => {
        const action = showNotification(mockNotification)
        const state = appReducer(initialState, action)
        expect(state.notification).toEqual(mockNotification)
      })

      it('should replace existing notification', () => {
        const existingNotification = {
          visible: true,
          message: 'Existing notification',
          type: 'error' as const,
        }
        const previousState = {
          ...initialState,
          notification: existingNotification,
        }
        const newNotification = {
          message: 'New notification',
          type: 'success' as const,
        }
        const action = showNotification(newNotification)
        const state = appReducer(previousState, action)
        expect(state.notification).toEqual({
          visible: true,
          message: 'New notification',
          type: 'success',
        })
      })

      it('should handle different notification types', () => {
        const errorNotification = {
          message: 'Error occurred',
          type: 'error' as const,
        }
        const action = showNotification(errorNotification)
        const state = appReducer(initialState, action)
        expect(state.notification).toEqual({
          visible: true,
          message: 'Error occurred',
          type: 'error',
        })
      })

      it('should handle info notification type', () => {
        const infoNotification = {
          message: 'Info notification',
          type: 'info' as const,
        }
        const action = showNotification(infoNotification)
        const state = appReducer(initialState, action)
        expect(state.notification).toEqual({
          visible: true,
          message: 'Info notification',
          type: 'info',
        })
      })
    })

    describe('hideNotification', () => {
      it('should hide notification by setting visible to false', () => {
        const previousState = {
          ...initialState,
          notification: {
            visible: true,
            message: 'Test notification',
            type: 'success' as const,
          },
        }
        const action = hideNotification()
        const state = appReducer(previousState, action)
        expect(state.notification).toEqual({
          visible: false,
          message: 'Test notification',
          type: 'success',
        })
      })

      it('should do nothing when no notification exists', () => {
        const action = hideNotification()
        const state = appReducer(initialState, action)
        expect(state.notification).toBeNull()
      })

      it('should hide already hidden notification', () => {
        const hiddenNotification = {
          visible: false,
          message: 'Hidden notification',
          type: 'warning' as const,
        }
        const previousState = {
          ...initialState,
          notification: hiddenNotification,
        }
        const action = hideNotification()
        const state = appReducer(previousState, action)
        expect(state.notification).toEqual({
          visible: false,
          message: 'Hidden notification',
          type: 'warning',
        })
      })
    })
  })

  describe('action creators', () => {
    it('should create setLoading action', () => {
      const action = setLoading(true)
      expect(action).toEqual({
        type: 'app/setLoading',
        payload: true,
      })
    })

    it('should create setTheme action', () => {
      const action = setTheme('dark')
      expect(action).toEqual({
        type: 'app/setTheme',
        payload: 'dark',
      })
    })

    it('should create setLanguage action', () => {
      const action = setLanguage('id')
      expect(action).toEqual({
        type: 'app/setLanguage',
        payload: 'id',
      })
    })

    it('should create setOnlineStatus action', () => {
      const action = setOnlineStatus(false)
      expect(action).toEqual({
        type: 'app/setOnlineStatus',
        payload: false,
      })
    })

    it('should create showNotification action', () => {
      const action = showNotification(mockNotification)
      expect(action).toEqual({
        type: 'app/showNotification',
        payload: mockNotification,
      })
    })

    it('should create hideNotification action', () => {
      const action = hideNotification()
      expect(action).toEqual({
        type: 'app/hideNotification',
      })
    })
  })
})