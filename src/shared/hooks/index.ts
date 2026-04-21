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
export { useBottomSheetLogic } from './useBottomSheetLogic'
export { useButtonLogic } from './useButtonLogic'
export { useFormTextInput } from './useFormTextInput'
export { useHeaderLogic } from './useHeaderLogic'
export { useTextInputLogic } from './useTextInputLogic'
export { useToastLogic } from './useToastLogic'
export { useModalLogic } from './useModalLogic'

// Feature hooks
export { useNetworkState } from './useNetworkState'
export { useNotificationPermission } from './useNotificationPermission'
export { usePushNotifications } from './usePushNotifications'
export { default as useSocialAuth } from './useSocialAuth'
export { useBiometricAuth } from './useBiometricAuth'
