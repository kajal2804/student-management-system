/**
 * Validation utilities for API inputs
 */

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
const phoneRegex = /^\d{10}$/;

function validateEmail(email) {
  return emailRegex.test(email);
}

function validatePhone(phone) {
  return phoneRegex.test(phone);
}

function validateScore(score) {
  const num = parseFloat(score);
  return !isNaN(num) && num >= 0 && num <= 100;
}

function validateStudentData(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email address is required');
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Phone must be a 10-digit number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateMarkData(data) {
  const errors = [];

  if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length === 0) {
    errors.push('Subject is required and must be a non-empty string');
  }

  if (!data.score || !validateScore(data.score)) {
    errors.push('Score must be a number between 0 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateEmail,
  validatePhone,
  validateScore,
  validateStudentData,
  validateMarkData,
};
