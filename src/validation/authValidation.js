export const isValidName = (name) =>
  typeof name === 'string' && name.length >= 2 && name.length <= 32;

export const isValidEmail = (email) =>
  typeof email === 'string' && email.length <= 64;

export const isValidPassword = (password) =>
  typeof password === 'string' && password.length >= 8 && password.length <= 64;

export const validateRegisterData = ({ name, email, password }) => {
  const errors = [];

  if (!isValidName(name)) {
    errors.push('Name must be between 2 and 32 characters');
  }

  if (!isValidEmail(email)) {
    errors.push('Incorrect email');
  }

  if (!isValidPassword(password)) {
    errors.push('Password must be between 8 and 64 characters');
  }

  return errors;
};
