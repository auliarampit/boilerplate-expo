import React from 'react'
import { View, Text } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  contactSchema,
  type ContactFormData,
} from '../schemas/validationSchemas'
import { FormTextInput } from './FormTextInput'
import Button from './Button'
import { useTranslate } from '@/translate'

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void
  isLoading?: boolean
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslate()
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
  })

  const handleFormSubmit = (data: ContactFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <View className='w-full space-y-4'>
      <Text className='text-2xl font-inter-bold text-center mb-6 dark:text-white'>
        {t('contact.title')}
      </Text>

      <FormTextInput
        name='name'
        control={control}
        label={t('profile.name')}
        placeholder={t('contact.namePlaceholder')}
        autoCapitalize='words'
        autoComplete='name'
        leftIcon='person'
        required
      />

      <FormTextInput
        name='email'
        control={control}
        label={t('auth.email')}
        placeholder={t('auth.emailPlaceholder')}
        keyboardType='email-address'
        autoCapitalize='none'
        autoComplete='email'
        leftIcon='mail'
        required
      />

      <FormTextInput
        name='subject'
        control={control}
        label={t('contact.subject')}
        placeholder={t('contact.subjectPlaceholder')}
        autoCapitalize='sentences'
        leftIcon='chatbubble'
        required
      />

      <FormTextInput
        name='message'
        control={control}
        label={t('contact.message')}
        placeholder={t('contact.messagePlaceholder')}
        multiline
        numberOfLines={4}
        autoCapitalize='sentences'
        leftIcon='document-text'
        required
      />

      <Button
        title={t('contact.sendMessage')}
        onPress={handleSubmit(handleFormSubmit)}
        loading={isLoading}
        disabled={!isValid || isLoading}
        variant='primary'
        size='large'
        fullWidth
      />
    </View>
  )
}

export default ContactForm
