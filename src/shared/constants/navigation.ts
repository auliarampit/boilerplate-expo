export const AUTH_ROUTES = {
  LOGIN: 'Login' as const,
  REGISTER: 'Register' as const,
  FORGOT_PASSWORD: 'ForgotPassword' as const,
};

export const APP_ROUTES = {
  HOME: 'Home' as const,
  PROFILE: 'Profile' as const,
  SETTINGS: 'Settings' as const,
};

export const ROOT_ROUTES = {
  AUTH: 'Auth' as const,
  APP: 'App' as const,
};

export const NAVIGATION_OPTIONS = {
  HEADER_SHOWN: false,
  ANIMATION_TYPE_CARD: 'card' as const,
  ANIMATION_TYPE_MODAL: 'modal' as const,
};