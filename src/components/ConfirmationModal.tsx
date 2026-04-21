import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { useTranslate } from '@/i18n'
import { useTheme } from './ThemeProvider'
import { getThemeClass } from '@/utils/themeClasses'

interface ConfirmationModalProps {
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  confirmStyle?: 'default' | 'destructive'
  testID?: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  confirmStyle = 'default',
  testID,
}) => {
  const { t } = useTranslate()
  const { isDark } = useTheme()

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onCancel}
      testID={testID}>
      <View className='flex-1 bg-black/50 justify-center items-center p-5'>
        <View
          className={`rounded-xl p-6 w-full max-w-xs shadow-lg ${getThemeClass(isDark, 'background.modal')}`}>
          <Text
            className={`text-lg font-bold text-center mb-3 ${getThemeClass(isDark, 'text.primary')}`}>
            {title}
          </Text>

          <Text
            className={`text-base text-center mb-6 leading-6 ${getThemeClass(isDark, 'text.secondary')}`}>
            {message}
          </Text>

          <View className='flex-row gap-3'>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg items-center border ${getThemeClass(isDark, 'combined.buttonSecondary')}`}
              onPress={onCancel}
              testID='confirmation-modal-cancel'>
              <Text
                className={`text-base font-semibold ${getThemeClass(isDark, 'text.button.secondary')}`}>
                {cancelText || t('common.cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg items-center ${
                confirmStyle === 'destructive'
                  ? getThemeClass(isDark, 'background.button.danger')
                  : getThemeClass(isDark, 'background.button.primary')
              }`}
              onPress={onConfirm}
              testID='confirmation-modal-confirm'>
              <Text
                className={`text-base font-semibold ${getThemeClass(isDark, 'text.button.primary')}`}>
                {confirmText || t('common.confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmationModal
