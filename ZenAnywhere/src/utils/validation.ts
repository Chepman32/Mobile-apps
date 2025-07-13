/**
 * Validates an email address
 * @param email - The email to validate
 * @returns boolean - True if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates a password
 * @param password - The password to validate
 * @returns boolean - True if the password meets requirements
 */
export const validatePassword = (password: string): boolean => {
  // At least 6 characters
  return password.length >= 6;
};

/**
 * Validates a name (first or last name)
 * @param name - The name to validate
 * @returns boolean - True if the name is valid
 */
export const validateName = (name: string): boolean => {
  // At least 2 characters, only letters, spaces, hyphens, and apostrophes
  const re = /^[a-zA-Z'\-\s]{2,}$/;
  return re.test(name);
};

/**
 * Validates a phone number
 * @param phone - The phone number to validate
 * @returns boolean - True if the phone number is valid
 */
export const validatePhone = (phone: string): boolean => {
  // Basic phone number validation (allows various formats)
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  return re.test(phone);
};

/**
 * Validates a date of birth (must be at least 13 years old)
 * @param date - The date to validate (YYYY-MM-DD)
 * @returns boolean - True if the date is valid
 */
export const validateDateOfBirth = (date: string): boolean => {
  const dob = new Date(date);
  const today = new Date();
  const minAgeDate = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  );
  
  return dob <= minAgeDate;
};

/**
 * Validates a URL
 * @param url - The URL to validate
 * @returns boolean - True if the URL is valid
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validates a credit card number (Luhn algorithm)
 * @param cardNumber - The credit card number to validate
 * @returns boolean - True if the credit card number is valid
 */
export const validateCreditCard = (cardNumber: string): boolean => {
  // Remove all non-digit characters
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Check if the number is empty or contains non-digits
  if (!/^\d+$/.test(cleanNumber)) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the right
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + 1;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

/**
 * Validates a CVV (Card Verification Value)
 * @param cvv - The CVV to validate
 * @returns boolean - True if the CVV is valid
 */
export const validateCVV = (cvv: string): boolean => {
  // 3 or 4 digits
  return /^\d{3,4}$/.test(cvv);
};

/**
 * Validates an expiration date (MM/YY format)
 * @param expDate - The expiration date to validate (MM/YY)
 * @returns boolean - True if the expiration date is valid and not expired
 */
export const validateExpirationDate = (expDate: string): boolean => {
  // Check format
  if (!/^\d{2}\/\d{2}$/.test(expDate)) {
    return false;
  }
  
  const [month, year] = expDate.split('/').map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Last two digits of the year
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
  
  // Check if the month is valid (1-12)
  if (month < 1 || month > 12) {
    return false;
  }
  
  // Check if the card is expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

/**
 * Validates a zip/postal code
 * @param zip - The zip code to validate
 * @param country - The country code (e.g., 'US', 'CA', 'UK')
 * @returns boolean - True if the zip code is valid for the given country
 */
export const validateZipCode = (zip: string, country: string = 'US'): boolean => {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/, // US ZIP code (5 or 5+4 digits)
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, // Canadian postal code
    UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, // UK postcode
    AU: /^\d{4}$/, // Australian postcode (4 digits)
    DE: /^\d{5}$/, // German postcode (5 digits)
    FR: /^\d{5}$/, // French postcode (5 digits)
    IT: /^\d{5}$/, // Italian postcode (5 digits)
    ES: /^\d{5}$/, // Spanish postcode (5 digits)
    JP: /^\d{3}-?\d{4}$/, // Japanese postcode (7 digits, with optional hyphen)
    IN: /^\d{6}$/, // Indian PIN code (6 digits)
    BR: /^\d{5}-?\d{3}$/, // Brazilian CEP (8 digits, with optional hyphen after 5th digit)
  };
  
  const pattern = patterns[country.toUpperCase()] || /^[\w\s-]{3,10}$/; // Default pattern
  return pattern.test(zip.trim());
};

/**
 * Validates a username
 * @param username - The username to validate
 * @returns boolean - True if the username is valid
 */
export const validateUsername = (username: string): boolean => {
  // 3-20 characters, letters, numbers, underscores, and hyphens
  const re = /^[a-zA-Z0-9_-]{3,20}$/;
  return re.test(username);
};

/**
 * Validates a strong password with specific requirements
 * @param password - The password to validate
 * @returns {valid: boolean, message: string} - Validation result and message
 */
export const validateStrongPassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true, message: 'Password is strong' };
};
