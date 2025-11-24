import {
  createEmailValidation,
  createPasswordValidation,
  createNameValidation,
  createPhoneValidation,
  createTextValidation,
  createNumberValidation,
  createPasswordConfirmationValidation,
  getFieldError,
  hasFieldError,
  getFirstError,
  formatValidationErrors,
  createOptionalField,
  createRequiredField,
  createLoginSchema,
  createRegisterSchema,
  createContactSchema,
  validateSchema,
  createAsyncValidator,
  ValidationResult
} from '../validationUtils';
import { z } from 'zod';

describe('validationUtils', () => {
  describe('createEmailValidation', () => {
    it('should validate correct email', () => {
      const schema = createEmailValidation();
      const result = schema.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const schema = createEmailValidation();
      const result = schema.safeParse('invalid-email');
      expect(result.success).toBe(false);
    });

    it('should reject empty email', () => {
      const schema = createEmailValidation();
      const result = schema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should use custom error messages', () => {
      const schema = createEmailValidation('Custom required', 'Custom invalid');
      const emptyResult = schema.safeParse('');
      const invalidResult = schema.safeParse('invalid');
      
      expect(emptyResult.success).toBe(false);
      expect(invalidResult.success).toBe(false);
    });
  });

  describe('createPasswordValidation', () => {
    it('should validate password with minimum length', () => {
      const schema = createPasswordValidation();
      const result = schema.safeParse('password123');
      expect(result.success).toBe(true);
    });

    it('should reject password too short', () => {
      const schema = createPasswordValidation();
      const result = schema.safeParse('123');
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const schema = createPasswordValidation();
      const result = schema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should use custom minimum length', () => {
      const schema = createPasswordValidation('Required', 'Too short', 8);
      const result = schema.safeParse('1234567');
      expect(result.success).toBe(false);
    });
  });

  describe('createNameValidation', () => {
    it('should validate correct name', () => {
      const schema = createNameValidation();
      const result = schema.safeParse('John Doe');
      expect(result.success).toBe(true);
    });

    it('should reject name too short', () => {
      const schema = createNameValidation();
      const result = schema.safeParse('A');
      expect(result.success).toBe(false);
    });

    it('should reject name too long', () => {
      const schema = createNameValidation();
      const longName = 'A'.repeat(51);
      const result = schema.safeParse(longName);
      expect(result.success).toBe(false);
    });

    it('should use custom length limits', () => {
      const schema = createNameValidation('Required', 'Too short', 'Too long', 3, 10);
      const shortResult = schema.safeParse('AB');
      const longResult = schema.safeParse('ABCDEFGHIJK');
      
      expect(shortResult.success).toBe(false);
      expect(longResult.success).toBe(false);
    });
  });

  describe('createPhoneValidation', () => {
    it('should validate correct phone numbers', () => {
      const schema = createPhoneValidation();
      const validPhones = [
        '+1234567890',
        '123-456-7890',
        '(123) 456-7890',
        '123 456 7890'
      ];
      
      validPhones.forEach(phone => {
        const result = schema.safeParse(phone);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid phone numbers', () => {
      const schema = createPhoneValidation();
      const invalidPhones = [
        'abc123',
        '123@456',
        'phone number'
      ];
      
      invalidPhones.forEach(phone => {
        const result = schema.safeParse(phone);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('createTextValidation', () => {
    it('should validate text with required message only', () => {
      const schema = createTextValidation('Required');
      const result = schema.safeParse('Some text');
      expect(result.success).toBe(true);
    });

    it('should reject empty text', () => {
      const schema = createTextValidation('Required');
      const result = schema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should validate text with max length', () => {
      const schema = createTextValidation('Required', 'Too long', 10);
      const validResult = schema.safeParse('Short');
      const invalidResult = schema.safeParse('This is too long');
      
      expect(validResult.success).toBe(true);
      expect(invalidResult.success).toBe(false);
    });
  });

  describe('createNumberValidation', () => {
    it('should validate number within range', () => {
      const schema = createNumberValidation('Required', 1, 10, 'Too small', 'Too big');
      const result = schema.safeParse(5);
      expect(result.success).toBe(true);
    });

    it('should reject number below minimum', () => {
      const schema = createNumberValidation('Required', 1, 10, 'Too small', 'Too big');
      const result = schema.safeParse(0);
      expect(result.success).toBe(false);
    });

    it('should reject number above maximum', () => {
      const schema = createNumberValidation('Required', 1, 10, 'Too small', 'Too big');
      const result = schema.safeParse(11);
      expect(result.success).toBe(false);
    });
  });

  describe('createPasswordConfirmationValidation', () => {
    it('should validate matching passwords', () => {
      const schema = createPasswordConfirmationValidation();
      const result = schema.safeParse({
        password: 'test123',
        confirmPassword: 'test123'
      });
      expect(result.success).toBe(true);
    });

    it('should reject non-matching passwords', () => {
      const schema = createPasswordConfirmationValidation();
      const result = schema.safeParse({
        password: 'test123',
        confirmPassword: 'different'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('error handling functions', () => {
    const mockErrors = {
      email: { message: 'Email is required', type: 'required' },
      password: { message: 'Password is required', type: 'required' }
    } as any;

    describe('getFieldError', () => {
      it('should return error message for existing field', () => {
        const error = getFieldError(mockErrors, 'email');
        expect(error).toBe('Email is required');
      });

      it('should return undefined for non-existing field', () => {
        const error = getFieldError(mockErrors, 'name');
        expect(error).toBeUndefined();
      });
    });

    describe('hasFieldError', () => {
      it('should return true for existing field error', () => {
        const hasError = hasFieldError(mockErrors, 'email');
        expect(hasError).toBe(true);
      });

      it('should return false for non-existing field error', () => {
        const hasError = hasFieldError(mockErrors, 'name');
        expect(hasError).toBe(false);
      });
    });

    describe('getFirstError', () => {
      it('should return first error message', () => {
        const firstError = getFirstError(mockErrors);
        expect(firstError).toBe('Email is required');
      });

      it('should return undefined for empty errors', () => {
        const firstError = getFirstError({});
        expect(firstError).toBeUndefined();
      });
    });

    describe('formatValidationErrors', () => {
      it('should format errors correctly', () => {
        const formatted = formatValidationErrors(mockErrors);
        expect(formatted).toEqual({
          email: 'Email is required',
          password: 'Password is required'
        });
      });
    });
  });

  describe('field creation functions', () => {
    describe('createOptionalField', () => {
      it('should make field optional', () => {
        const schema = createOptionalField(z.string());
        const result = schema.safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('createRequiredField', () => {
      it('should validate required field', () => {
        const schema = createRequiredField(z.string());
        const validResult = schema.safeParse('test');
        const invalidResult = schema.safeParse('');
        
        expect(validResult.success).toBe(true);
        expect(invalidResult.success).toBe(false);
      });
    });
  });

  describe('schema creation functions', () => {
    describe('createLoginSchema', () => {
      it('should validate correct login data', () => {
        const schema = createLoginSchema();
        const result = schema.safeParse({
          email: 'test@example.com',
          password: 'password123'
        });
        expect(result.success).toBe(true);
      });

      it('should reject invalid login data', () => {
        const schema = createLoginSchema();
        const result = schema.safeParse({
          email: 'invalid-email',
          password: '123'
        });
        expect(result.success).toBe(false);
      });
    });

    describe('createRegisterSchema', () => {
      it('should validate correct registration data', () => {
        const schema = createRegisterSchema();
        const result = schema.safeParse({
          name: 'John Doe',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        });
        expect(result.success).toBe(true);
      });

      it('should reject mismatched passwords', () => {
        const schema = createRegisterSchema();
        const result = schema.safeParse({
          name: 'John Doe',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'different'
        });
        expect(result.success).toBe(false);
      });
    });

    describe('createContactSchema', () => {
      it('should validate correct contact data', () => {
        const schema = createContactSchema();
        const result = schema.safeParse({
          name: 'John Doe',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message content'
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('validateSchema', () => {
    it('should return success result for valid data', () => {
      const schema = z.object({ name: z.string() });
      const result = validateSchema(schema, { name: 'John' });
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ name: 'John' });
      expect(result.errors).toBeUndefined();
    });

    it('should return error result for invalid data', () => {
      const schema = z.object({ name: z.string() });
      const result = validateSchema(schema, { name: 123 });
      
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toBeDefined();
    });
  });

  describe('createAsyncValidator', () => {
    it('should validate data asynchronously', async () => {
      const schema = z.object({ name: z.string() });
      const validator = createAsyncValidator(schema);
      const result = await validator({ name: 'John' });
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ name: 'John' });
    });

    it('should handle async validation errors', async () => {
      const schema = z.object({ name: z.string() });
      const validator = createAsyncValidator(schema);
      const result = await validator({ name: 123 });
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });
});