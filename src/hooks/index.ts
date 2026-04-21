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
export { useAuth } from './useAuth'
export {
  useLogin,
  useRegister,
  useLogout,
  useProfile,
  useUpdateProfile,
  usePreferences,
  useUpdatePreferences,
} from './useSimpleAuth'

// Settings
export { useSettings } from './useSettings'

// UI hooks
export { useButtonLogic } from './useButtonLogic'
export { useFormTextInput } from './useFormTextInput'
export { useTextInputLogic } from './useTextInputLogic'
export { useToastLogic } from './useToastLogic'

// Feature hooks
export { useNetworkState } from './useNetworkState'
