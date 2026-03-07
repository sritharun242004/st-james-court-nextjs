// Validation utilities for forms and API data

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

export const validateFutureDate = (date: string): boolean => {
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj >= today;
};

export const validateCheckInCheckOut = (checkIn: string, checkOut: string): boolean => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  return checkOutDate > checkInDate;
};

export const validateNumber = (value: string, min?: number, max?: number): boolean => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

export const validateInteger = (value: string, min?: number, max?: number): boolean => {
  const num = parseInt(value);
  if (isNaN(num) || !Number.isInteger(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

// Form validation schemas
export const bookingValidationSchema = {
  checkInDate: (value: string) => validateRequired(value) && validateDate(value) && validateFutureDate(value),
  checkOutDate: (value: string, checkInDate: string) => 
    validateRequired(value) && validateDate(value) && validateCheckInCheckOut(checkInDate, value),
  adults: (value: string) => validateInteger(value, 1, 10),
  children: (value: string) => validateInteger(value, 0, 10),
  rooms: (value: string) => validateInteger(value, 1, 5),
  firstName: (value: string) => validateRequired(value) && validateMinLength(value, 2),
  lastName: (value: string) => validateRequired(value) && validateMinLength(value, 2),
  email: (value: string) => validateRequired(value) && validateEmail(value),
  phone: (value: string) => validateRequired(value) && validatePhone(value),
};

export const contactValidationSchema = {
  name: (value: string) => validateRequired(value) && validateMinLength(value, 2),
  email: (value: string) => validateRequired(value) && validateEmail(value),
  phone: (value: string) => !value || validatePhone(value),
  subject: (value: string) => validateRequired(value) && validateMinLength(value, 5),
  message: (value: string) => validateRequired(value) && validateMinLength(value, 10),
};