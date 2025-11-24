import authReducer, {
  setLoading,
  loginSuccess,
  logout,
  updateUser,
  setToken,
} from '../authSlice'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
}

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://example.com/avatar.jpg',
  emailVerified: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

describe('authSlice', () => {
  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    describe('setLoading', () => {
      it('should set loading to true', () => {
        const action = setLoading(true)
        const state = authReducer(initialState, action)
        expect(state.isLoading).toBe(true)
      })

      it('should set loading to false', () => {
        const previousState = { ...initialState, isLoading: true }
        const action = setLoading(false)
        const state = authReducer(previousState, action)
        expect(state.isLoading).toBe(false)
      })
    })

    describe('loginSuccess', () => {
      it('should set user, token, and authentication state on login success', () => {
        const token = 'test-token'
        const action = loginSuccess({ user: mockUser, token })
        const state = authReducer(initialState, action)

        expect(state.user).toEqual(mockUser)
        expect(state.token).toBe(token)
        expect(state.isAuthenticated).toBe(true)
        expect(state.isLoading).toBe(false)
      })

      it('should update state when already authenticated', () => {
        const previousState = {
          ...initialState,
          user: mockUser,
          token: 'old-token',
          isAuthenticated: true,
        }
        const newToken = 'new-token'
        const updatedUser = { ...mockUser, firstName: 'Jane' }
        const action = loginSuccess({ user: updatedUser, token: newToken })
        const state = authReducer(previousState, action)

        expect(state.user).toEqual(updatedUser)
        expect(state.token).toBe(newToken)
        expect(state.isAuthenticated).toBe(true)
        expect(state.isLoading).toBe(false)
      })
    })

    describe('logout', () => {
      it('should clear user data and reset authentication state', () => {
        const authenticatedState = {
          user: mockUser,
          token: 'test-token',
          isAuthenticated: true,
          isLoading: false,
        }
        const action = logout()
        const state = authReducer(authenticatedState, action)

        expect(state.user).toBeNull()
        expect(state.token).toBeNull()
        expect(state.isAuthenticated).toBe(false)
        expect(state.isLoading).toBe(false)
      })

      it('should work when already logged out', () => {
        const action = logout()
        const state = authReducer(initialState, action)

        expect(state).toEqual(initialState)
      })
    })

    describe('updateUser', () => {
      it('should update user data when user exists', () => {
        const authenticatedState = {
          ...initialState,
          user: mockUser,
          isAuthenticated: true,
        }
        const updates = {
          firstName: 'Jane',
          lastName: 'Smith',
          emailVerified: false,
        }
        const action = updateUser(updates)
        const state = authReducer(authenticatedState, action)

        expect(state.user).toEqual({
          ...mockUser,
          ...updates,
        })
        expect(state.isAuthenticated).toBe(true)
      })

      it('should not update when user is null', () => {
        const updates = {
          firstName: 'Jane',
          lastName: 'Smith',
        }
        const action = updateUser(updates)
        const state = authReducer(initialState, action)

        expect(state.user).toBeNull()
        expect(state).toEqual(initialState)
      })

      it('should partially update user data', () => {
        const authenticatedState = {
          ...initialState,
          user: mockUser,
          isAuthenticated: true,
        }
        const updates = { avatar: 'https://example.com/new-avatar.jpg' }
        const action = updateUser(updates)
        const state = authReducer(authenticatedState, action)

        expect(state.user).toEqual({
          ...mockUser,
          avatar: 'https://example.com/new-avatar.jpg',
        })
      })
    })

    describe('setToken', () => {
      it('should set the token', () => {
        const token = 'new-token'
        const action = setToken(token)
        const state = authReducer(initialState, action)

        expect(state.token).toBe(token)
        expect(state.user).toBeNull()
        expect(state.isAuthenticated).toBe(false)
      })

      it('should update existing token', () => {
        const previousState = {
          ...initialState,
          token: 'old-token',
          user: mockUser,
          isAuthenticated: true,
        }
        const newToken = 'updated-token'
        const action = setToken(newToken)
        const state = authReducer(previousState, action)

        expect(state.token).toBe(newToken)
        expect(state.user).toEqual(mockUser)
        expect(state.isAuthenticated).toBe(true)
      })
    })
  })

  describe('action creators', () => {
    it('should create setLoading action', () => {
      const action = setLoading(true)
      expect(action).toEqual({
        type: 'auth/setLoading',
        payload: true,
      })
    })

    it('should create loginSuccess action', () => {
      const payload = { user: mockUser, token: 'test-token' }
      const action = loginSuccess(payload)
      expect(action).toEqual({
        type: 'auth/loginSuccess',
        payload,
      })
    })

    it('should create logout action', () => {
      const action = logout()
      expect(action).toEqual({
        type: 'auth/logout',
      })
    })

    it('should create updateUser action', () => {
      const payload = { firstName: 'Jane' }
      const action = updateUser(payload)
      expect(action).toEqual({
        type: 'auth/updateUser',
        payload,
      })
    })

    it('should create setToken action', () => {
      const payload = 'test-token'
      const action = setToken(payload)
      expect(action).toEqual({
        type: 'auth/setToken',
        payload,
      })
    })
  })
})