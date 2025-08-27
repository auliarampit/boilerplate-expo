import React from 'react'
import { View } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { searchSchema, type SearchFormData } from '../schemas/validationSchemas'
import { FormTextInput } from './FormTextInput'
import Button from './Button'

interface SearchFormProps {
  onSubmit: (data: SearchFormData) => void
  onClear?: () => void
  isLoading?: boolean
  placeholder?: string
  showClearButton?: boolean
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSubmit,
  onClear,
  isLoading = false,
  placeholder = 'Search...',
  showClearButton = true,
}) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
    watch,
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    mode: 'onChange',
    defaultValues: {
      query: '',
    },
  })

  const queryValue = watch('query')
  const hasValue = Boolean(queryValue?.trim())

  const handleFormSubmit = (data: SearchFormData) => {
    if (data.query.trim()) {
      onSubmit(data)
    }
  }

  const handleClear = () => {
    reset()
    onClear?.()
  }

  return (
    <View className="w-full flex-row items-end space-x-2">
      <View className="flex-1">
        <FormTextInput
          name="query"
          control={control}
          placeholder={placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          leftIcon="search"
        />
      </View>

      <Button
        title="Search"
        onPress={handleSubmit(handleFormSubmit)}
        loading={isLoading}
        disabled={!isValid || isLoading || !hasValue}
        variant="primary"
        size="medium"
      />

      {showClearButton && hasValue && (
        <Button
          title="Clear"
          onPress={handleClear}
          disabled={isLoading}
          variant="outline"
          size="medium"
        />
      )}
    </View>
  )
}

export default SearchForm
