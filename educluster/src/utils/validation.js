/**
 * Validation utilities for EduCluster forms
 */

// Enrollment No. validation (formerly username validation)
export const validateUsername = (value) => {
  // Check if enrollment number is at least 5 characters long
  if (!value || value.length < 5) {
    return "Enrollment No. must be at least 5 characters long";
  }
  // Check if enrollment number contains only alphanumeric characters and allowed symbols
  if (!/^[a-zA-Z0-9._@-]+$/.test(value)) {
    return "Enrollment No. can only contain letters, numbers, and ._@-";
  }
  return "";
};

// Password validation
export const validatePassword = (value) => {
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  if (!value || value.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(value)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(value)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(value)) {
    return "Password must contain at least one number";
  }
  if (!/[!@#$%^&*]/.test(value)) {
    return "Password must contain at least one special character (!@#$%^&*)";
  }
  return "";
};

// Email validation
export const validateEmail = (value) => {
  if (!value) {
    return "Email is required";
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "Please enter a valid email address";
  }
  
  return "";
};

// Phone validation
export const validatePhone = (value) => {
  if (!value) {
    return "Phone number is required";
  }
  
  // Basic phone validation - at least 10 digits
  const phoneRegex = /^\d{10,}$/;
  if (!phoneRegex.test(value.replace(/[^0-9]/g, ''))) {
    return "Please enter a valid phone number with at least 10 digits";
  }
  
  return "";
};

// Student/Faculty Enrollment No. validation
export const validateId = (value) => {
  if (!value) {
    return "Enrollment No. is required";
  }
  
  if (value.length < 5) {
    return "Enrollment No. must be at least 5 characters long";
  }
  
  return "";
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  
  return "";
};

// Name validation
export const validateName = (value) => {
  if (!value) {
    return "Name is required";
  }
  
  if (value.length < 2) {
    return "Name must be at least 2 characters long";
  }
  
  if (!/^[a-zA-Z\s\-']+$/.test(value)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }
  
  return "";
};
