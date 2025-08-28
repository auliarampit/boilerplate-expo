export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
}

export interface User {
  id: string
  email: string
  name: string
}
