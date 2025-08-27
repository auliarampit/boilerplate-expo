import React from 'react'
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../constants/Colors'

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
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[colorScheme ?? 'light']

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
              className={`${isDark ? 'bg-gray-900' : 'bg-white'} ${isFullscreen ? 'flex-1' : 'rounded-lg shadow-lg'}`}
              style={modalSize}
              testID={`${testID}-content`}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <View
                  className={`flex-row items-center justify-between p-4 ${isFullscreen ? '' : 'border-b'} ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <View className="flex-1">
                    {title && (
                      <Text
                        className={`text-lg font-semibold font-inter-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
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
