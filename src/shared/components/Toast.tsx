import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useToastLogic } from '../hooks/useToastLogic'

type ToastType = 'success' | 'error' | 'warning' | 'info'
type ToastPosition = 'top' | 'bottom'

interface ToastProps {
  visible: boolean
  message: string
  type?: ToastType
  position?: ToastPosition
  duration?: number
  onHide: () => void
  action?: {
    label: string
    onPress: () => void
  }
  testID?: string
}

const { width: screenWidth } = Dimensions.get('window')

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  position = 'top',
  duration = 4000,
  onHide,
  action,
  testID = 'toast',
}) => {
  const {
    translateY,
    opacity,
    isDark,
    handlePress,
    toastConfig,
    containerClasses,
    toastClasses,
    messageClasses,
    actionClasses,
  } = useToastLogic({
    visible,
    type,
    position,
    duration,
    onHide,
    action,
  })

  if (!visible) return null

  const config = toastConfig

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY }],
          opacity,
          maxWidth: screenWidth - 32,
        },
      ]}
      className={containerClasses}
      testID={testID}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        testID={`${testID}-container`}>
        <View
          className={toastClasses}
          style={{
            borderLeftColor: config.borderColor,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <Ionicons
            name={config.icon}
            size={20}
            color={config.backgroundColor}
            testID={`${testID}-icon`}
          />

          <Text
            className={messageClasses}
            numberOfLines={3}
            testID={`${testID}-message`}>
            {message}
          </Text>

          {action && (
            <TouchableOpacity
              onPress={action.onPress}
              testID={`${testID}-action`}>
              <Text
                className={actionClasses}
                style={{ color: config.backgroundColor }}>
                {action.label}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handlePress}
            style={{ marginLeft: 8 }}
            testID={`${testID}-close`}>
            <Ionicons
              name='close'
              size={16}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default Toast
