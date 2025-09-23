import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileSchema,
  changePasswordSchema,
  contactSchema,
  searchSchema,
  commentSchema,
  updateProfileSchema,
  feedbackSchema,
  reportSchema,
  notificationSettingsSchema,
  addressSchema,
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
  type ProfileFormData,
  type ChangePasswordFormData,
  type ContactFormData,
  type SearchFormData,
  type CommentFormData,
  type UpdateProfileFormData,
  type FeedbackFormData,
  type ReportFormData,
  type NotificationSettingsFormData,
  type AddressFormData,
} from '../validationSchemas'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData: LoginFormData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['email'],
            message: 'validation.invalidEmail',
          })
        )
      }
    })

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
        password: 'password123',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['email'],
            message: 'validation.emailRequired',
          })
        )
      }
    })

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['password'],
            message: 'validation.passwordTooShort',
          })
        )
      }
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['password'],
            message: 'validation.passwordRequired',
          })
        )
      }
    })
  })

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData: RegisterFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['confirmPassword'],
            message: 'validation.passwordMismatch',
          })
        )
      }
    })

    it('should reject short name', () => {
      const invalidData = {
        name: 'A',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['name'],
            message: 'validation.nameTooShort',
          })
        )
      }
    })

    it('should reject long name', () => {
      const invalidData = {
        name: 'A'.repeat(51),
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['name'],
            message: 'validation.nameTooLong',
          })
        )
      }
    })
  })

  describe('forgotPasswordSchema', () => {
    it('should validate correct email', () => {
      const validData: ForgotPasswordFormData = {
        email: 'test@example.com',
      }

      const result = forgotPasswordSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
      }

      const result = forgotPasswordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('resetPasswordSchema', () => {
    it('should validate matching passwords', () => {
      const validData: ResetPasswordFormData = {
        password: 'newpassword123',
        confirmPassword: 'newpassword123',
      }

      const result = resetPasswordSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        password: 'newpassword123',
        confirmPassword: 'different',
      }

      const result = resetPasswordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['confirmPassword'],
            message: 'validation.passwordMismatch',
          })
        )
      }
    })
  })

  describe('profileSchema', () => {
    it('should validate complete profile data', () => {
      const validData: ProfileFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        dateOfBirth: '1990-01-01',
        gender: 'male',
      }

      const result = profileSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate minimal profile data', () => {
      const validData = {
        name: 'John Doe',
        email: 'test@example.com',
      }

      const result = profileSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid phone format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: 'invalid-phone',
      }

      const result = profileSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['phone'],
            message: 'validation.invalidPhone',
          })
        )
      }
    })

    it('should reject invalid gender', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        gender: 'invalid',
      }

      const result = profileSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('changePasswordSchema', () => {
    it('should validate correct password change', () => {
      const validData: ChangePasswordFormData = {
        currentPassword: 'oldpassword123',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      }

      const result = changePasswordSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject mismatched new passwords', () => {
      const invalidData = {
        currentPassword: 'oldpassword123',
        newPassword: 'newpassword123',
        confirmPassword: 'different',
      }

      const result = changePasswordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['confirmPassword'],
            message: 'validation.passwordMismatch',
          })
        )
      }
    })

    it('should reject same current and new password', () => {
      const invalidData = {
        currentPassword: 'samepassword123',
        newPassword: 'samepassword123',
        confirmPassword: 'samepassword123',
      }

      const result = changePasswordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['newPassword'],
            message: 'validation.newPasswordSameAsCurrent',
          })
        )
      }
    })
  })

  describe('contactSchema', () => {
    it('should validate correct contact data', () => {
      const validData: ContactFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
      }

      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject long subject', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'A'.repeat(101),
        message: 'This is a test message.',
      }

      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['subject'],
            message: 'validation.subjectTooLong',
          })
        )
      }
    })

    it('should reject long message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'A'.repeat(1001),
      }

      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['message'],
            message: 'validation.messageTooLong',
          })
        )
      }
    })
  })

  describe('searchSchema', () => {
    it('should validate correct search query', () => {
      const validData: SearchFormData = {
        query: 'test search',
      }

      const result = searchSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty query', () => {
      const invalidData = {
        query: '',
      }

      const result = searchSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['query'],
            message: 'validation.searchQueryRequired',
          })
        )
      }
    })

    it('should reject long query', () => {
      const invalidData = {
        query: 'A'.repeat(101),
      }

      const result = searchSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['query'],
            message: 'validation.searchQueryTooLong',
          })
        )
      }
    })
  })

  describe('commentSchema', () => {
    it('should validate correct comment', () => {
      const validData: CommentFormData = {
        content: 'This is a test comment.',
      }

      const result = commentSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty comment', () => {
      const invalidData = {
        content: '',
      }

      const result = commentSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['content'],
            message: 'validation.commentRequired',
          })
        )
      }
    })

    it('should reject long comment', () => {
      const invalidData = {
        content: 'A'.repeat(501),
      }

      const result = commentSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['content'],
            message: 'validation.commentTooLong',
          })
        )
      }
    })
  })

  describe('updateProfileSchema', () => {
    it('should validate complete update profile data', () => {
      const validData: UpdateProfileFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        bio: 'This is my bio.',
      }

      const result = updateProfileSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject long address', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        address: 'A'.repeat(201),
      }

      const result = updateProfileSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['address'],
            message: 'validation.addressTooLong',
          })
        )
      }
    })

    it('should reject long bio', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        bio: 'A'.repeat(301),
      }

      const result = updateProfileSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['bio'],
            message: 'validation.bioTooLong',
          })
        )
      }
    })
  })

  describe('feedbackSchema', () => {
    it('should validate correct feedback data', () => {
      const validData: FeedbackFormData = {
        rating: 5,
        title: 'Great app!',
        comment: 'I love using this application.',
        category: 'feature',
      }

      const result = feedbackSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid rating', () => {
      const invalidData = {
        rating: 6,
        title: 'Great app!',
        comment: 'I love using this application.',
      }

      const result = feedbackSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['rating'],
            message: 'validation.ratingInvalid',
          })
        )
      }
    })

    it('should reject long title', () => {
      const invalidData = {
        rating: 5,
        title: 'A'.repeat(101),
        comment: 'I love using this application.',
      }

      const result = feedbackSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['title'],
            message: 'validation.titleTooLong',
          })
        )
      }
    })
  })

  describe('reportSchema', () => {
    it('should validate correct report data', () => {
      const validData: ReportFormData = {
        type: 'spam',
        description: 'This content is spam.',
        evidence: 'Screenshot attached.',
      }

      const result = reportSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid type', () => {
      const invalidData = {
        type: 'invalid',
        description: 'This content is spam.',
      }

      const result = reportSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject long description', () => {
      const invalidData = {
        type: 'spam',
        description: 'A'.repeat(501),
      }

      const result = reportSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['description'],
            message: 'validation.descriptionTooLong',
          })
        )
      }
    })
  })

  describe('notificationSettingsSchema', () => {
    it('should validate correct notification settings', () => {
      const validData: NotificationSettingsFormData = {
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
      }

      const result = notificationSettingsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject non-boolean values', () => {
      const invalidData = {
        emailNotifications: 'true',
        pushNotifications: false,
        smsNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
      }

      const result = notificationSettingsSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('addressSchema', () => {
    it('should validate correct address data', () => {
      const validData: AddressFormData = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '12345',
        country: 'USA',
      }

      const result = addressSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate address with extended postal code', () => {
      const validData: AddressFormData = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '12345-6789',
        country: 'USA',
      }

      const result = addressSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid postal code format', () => {
      const invalidData = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: 'INVALID',
        country: 'USA',
      }

      const result = addressSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['postalCode'],
            message: 'validation.invalidPostalCode',
          })
        )
      }
    })

    it('should reject long street', () => {
      const invalidData = {
        street: 'A'.repeat(101),
        city: 'New York',
        state: 'NY',
        postalCode: '12345',
        country: 'USA',
      }

      const result = addressSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['street'],
            message: 'validation.streetTooLong',
          })
        )
      }
    })
  })

  describe('Type Inference', () => {
    it('should infer correct types from schemas', () => {
      // This test ensures TypeScript type inference works correctly
      const loginData: LoginFormData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const registerData: RegisterFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }

      const contactData: ContactFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message',
      }

      // If these compile without TypeScript errors, the types are correct
      expect(loginData).toBeDefined()
      expect(registerData).toBeDefined()
      expect(contactData).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined and null values appropriately', () => {
      const result = loginSchema.safeParse(null)
      expect(result.success).toBe(false)

      const result2 = loginSchema.safeParse(undefined)
      expect(result2.success).toBe(false)
    })

    it('should handle empty objects', () => {
      const result = loginSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('should handle extra properties', () => {
      const dataWithExtra = {
        email: 'test@example.com',
        password: 'password123',
        extraField: 'should be ignored',
      }

      const result = loginSchema.safeParse(dataWithExtra)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).not.toHaveProperty('extraField')
      }
    })
  })
})