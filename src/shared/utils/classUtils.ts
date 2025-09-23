import { getThemeClass } from '../constants/themeClasses'

/**
 * Utility untuk menggabungkan classes dengan cara yang konsisten
 */
export const combineClasses = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ').trim()
}

/**
 * Utility untuk membuat theme-aware classes
 */
export const createThemeClasses = (isDark: boolean) => ({
  /**
   * Background classes
   */
  background: {
    primary: getThemeClass(isDark, 'background.primary'),
    secondary: getThemeClass(isDark, 'background.secondary'),
    modal: getThemeClass(isDark, 'background.modal'),
    card: getThemeClass(isDark, 'background.card'),
    button: {
      primary: getThemeClass(isDark, 'background.button.primary'),
      secondary: getThemeClass(isDark, 'background.button.secondary'),
      danger: getThemeClass(isDark, 'background.button.danger'),
    },
    divider: getThemeClass(isDark, 'background.divider'),
  },

  /**
   * Text classes
   */
  text: {
    primary: getThemeClass(isDark, 'text.primary'),
    secondary: getThemeClass(isDark, 'text.secondary'),
    muted: getThemeClass(isDark, 'text.muted'),
    button: {
      primary: getThemeClass(isDark, 'text.button.primary'),
      secondary: getThemeClass(isDark, 'text.button.secondary'),
      ghost: getThemeClass(isDark, 'text.button.ghost'),
    },
  },

  /**
   * Border classes
   */
  border: {
    primary: getThemeClass(isDark, 'border.primary'),
    secondary: getThemeClass(isDark, 'border.secondary'),
    input: getThemeClass(isDark, 'border.input'),
  },

  /**
   * Combined classes
   */
  combined: {
    buttonSecondary: getThemeClass(isDark, 'combined.buttonSecondary'),
    inputField: getThemeClass(isDark, 'combined.inputField'),
    card: getThemeClass(isDark, 'combined.card'),
  },
})

/**
 * Utility untuk membuat conditional classes berdasarkan state
 */
export const createStateClasses = (conditions: Record<string, boolean | string>) => {
  return Object.entries(conditions)
    .filter(([, condition]) => Boolean(condition))
    .map(([className, condition]) => typeof condition === 'string' ? condition : className)
    .join(' ')
}

/**
 * Utility untuk membuat responsive classes
 */
export const createResponsiveClasses = (
  baseClasses: string,
  conditionalClasses: Record<string, boolean | string>
): string => {
  const stateClasses = createStateClasses(conditionalClasses)
  return combineClasses(baseClasses, stateClasses)
}

/**
 * Utility untuk membuat button classes
 */
export const createButtonClasses = (
  isDark: boolean,
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger',
  size: 'small' | 'medium' | 'large',
  disabled?: boolean
) => {
  const theme = createThemeClasses(isDark)
  const baseClasses = 'rounded-lg font-inter-semibold items-center justify-center'
  
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-lg',
  }[size]

  const variantClasses = {
    primary: theme.background.button.primary,
    secondary: theme.combined.buttonSecondary,
    outline: `border ${theme.border.primary}`,
    ghost: 'bg-transparent',
    danger: theme.background.button.danger,
  }[variant]

  const textClasses = {
    primary: theme.text.button.primary,
    secondary: theme.text.button.secondary,
    outline: theme.text.secondary,
    ghost: theme.text.button.ghost,
    danger: theme.text.button.primary,
  }[variant]

  return {
    container: combineClasses(
      baseClasses,
      sizeClasses,
      variantClasses,
      disabled && 'opacity-50'
    ),
    text: combineClasses(textClasses, disabled && 'opacity-50'),
  }
}

/**
 * Utility untuk membuat input classes
 */
export const createInputClasses = (
  isDark: boolean,
  variant: 'outline' | 'filled',
  size: 'small' | 'medium' | 'large',
  hasError?: boolean,
  isFocused?: boolean,
  disabled?: boolean
) => {
  const theme = createThemeClasses(isDark)
  const baseClasses = 'flex-row items-center rounded-lg'
  
  const sizeClasses = {
    small: 'px-3 py-2',
    medium: 'px-4 py-3',
    large: 'px-5 py-4',
  }[size]

  const variantClasses = {
    outline: `border ${theme.border.input}`,
    filled: `${theme.background.secondary} border-0`,
  }[variant]

  const stateClasses = createStateClasses({
    'opacity-50': Boolean(disabled),
    'border-red-500': Boolean(hasError && !disabled),
    'border-blue-500': Boolean(isFocused && !hasError && !disabled),
  })

  return {
    container: combineClasses(baseClasses, sizeClasses, variantClasses, stateClasses),
    input: combineClasses('flex-1 font-inter', theme.text.primary, 'placeholder:text-gray-500'),
    label: combineClasses(
      'font-inter-medium mb-2',
      hasError ? 'text-red-600' : theme.text.primary,
      size === 'small' ? 'text-sm' : 'text-base'
    ),
    helperText: combineClasses(
      'font-inter mt-1 text-sm',
      hasError ? 'text-red-600' : theme.text.secondary
    ),
  }
}