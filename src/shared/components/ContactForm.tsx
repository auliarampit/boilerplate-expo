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

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void
  isLoading?: boolean
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
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
    <View className="w-full space-y-4">
      <Text className="text-2xl font-inter-bold text-center mb-6 dark:text-white">
        Contact Us
      </Text>

      <FormTextInput
        name="name"
        control={control}
        label="Full Name"
        placeholder="Enter your full name"
        autoCapitalize="words"
        autoComplete="name"
        leftIcon="person"
        required
      />

      <FormTextInput
        name="email"
        control={control}
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        leftIcon="mail"
        required
      />

      <FormTextInput
        name="subject"
        control={control}
        label="Subject"
        placeholder="Enter message subject"
        autoCapitalize="sentences"
        leftIcon="chatbubble"
        required
      />

      <FormTextInput
        name="message"
        control={control}
        label="Message"
        placeholder="Enter your message"
        multiline
        numberOfLines={4}
        autoCapitalize="sentences"
        leftIcon="document-text"
        required
      />

      <Button
        title="Send Message"
        onPress={handleSubmit(handleFormSubmit)}
        loading={isLoading}
        disabled={!isValid || isLoading}
        variant="primary"
        size="large"
        fullWidth
      />
    </View>
  )
}

export default ContactForm
