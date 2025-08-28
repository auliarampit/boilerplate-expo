import React from 'react'
import { View, Text, Modal } from 'react-native'
import { useTranslate } from '@/translate'
import { useTheme } from './ThemeProvider'
import { getThemeClass } from '../constants/themeClasses'
import ModalButton from './ModalButton'

interface ConfirmationModalProps {
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  confirmStyle?: 'default' | 'destructive'
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
}) => {
  const { t } = useTranslate()
  const { isDark } = useTheme()

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-5">
        <View className={`rounded-xl p-6 w-full max-w-xs shadow-lg ${
          getThemeClass(isDark, 'background.modal')
        }`}>
          <Text className={`text-lg font-bold text-center mb-3 ${
            getThemeClass(isDark, 'text.primary')
          }`}>
            {title}
          </Text>
          
          <Text className={`text-base text-center mb-6 leading-6 ${
            getThemeClass(isDark, 'text.secondary')
          }`}>
            {message}
          </Text>
          
          <View className="flex-row gap-3">
            <ModalButton
              title={cancelText || t('common.cancel')}
              onPress={onCancel}
              variant="secondary"
              testID="confirmation-modal-cancel"
            />
            
            <ModalButton
              title={confirmText || t('common.confirm')}
              onPress={onConfirm}
              variant={confirmStyle === 'destructive' ? 'destructive' : 'primary'}
              testID="confirmation-modal-confirm"
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmationModal