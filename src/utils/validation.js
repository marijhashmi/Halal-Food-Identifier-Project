/**
 * Validation utilities for forms
 */

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: min 8 characters, at least 1 number, 1 special character
 */
export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: minLength && hasNumber && hasSpecialChar,
    errors: {
      minLength: !minLength ? 'Password must be at least 8 characters' : null,
      hasNumber: !hasNumber ? 'Password must contain at least 1 number' : null,
      hasSpecialChar: !hasSpecialChar
        ? 'Password must contain at least 1 special character'
        : null,
    },
  };
};

/**
 * Get password strength indicator
 */
export const getPasswordStrength = (password) => {
  if (!password) return 0;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/\d/.test(password)) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  return Math.min(strength, 5);
};

