import React from 'react'
import { View, ActivityIndicator, useColorScheme } from 'react-native'

interface LoadingProps {
  size?: 'small' | 'large'
  color?: string
  overlay?: boolean
  className?: string
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color,
  overlay = false,
  className = '',
}) => {
  const colorScheme = useColorScheme()

  const getDefaultColor = () => {
    if (color) return color
    return colorScheme === 'dark' ? '#ffffff' : '#000000'
  }

  const containerClasses = overlay
    ? `absolute inset-0 bg-black/50 dark:bg-white/20 flex-1 justify-center items-center z-50 ${className}`
    : `flex-1 justify-center items-center ${className}`

  return (
    <View className={containerClasses}>
      <ActivityIndicator size={size} color={getDefaultColor()} />
    </View>
  )
}

export default Loading
