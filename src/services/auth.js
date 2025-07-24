import bcrypt from 'bcryptjs';
import User from '../db/models/user.js';

export const isValidName = (name) =>
  typeof name === 'string' && name.length >= 2 && name.length <= 32;

export const isValidEmail = (email) =>
  typeof email === 'string' && email.length <= 64;

export const isValidPassword = (password) =>
  typeof password === 'string' && password.length >= 8 && password.length <= 64;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};
