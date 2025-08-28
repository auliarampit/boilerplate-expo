import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  Dimensions,
  Modal as RNModal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { getThemeClass } from '../constants/themeClasses'
import { useTheme } from './ThemeProvider'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface ModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  showCloseButton?: boolean
  closeOnBackdropPress?: boolean
  animationType?: 'none' | 'slide' | 'fade'
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  testID?: string
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdropPress = true,
  animationType = 'fade',
  size = 'medium',
  testID = 'modal',
}) => {
  const { isDark, colors } = useTheme()

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose()
    }
  }

  const getModalSize = () => {
    switch (size) {
      case 'small':
        return {
          width: screenWidth * 0.8,
          maxHeight: screenHeight * 0.4,
        }
      case 'medium':
        return {
          width: screenWidth * 0.9,
          maxHeight: screenHeight * 0.6,
        }
      case 'large':
        return {
          width: screenWidth * 0.95,
          maxHeight: screenHeight * 0.8,
        }
      case 'fullscreen':
        return {
          width: screenWidth,
          height: screenHeight,
        }
      default:
        return {
          width: screenWidth * 0.9,
          maxHeight: screenHeight * 0.6,
        }
    }
  }

  const modalSize = getModalSize()
  const isFullscreen = size === 'fullscreen'

  return (
    <RNModal
      visible={visible}
      transparent={!isFullscreen}
      animationType={animationType}
      onRequestClose={onClose}
      testID={testID}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View
          className={`flex-1 ${isFullscreen ? '' : 'justify-center items-center bg-black/50'}`}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              className={`${getThemeClass(isDark, 'background.modal')} ${isFullscreen ? 'flex-1' : 'rounded-lg shadow-lg'}`}
              style={modalSize}
              testID={`${testID}-content`}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <View
                  className={`flex-row items-center justify-between p-4 ${isFullscreen ? '' : 'border-b'} ${getThemeClass(isDark, 'border.secondary')}`}
                >
                  <View className="flex-1">
                    {title && (
                      <Text
                        className={`text-lg font-semibold font-inter-semibold ${getThemeClass(isDark, 'text.primary')}`}
                        testID={`${testID}-title`}
                      >
                        {title}
                      </Text>
                    )}
                  </View>

                  {showCloseButton && (
                    <TouchableOpacity
                      className="p-2 -mr-2"
                      onPress={onClose}
                      testID={`${testID}-close-button`}
                    >
                      <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Content */}
              <View
                className={`flex-1 ${isFullscreen ? 'p-0' : 'p-4'}`}
                testID={`${testID}-body`}
              >
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  )
}

export default Modal
