export const THEME_CLASSES = {
  background: {
    primary: {
      light: 'bg-white',
      dark: 'bg-gray-900',
    },
    secondary: {
      light: 'bg-gray-100',
      dark: 'bg-gray-800',
    },
    modal: {
      light: 'bg-white',
      dark: 'bg-gray-900',
    },
    card: {
      light: 'bg-white',
      dark: 'bg-gray-800',
    },
    button: {
      primary: {
        light: 'bg-blue-600',
        dark: 'bg-blue-600',
      },
      secondary: {
        light: 'bg-gray-200',
        dark: 'bg-gray-700',
      },
      danger: {
        light: 'bg-red-600',
        dark: 'bg-red-600',
      },
    },
    divider: {
      light: 'bg-gray-300',
      dark: 'bg-gray-600',
    },
  },
  text: {
    primary: {
      light: 'text-gray-900',
      dark: 'text-white',
    },
    secondary: {
      light: 'text-gray-600',
      dark: 'text-gray-300',
    },
    muted: {
      light: 'text-gray-500',
      dark: 'text-gray-400',
    },
    button: {
      primary: {
        light: 'text-white',
        dark: 'text-white',
      },
      secondary: {
        light: 'text-gray-900',
        dark: 'text-white',
      },
      ghost: {
        light: 'text-blue-600',
        dark: 'text-blue-400',
      },
    },
  },
  border: {
    primary: {
      light: 'border-gray-300',
      dark: 'border-gray-600',
    },
    secondary: {
      light: 'border-gray-200',
      dark: 'border-gray-700',
    },
    input: {
      light: 'border-gray-300',
      dark: 'border-gray-600',
    },
  },
  combined: {
    buttonSecondary: {
      light: 'bg-gray-100 border-gray-300',
      dark: 'bg-gray-800 border-gray-600',
    },
    inputField: {
      light: 'bg-white border-gray-300',
      dark: 'bg-gray-800 border-gray-600',
    },
    card: {
      light: 'bg-white border-gray-200',
      dark: 'bg-gray-800 border-gray-700',
    },
  },
} as const

export const getThemeClass = (isDark: boolean, classPath: string) => {
  const keys = classPath.split('.')
  let current: any = THEME_CLASSES

  for (const key of keys) {
    current = current[key]
    if (!current) return ''
  }

  return isDark ? current.dark : current.light
}
