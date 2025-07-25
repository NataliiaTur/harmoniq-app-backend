import bcrypt from 'bcrypt';
import User from '../db/models/user.js';
import { registerUserSchema } from '../validation/authValidation.js';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const registerUser = async ({ name, email, password }, avatarPath) => {
  const { error } = registerUserSchema.validate({ name, email, password });
  if (error) {
    throw new Error(error.details[0].message);
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    avatar: avatarPath,
  });

  await newUser.save();
  return newUser;
};
