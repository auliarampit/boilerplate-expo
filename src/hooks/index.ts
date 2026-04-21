// Common state hooks
export {
  useBooleanState,
  useModalState,
  usePasswordVisibility,
  useFocusState,
  useFieldState,
  useMultipleBooleanStates,
  useCounter,
  useArrayState,
} from './useCommonStates'

// Auth hooks
// useAuth — reads Redux auth state (isAuthenticated, user, token) + raw login/logout actions
// useAuthQueries — React Query wrappers with toast notifications (use these in screens)
export { useAuth } from './useAuth'
export {
  useLogin,
  useRegister,
  useLogout,
  useProfile,
  useUpdateProfile,
  usePreferences,
  useUpdatePreferences,
} from './useAuthQueries'

// Settings
export { useSettings } from './useSettings'

// Feature hooks
export { useNetworkState } from './useNetworkState'
