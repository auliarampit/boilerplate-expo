export type Language = 'id' | 'en'

export interface TranslationKeys {
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    save: string
    edit: string
    delete: string
    back: string
    next: string
    previous: string
    close: string
    ok: string
    yes: string
    no: string
  }
  auth: {
    login: string
    logout: string
    register: string
    email: string
    password: string
    confirmPassword: string
    forgotPassword: string
    loginTitle: string
    loginSubtitle: string
    registerTitle: string
    registerSubtitle: string
    emailRequired: string
    passwordRequired: string
    invalidEmail: string
    passwordTooShort: string
    passwordMismatch: string
    loginError: string
    registerError: string
    alreadyHaveAccount: string
    dontHaveAccount: string
  }
  home: {
    title: string
    welcome: string
    recentActivity: string
    quickActions: string
    notifications: string
    noNotifications: string
  }
  profile: {
    title: string
    editProfile: string
    personalInfo: string
    name: string
    phone: string
    address: string
    dateOfBirth: string
    gender: string
    male: string
    female: string
    saveChanges: string
    changePassword: string
    currentPassword: string
    newPassword: string
    profileUpdated: string
    passwordChanged: string
  }
  settings: {
    title: string
    general: string
    language: string
    theme: string
    light: string
    dark: string
    system: string
    notifications: string
    pushNotifications: string
    emailNotifications: string
    privacy: string
    termsOfService: string
    privacyPolicy: string
    about: string
    version: string
    support: string
    contactUs: string
    rateApp: string
  }
  navigation: {
    home: string
    profile: string
    settings: string
  }
  errorBoundary: {
    title: string
    description: string
    retry: string
  }
  biometric: {
    title: string
    subtitle: string
    promptMessage: string
    fallbackLabel: string
    notAvailable: string
    notEnrolled: string
    authenticationFailed: string
    enableBiometric: string
    disableBiometric: string
  }
  notifications: {
    title: string
    permissionDenied: string
    deviceRequired: string
    tokenError: string
    enableNotifications: string
    disableNotifications: string
    testNotification: string
    testTitle: string
    testBody: string
    permissionTitle: string
    permissionMessage: string
    allowNotifications: string
    skipForNow: string
    requesting: string
    skipTitle: string
    skipMessage: string
    skipCancel: string
    skipConfirm: string
    error: {
      deviceRequired: string
      deviceRequiredMessage: string
      permissionDenied: string
      permissionDeniedMessage: string
      general: string
      generalMessage: string
    }
  }
  socialAuth: {
    title: string
    signInWithGoogle: string
    signInWithApple: string
    signInWithFacebook: string
    signOut: string
    googleNotAvailable: string
    appleNotAvailable: string
    facebookNotAvailable: string
    signInCancelled: string
    signInInProgress: string
    playServicesNotAvailable: string
    signInFailed: string
    signOutFailed: string
  }
}

export type TranslationKey =
  | `common.${keyof TranslationKeys['common']}`
  | `auth.${keyof TranslationKeys['auth']}`
  | `home.${keyof TranslationKeys['home']}`
  | `profile.${keyof TranslationKeys['profile']}`
  | `settings.${keyof TranslationKeys['settings']}`
  | `navigation.${keyof TranslationKeys['navigation']}`
  | `errorBoundary.${keyof TranslationKeys['errorBoundary']}`
  | `biometric.${keyof TranslationKeys['biometric']}`
  | `notifications.${keyof TranslationKeys['notifications']}`
  | `notifications.error.${keyof TranslationKeys['notifications']['error']}`
  | `socialAuth.${keyof TranslationKeys['socialAuth']}`

export interface TranslateContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}
