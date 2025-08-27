import { useColorScheme } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

interface HeaderAction {
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
  testID?: string
}

interface UseHeaderLogicProps {
  title?: string
  showBackButton?: boolean
  actions?: HeaderAction[]
  onBackPress?: () => void
}

export const useHeaderLogic = ({
  title,
  showBackButton = false,
  actions = [],
  onBackPress,
}: UseHeaderLogicProps) => {
  const navigation = useNavigation()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress()
    } else if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  const getContainerClasses = () => {
    const baseClasses =
      'flex-row items-center justify-between px-4 py-3 min-h-[56px]'
    const backgroundClasses = isDark ? 'bg-gray-900' : 'bg-white'
    const borderClasses = isDark
      ? 'border-b border-gray-700'
      : 'border-b border-gray-200'

    return `${baseClasses} ${backgroundClasses} ${borderClasses}`
  }

  const getLeftSectionClasses = () => {
    return 'flex-row items-center flex-1'
  }

  const getTitleClasses = () => {
    const baseClasses = 'text-lg font-inter-semibold'
    const colorClasses = isDark ? 'text-white' : 'text-gray-900'
    const marginClasses = showBackButton ? 'ml-3' : ''

    return `${baseClasses} ${colorClasses} ${marginClasses}`
  }

  const getRightSectionClasses = () => {
    return 'flex-row items-center'
  }

  const getBackButtonClasses = () => {
    const baseClasses = 'p-2 rounded-full'
    const backgroundClasses = isDark
      ? 'active:bg-gray-800'
      : 'active:bg-gray-100'

    return `${baseClasses} ${backgroundClasses}`
  }

  const getActionButtonClasses = () => {
    const baseClasses = 'p-2 rounded-full ml-2'
    const backgroundClasses = isDark
      ? 'active:bg-gray-800'
      : 'active:bg-gray-100'

    return `${baseClasses} ${backgroundClasses}`
  }

  const getIconColor = () => {
    return isDark ? '#FFFFFF' : '#374151'
  }

  const getIconSize = () => {
    return 24
  }

  return {
    isDark,
    handleBackPress,
    getContainerClasses,
    getLeftSectionClasses,
    getTitleClasses,
    getRightSectionClasses,
    getBackButtonClasses,
    getActionButtonClasses,
    getIconColor,
    getIconSize,
  }
}
