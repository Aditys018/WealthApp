import joi from 'joi';

/**
 * Password validation schema
 * Requires:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordSchema = joi.string()
  .min(8)
  .regex(/[A-Z]/, 'uppercase')
  .regex(/[a-z]/, 'lowercase')
  .regex(/[0-9]/, 'numbers')
  .regex(/[^A-Za-z0-9]/, 'special characters')
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.name': 'Password must contain at least one {#name}',
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  });

/**
 * Validate a password against the password schema
 * @param password Password to validate
 * @returns Object with isValid flag and error message if invalid
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  const { error } = passwordSchema.validate(password);
  
  if (error) {
    return {
      isValid: false,
      message: error.details[0].message
    };
  }
  
  return { isValid: true };
};

/**
 * Check if a password is common or easily guessable
 * @param password Password to check
 * @returns True if the password is common, false otherwise
 */
export const isCommonPassword = (password: string): boolean => {
  // List of common passwords to check against
  const commonPasswords = [
    'password', 'password123', '123456', '12345678', 'qwerty', 
    'admin', 'welcome', 'letmein', 'abc123', 'monkey', 
    'dragon', 'baseball', 'football', 'superman', 'batman'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
};

/**
 * Comprehensive password validation
 * @param password Password to validate
 * @returns Object with isValid flag and error message if invalid
 */
export const validatePasswordComprehensive = (password: string): { isValid: boolean; message?: string } => {
  // First check against schema
  const schemaValidation = validatePassword(password);
  if (!schemaValidation.isValid) {
    return schemaValidation;
  }
  
  // Check if it's a common password
  if (isCommonPassword(password)) {
    return {
      isValid: false,
      message: 'Password is too common or easily guessable'
    };
  }
  
  return { isValid: true };
};