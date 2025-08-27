import React from 'react'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'

interface StatusBarProps {
  style?: 'auto' | 'inverted' | 'light' | 'dark'
  backgroundColor?: string
  translucent?: boolean
}

const StatusBar: React.FC<StatusBarProps> = ({
  style = 'auto',
  backgroundColor,
  translucent = true,
}) => {
  const colorScheme = useColorScheme()

  const getStatusBarStyle = () => {
    if (style !== 'auto') return style
    return colorScheme === 'dark' ? 'light' : 'dark'
  }

  return (
    <ExpoStatusBar
      style={getStatusBarStyle()}
      backgroundColor={backgroundColor}
      translucent={translucent}
    />
  )
}

export default StatusBar
