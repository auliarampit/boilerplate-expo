import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { useTheme } from './ThemeProvider'
import { getThemeClass } from '../constants/themeClasses'

interface ModalButtonProps {
  title: string
  onPress: () => void
  variant: 'primary' | 'secondary' | 'destructive'
  testID?: string
}

const ModalButton: React.FC<ModalButtonProps> = ({
  title,
  onPress,
  variant,
  testID,
}) => {
  const { isDark } = useTheme()

  const getButtonClasses = () => {
    const baseClasses = 'flex-1 py-3 px-4 rounded-lg items-center'

    switch (variant) {
      case 'primary':
        return `${baseClasses} ${getThemeClass(isDark, 'background.button.primary')}`
      case 'secondary':
        return `${baseClasses} border ${getThemeClass(isDark, 'combined.buttonSecondary')}`
      case 'destructive':
        return `${baseClasses} ${getThemeClass(isDark, 'background.button.danger')}`
      default:
        return `${baseClasses} ${getThemeClass(isDark, 'background.button.primary')}`
    }
  }

  const getTextClasses = () => {
    const baseClasses = 'text-base font-semibold'

    switch (variant) {
      case 'primary':
      case 'destructive':
        return `${baseClasses} ${getThemeClass(isDark, 'text.button.primary')}`
      case 'secondary':
        return `${baseClasses} ${getThemeClass(isDark, 'text.button.secondary')}`
      default:
        return `${baseClasses} ${getThemeClass(isDark, 'text.button.primary')}`
    }
  }

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      testID={testID}>
      <Text className={getTextClasses()}>{title}</Text>
    </TouchableOpacity>
  )
}

export default ModalButton
