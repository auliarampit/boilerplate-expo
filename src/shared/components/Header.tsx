import React from 'react'
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../constants/Colors'

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
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[colorScheme ?? 'light']

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress()
    } else {
      navigation.goBack()
    }
  }

  return (
    <View
      className={`flex-row items-center justify-between px-4 py-2 min-h-[56px] border-b ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
      testID={testID}
    >
      <View className="flex-1 items-start">
        {showBackButton && (
          <TouchableOpacity
            className="p-2 -ml-2"
            onPress={handleBackPress}
            testID={`${testID}-back-button`}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-2 items-center">
        {title && (
          <Text
            className={`text-lg font-semibold font-inter-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
            numberOfLines={1}
            testID={`${testID}-title`}
          >
            {title}
          </Text>
        )}
      </View>

      <View className="flex-1 flex-row items-center justify-end">
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            className="p-2 ml-4"
            onPress={action.onPress}
            testID={action.testID || `${testID}-action-${index}`}
          >
            <Ionicons name={action.icon} size={24} color={colors.text} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default Header
