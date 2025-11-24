import { configureStore } from '@reduxjs/toolkit'
import { store } from '../index'
import authReducer from '../slices/authSlice'
import appReducer from '../slices/appSlice'
import type { RootState, AppDispatch } from '../index'

describe('Store Configuration', () => {
  describe('store setup', () => {
    it('should have the correct initial state structure', () => {
      const state = store.getState()
      
      expect(state).toHaveProperty('auth')
      expect(state).toHaveProperty('app')
    })

    it('should have auth initial state', () => {
      const state = store.getState()
      
      expect(state.auth).toEqual({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      })
    })

    it('should have app initial state', () => {
      const state = store.getState()
      
      expect(state.app).toEqual({
        isLoading: false,
        theme: 'system',
        language: 'en',
        isOnline: true,
        notification: null,
      })
    })
  })

  describe('reducer integration', () => {
    it('should integrate auth reducer correctly', () => {
      const testStore = configureStore({
        reducer: {
          auth: authReducer,
          app: appReducer,
        },
      })

      const initialState = testStore.getState()
      expect(initialState.auth).toBeDefined()
      expect(typeof initialState.auth).toBe('object')
    })

    it('should integrate app reducer correctly', () => {
      const testStore = configureStore({
        reducer: {
          auth: authReducer,
          app: appReducer,
        },
      })

      const initialState = testStore.getState()
      expect(initialState.app).toBeDefined()
      expect(typeof initialState.app).toBe('object')
    })
  })

  describe('middleware configuration', () => {
    it('should have serializable check middleware configured', () => {
      // Test that the store can handle actions without serialization errors
      expect(() => {
        store.dispatch({ type: 'test/action', payload: { test: 'data' } })
      }).not.toThrow()
    })

    it('should ignore persist actions in serializable check', () => {
      // Test that persist actions don't cause serialization warnings
      expect(() => {
        store.dispatch({ type: 'persist/PERSIST', payload: {} })
        store.dispatch({ type: 'persist/REHYDRATE', payload: {} })
      }).not.toThrow()
    })
  })

  describe('action dispatching', () => {
    it('should dispatch auth actions correctly', () => {
      const initialState = store.getState()
      
      store.dispatch({ type: 'auth/setLoading', payload: true })
      
      const newState = store.getState()
      expect(newState.auth.isLoading).toBe(true)
      expect(newState.auth.isLoading).not.toBe(initialState.auth.isLoading)
    })

    it('should dispatch app actions correctly', () => {
      const initialState = store.getState()
      
      store.dispatch({ type: 'app/setTheme', payload: 'dark' })
      
      const newState = store.getState()
      expect(newState.app.theme).toBe('dark')
      expect(newState.app.theme).not.toBe(initialState.app.theme)
    })

    it('should handle multiple actions in sequence', () => {
      store.dispatch({ type: 'auth/setLoading', payload: true })
      store.dispatch({ type: 'app/setLanguage', payload: 'id' })
      store.dispatch({ type: 'app/setOnlineStatus', payload: false })
      
      const state = store.getState()
      expect(state.auth.isLoading).toBe(true)
      expect(state.app.language).toBe('id')
      expect(state.app.isOnline).toBe(false)
    })
  })

  describe('state isolation', () => {
    it('should not affect other slices when updating auth', () => {
      const initialAppState = store.getState().app
      
      store.dispatch({ type: 'auth/setLoading', payload: true })
      
      const newState = store.getState()
      expect(newState.app).toEqual(initialAppState)
    })

    it('should not affect other slices when updating app', () => {
      const initialAuthState = store.getState().auth
      
      store.dispatch({ type: 'app/setTheme', payload: 'light' })
      
      const newState = store.getState()
      expect(newState.auth).toEqual(initialAuthState)
    })
  })

  describe('type definitions', () => {
    it('should export correct RootState type', () => {
      const state: RootState = store.getState()
      
      // Type assertions to ensure correct typing
      expect(state.auth).toBeDefined()
      expect(state.app).toBeDefined()
      expect(typeof state.auth.isAuthenticated).toBe('boolean')
      expect(typeof state.app.theme).toBe('string')
    })

    it('should export correct AppDispatch type', () => {
      const dispatch: AppDispatch = store.dispatch
      
      // Test that dispatch function works with typed actions
      expect(typeof dispatch).toBe('function')
      expect(() => {
        dispatch({ type: 'auth/setLoading', payload: true })
      }).not.toThrow()
    })
  })

  describe('store immutability', () => {
    it('should not mutate state directly', () => {
      const initialState = store.getState()
      const authState = initialState.auth
      
      // Attempt to mutate state directly (should not affect store)
      try {
        (authState as any).isLoading = true
      } catch {
        // Expected in strict mode
      }
      
      const currentState = store.getState()
      expect(currentState.auth.isLoading).toBe(false)
    })

    it('should create new state objects on updates', () => {
      const initialState = store.getState()
      
      store.dispatch({ type: 'auth/setLoading', payload: true })
      
      const newState = store.getState()
      expect(newState).not.toBe(initialState)
      expect(newState.auth).not.toBe(initialState.auth)
    })
  })
})