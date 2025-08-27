import { z } from 'zod'

// Common validation patterns
const emailSchema = z
  .string()
  .min(1, 'validation.emailRequired')
  .email('validation.invalidEmail')

const passwordSchema = z
  .string()
  .min(1, 'validation.passwordRequired')
  .min(6, 'validation.passwordTooShort')

const phoneSchema = z
  .string()
  .min(1, 'validation.phoneRequired')
  .regex(/^[+]?[0-9\s\-\(\)]+$/, 'validation.invalidPhone')

const nameSchema = z
  .string()
  .min(1, 'validation.nameRequired')
  .min(2, 'validation.nameTooShort')
  .max(50, 'validation.nameTooLong')

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'validation.confirmPasswordRequired'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'validation.passwordMismatch',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'validation.confirmPasswordRequired'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'validation.passwordMismatch',
    path: ['confirmPassword'],
  })

// Profile schemas
export const profileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
})

export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'validation.confirmPasswordRequired'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'validation.passwordMismatch',
    path: ['confirmPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: 'validation.newPasswordSameAsCurrent',
    path: ['newPassword'],
  })

// Contact schemas
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .min(1, 'validation.subjectRequired')
    .max(100, 'validation.subjectTooLong'),
  message: z
    .string()
    .min(1, 'validation.messageRequired')
    .max(1000, 'validation.messageTooLong'),
})

// Search schemas
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'validation.searchQueryRequired')
    .max(100, 'validation.searchQueryTooLong'),
})

// Comment schemas
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'validation.commentRequired')
    .max(500, 'validation.commentTooLong'),
})

// Additional schemas
export const updateProfileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  address: z.string().max(200, 'validation.addressTooLong').optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  bio: z.string().max(300, 'validation.bioTooLong').optional(),
})

export const feedbackSchema = z.object({
  rating: z
    .number()
    .min(1, 'validation.ratingRequired')
    .max(5, 'validation.ratingInvalid'),
  title: z
    .string()
    .min(1, 'validation.titleRequired')
    .max(100, 'validation.titleTooLong'),
  comment: z
    .string()
    .min(1, 'validation.commentRequired')
    .max(500, 'validation.commentTooLong'),
  category: z.enum(['bug', 'feature', 'improvement', 'other']).optional(),
})

export const reportSchema = z.object({
  type: z.enum(['spam', 'inappropriate', 'harassment', 'fake', 'other']),
  description: z
    .string()
    .min(1, 'validation.descriptionRequired')
    .max(500, 'validation.descriptionTooLong'),
  evidence: z.string().optional(),
})

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
})

export const addressSchema = z.object({
  street: z
    .string()
    .min(1, 'validation.streetRequired')
    .max(100, 'validation.streetTooLong'),
  city: z
    .string()
    .min(1, 'validation.cityRequired')
    .max(50, 'validation.cityTooLong'),
  state: z
    .string()
    .min(1, 'validation.stateRequired')
    .max(50, 'validation.stateTooLong'),
  postalCode: z
    .string()
    .min(1, 'validation.postalCodeRequired')
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, 'validation.invalidPostalCode'),
  country: z
    .string()
    .min(1, 'validation.countryRequired')
    .max(50, 'validation.countryTooLong'),
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type SearchFormData = z.infer<typeof searchSchema>
export type CommentFormData = z.infer<typeof commentSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type FeedbackFormData = z.infer<typeof feedbackSchema>
export type ReportFormData = z.infer<typeof reportSchema>
export type NotificationSettingsFormData = z.infer<
  typeof notificationSettingsSchema
>
export type AddressFormData = z.infer<typeof addressSchema>
