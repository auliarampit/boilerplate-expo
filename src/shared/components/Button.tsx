import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useButtonLogic } from '../hooks/useButtonLogic'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'small' | 'medium' | 'large'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: keyof typeof Ionicons.glyphMap
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  testID?: string
  style?: ViewStyle
  textStyle?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  testID = 'button',
  style,
  textStyle,
}) => {
  const {
    isDisabled,
    getButtonClasses,
    getTextClasses,
    getIconColor,
    getIconSize,
  } = useButtonLogic({
    variant,
    size,
    disabled,
    loading,
    fullWidth,
  })

  const renderIcon = () => {
    if (!icon) return null

    return (
      <Ionicons
        name={icon}
        size={getIconSize()}
        color={getIconColor()}
        style={{
          marginRight: iconPosition === 'left' ? 8 : 0,
          marginLeft: iconPosition === 'right' ? 8 : 0,
        }}
      />
    )
  }

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size={size === 'small' ? 'small' : 'small'}
          color={getIconColor()}
          testID={`${testID}-loading`}
        />
      )
    }

    return (
      <>
        {icon && iconPosition === 'left' && renderIcon()}
        <Text
          className={getTextClasses()}
          style={textStyle}
          testID={`${testID}-text`}
        >
          {title}
        </Text>
        {icon && iconPosition === 'right' && renderIcon()}
      </>
    )
  }

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={isDisabled}
      style={style}
      testID={testID}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  )
}

export default Button
