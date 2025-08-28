import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../constants/Colors'
import { useTheme } from './ThemeProvider'
import { getThemeClass } from '../constants/themeClasses'

interface HeaderAction {
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
  testID?: string
}

interface HeaderProps {
  title?: string
  showBackButton?: boolean
  onBackPress?: () => void
  actions?: HeaderAction[]
  testID?: string
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  actions = [],
  testID = 'header',
}) => {
  const navigation = useNavigation()
  const { isDark } = useTheme()
  const colors = Colors[isDark ? 'dark' : 'light']

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress()
    } else {
      navigation.goBack()
    }
  }

  return (
    <View
      className={`flex-row items-center justify-between px-4 py-2 min-h-[56px] border-b ${getThemeClass(isDark, 'combined.card')}`}
      testID={testID}>
      <View className='flex-1 items-start'>
        {showBackButton && (
          <TouchableOpacity
            className='p-2 -ml-2'
            onPress={handleBackPress}
            testID={`${testID}-back-button`}>
            <Ionicons name='arrow-back' size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View className='flex-2 items-center'>
        {title && (
          <Text
            className={`text-lg font-semibold font-inter-semibold ${getThemeClass(isDark, 'text.primary')}`}
            numberOfLines={1}
            testID={`${testID}-title`}>
            {title}
          </Text>
        )}
      </View>

      <View className='flex-1 flex-row items-center justify-end'>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            className='p-2 ml-4'
            onPress={action.onPress}
            testID={action.testID || `${testID}-action-${index}`}>
            <Ionicons name={action.icon} size={24} color={colors.text} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default Header
