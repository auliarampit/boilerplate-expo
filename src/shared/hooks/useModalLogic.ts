import { useColorScheme, Dimensions } from 'react-native'

type ModalSize = 'small' | 'medium' | 'large' | 'full'
type ModalAnimation = 'slide' | 'fade' | 'none'

interface UseModalLogicProps {
  size: ModalSize
  animation: ModalAnimation
  closeOnBackdrop: boolean
  showCloseButton: boolean
  onClose: () => void
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export const useModalLogic = ({
  size,
  animation,
  closeOnBackdrop,
  showCloseButton,
  onClose,
}: UseModalLogicProps) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose()
    }
  }

  const getModalSize = () => {
    const sizeMap = {
      small: {
        width: Math.min(screenWidth * 0.8, 400),
        maxHeight: screenHeight * 0.4,
      },
      medium: {
        width: Math.min(screenWidth * 0.85, 500),
        maxHeight: screenHeight * 0.6,
      },
      large: {
        width: Math.min(screenWidth * 0.9, 600),
        maxHeight: screenHeight * 0.8,
      },
      full: {
        width: screenWidth * 0.95,
        maxHeight: screenHeight * 0.9,
      },
    }
    return sizeMap[size]
  }

  const getAnimationType = () => {
    const animationMap = {
      slide: 'slide' as const,
      fade: 'fade' as const,
      none: 'none' as const,
    }
    return animationMap[animation]
  }

  const getOverlayClasses = () => {
    return 'flex-1 justify-center items-center bg-black bg-opacity-50 p-4'
  }

  const getModalClasses = () => {
    const baseClasses = 'rounded-2xl shadow-2xl'
    const backgroundClasses = isDark ? 'bg-gray-900' : 'bg-white'

    return `${baseClasses} ${backgroundClasses}`
  }

  const getHeaderClasses = () => {
    const baseClasses = 'flex-row items-center justify-between p-6'
    const borderClasses = isDark
      ? 'border-b border-gray-700'
      : 'border-b border-gray-200'

    return `${baseClasses} ${borderClasses}`
  }

  const getTitleClasses = () => {
    const baseClasses = 'text-xl font-inter-semibold flex-1'
    const colorClasses = isDark ? 'text-white' : 'text-gray-900'

    return `${baseClasses} ${colorClasses}`
  }

  const getContentClasses = () => {
    return 'p-6'
  }

  const getCloseButtonClasses = () => {
    const baseClasses = 'p-2 rounded-full'
    const backgroundClasses = isDark
      ? 'bg-gray-800 active:bg-gray-700'
      : 'bg-gray-100 active:bg-gray-200'

    return `${baseClasses} ${backgroundClasses}`
  }

  const getCloseIconColor = () => {
    return isDark ? '#9CA3AF' : '#6B7280'
  }

  return {
    isDark,
    handleBackdropPress,
    getModalSize,
    getAnimationType,
    getOverlayClasses,
    getModalClasses,
    getHeaderClasses,
    getTitleClasses,
    getContentClasses,
    getCloseButtonClasses,
    getCloseIconColor,
  }
}
