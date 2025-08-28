import React, { useEffect, ReactNode } from 'react'
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import { useTheme } from './ThemeProvider'
import { getThemeClass } from '../constants/themeClasses'
import { GestureDetector } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { useBottomSheetLogic } from '../hooks/useBottomSheetLogic'

type BottomSheetSize = 'small' | 'medium' | 'large' | 'full'

interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: BottomSheetSize
  showHandle?: boolean
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  enableGesture?: boolean
  testID?: string
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  showHandle = true,
  showCloseButton = true,
  closeOnBackdrop = true,
  enableGesture = true,
  testID = 'bottom-sheet',
}) => {
  const { isDark } = useTheme()

  const {
    translateY,
    backdropOpacity,
    panGesture,
    showBottomSheet,
    hideBottomSheet,
    getSheetHeight,
  } = useBottomSheetLogic({
    visible,
    onClose,
    size,
    enableGesture,
  })

  useEffect(() => {
    if (visible) {
      showBottomSheet()
    } else {
      hideBottomSheet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose()
    }
  }

  const getContainerClasses = () => {
    return 'absolute inset-0 z-50 justify-end'
  }

  const getSheetClasses = () => {
    const baseClasses = 'rounded-t-3xl shadow-2xl'
    const backgroundClasses = getThemeClass(isDark, 'background.modal')

    return `${baseClasses} ${backgroundClasses}`
  }

  const getHeaderClasses = () => {
    const baseClasses = 'flex-row items-center justify-between px-6 py-4'
    const borderClasses = isDark
      ? 'border-b border-gray-700'
      : 'border-b border-gray-200'

    return title ? `${baseClasses} ${borderClasses}` : baseClasses
  }

  const getTitleClasses = () => {
    const baseClasses = 'text-lg font-inter-semibold'
    const colorClasses = getThemeClass(isDark, 'text.primary')

    return `${baseClasses} ${colorClasses}`
  }

  const getHandleClasses = () => {
    const baseClasses = 'w-12 h-1 rounded-full mx-auto mb-2'
    const colorClasses = getThemeClass(isDark, 'background.divider')

    return `${baseClasses} ${colorClasses}`
  }

  const getContentClasses = () => {
    return 'px-6 pb-6'
  }

  if (!visible) return null

  const sheetHeight = getSheetHeight()

  return (
    <View className={getContainerClasses()} testID={testID}>
      <Animated.View
        style={[
          {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: backdropOpacity,
          },
        ]}
        className='absolute inset-0'>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View className='flex-1' testID={`${testID}-backdrop`} />
        </TouchableWithoutFeedback>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              height: sheetHeight,
              transform: [{ translateY }],
            },
          ]}
          className={getSheetClasses()}
          testID={`${testID}-content`}>
          {showHandle && (
            <View className='pt-3'>
              <View
                className={getHandleClasses()}
                testID={`${testID}-handle`}
              />
            </View>
          )}

          <View className={getHeaderClasses()}>
            {title && (
              <Text className={getTitleClasses()} testID={`${testID}-title`}>
                {title}
              </Text>
            )}

            {!title && <View />}

            {showCloseButton && (
              <TouchableOpacity
                onPress={onClose}
                className='p-2 -mr-2'
                testID={`${testID}-close`}>
                <Ionicons
                  name='close'
                  size={24}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
              </TouchableOpacity>
            )}
          </View>

          <View className={getContentClasses()}>{children}</View>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}

export default BottomSheet
