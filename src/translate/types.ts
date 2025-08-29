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
    retry: string
    refresh: string
    unknownError: string
    example: string
    welcome: string
  }
  auth: {
    login: string
    logout: string
    register: string
    email: string
    emailPlaceholder: string
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
    loginSuccess: string
    loginFailed: string
    registerSuccess: string
    registerFailed: string
    logoutSuccess: string
    profileUpdateSuccess: string
    profileUpdateFailed: string
    preferencesUpdateSuccess: string
    preferencesUpdateFailed: string
    googleSignInFailed: string
    appleSignInFailed: string
    signInCancelled: string
    signInInProgress: string
    playServicesNotAvailable: string
  }
  validation: {
    emailRequired: string
    invalidEmail: string
    passwordRequired: string
    passwordTooShort: string
    confirmPasswordRequired: string
    passwordMismatch: string
    newPasswordSameAsCurrent: string
    phoneRequired: string
    invalidPhone: string
    nameRequired: string
    nameTooShort: string
    nameTooLong: string
    subjectRequired: string
    subjectTooLong: string
    messageRequired: string
    messageTooLong: string
    searchQueryRequired: string
    searchQueryTooLong: string
    commentRequired: string
    commentTooLong: string
    addressTooLong: string
    bioTooLong: string
    ratingRequired: string
    ratingInvalid: string
    titleRequired: string
    titleTooLong: string
    descriptionRequired: string
    descriptionTooLong: string
    streetRequired: string
    streetTooLong: string
    cityRequired: string
    cityTooLong: string
    stateRequired: string
    stateTooLong: string
    postalCodeRequired: string
    invalidPostalCode: string
    countryRequired: string
    countryTooLong: string
    fieldRequired: string
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
    unknownUser: string
    noEmail: string
  }
  settings: {
    title: string
    general: string
    language: string
    theme: string
    light: string
    dark: string
    system: string
    description: string
    autoSaveDescription: string
    languageIndonesian: string
    languageEnglish: string
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
    themeUpdateSuccess: string
    themeUpdateFailed: string
    languageUpdateSuccess: string
    languageUpdateFailed: string
    loadSettingsFailed: string
    clearSettingsSuccess: string
    clearSettingsFailed: string
    toggleTheme: string
  }
  navigation: {
    home: string
    profile: string
    settings: string
  }
  contact: {
    title: string
    subject: string
    message: string
    namePlaceholder: string
    subjectPlaceholder: string
    messagePlaceholder: string
    sendMessage: string
  }
  search: {
    placeholder: string
    search: string
    clear: string
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
    faceId: string
    touchId: string
    iris: string
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
  api: {
    invalidCredentials: string
    userNotFound: string
    emailAlreadyExists: string
    tokenNotFound: string
  }
}

export type TranslationKey =
  | `common.${keyof TranslationKeys['common']}`
  | `auth.${keyof TranslationKeys['auth']}`
  | `home.${keyof TranslationKeys['home']}`
  | `profile.${keyof TranslationKeys['profile']}`
  | `settings.${keyof TranslationKeys['settings']}`
  | `navigation.${keyof TranslationKeys['navigation']}`
  | `contact.${keyof TranslationKeys['contact']}`
  | `search.${keyof TranslationKeys['search']}`
  | `errorBoundary.${keyof TranslationKeys['errorBoundary']}`
  | `biometric.${keyof TranslationKeys['biometric']}`
  | `notifications.${keyof TranslationKeys['notifications']}`
  | `notifications.error.${keyof TranslationKeys['notifications']['error']}`
  | `socialAuth.${keyof TranslationKeys['socialAuth']}`
  | `validation.${keyof TranslationKeys['validation']}`
  | `api.${keyof TranslationKeys['api']}`

export interface TranslateContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}
