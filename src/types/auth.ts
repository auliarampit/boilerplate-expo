export type { User } from './api'

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: import('./api').User | null
}
