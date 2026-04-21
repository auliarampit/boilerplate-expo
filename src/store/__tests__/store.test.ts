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
        isOnline: true,
      })
    })
  })

  describe('reducer integration', () => {
    it('should integrate auth reducer correctly', () => {
      const testStore = configureStore({ reducer: { auth: authReducer, app: appReducer } })
      expect(testStore.getState().auth).toBeDefined()
    })

    it('should integrate app reducer correctly', () => {
      const testStore = configureStore({ reducer: { auth: authReducer, app: appReducer } })
      expect(testStore.getState().app).toBeDefined()
    })
  })

  describe('middleware configuration', () => {
    it('should handle actions without serialization errors', () => {
      expect(() => {
        store.dispatch({ type: 'test/action', payload: { test: 'data' } })
      }).not.toThrow()
    })
  })

  describe('action dispatching', () => {
    it('should dispatch auth actions correctly', () => {
      store.dispatch({ type: 'auth/setLoading', payload: true })
      expect(store.getState().auth.isLoading).toBe(true)
    })

    it('should dispatch app setOnlineStatus correctly', () => {
      store.dispatch({ type: 'app/setOnlineStatus', payload: false })
      expect(store.getState().app.isOnline).toBe(false)
    })
  })

  describe('state isolation', () => {
    it('should not affect app slice when updating auth', () => {
      const initialAppState = store.getState().app
      store.dispatch({ type: 'auth/setLoading', payload: true })
      expect(store.getState().app).toEqual(initialAppState)
    })
  })

  describe('type definitions', () => {
    it('should export correct RootState type', () => {
      const state: RootState = store.getState()
      expect(state.auth).toBeDefined()
      expect(state.app).toBeDefined()
      expect(typeof state.auth.isAuthenticated).toBe('boolean')
    })

    it('should export correct AppDispatch type', () => {
      const dispatch: AppDispatch = store.dispatch
      expect(typeof dispatch).toBe('function')
    })
  })
})
