import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import { registerUserSchema } from '../validation/authValidation.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

//registration
export const registerUser = async ({ name, email, password }) => {
  const { error } = registerUserSchema.validate({ name, email, password });
  if (error) {
    throw createHttpError(400, error.details[0].message);
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw createHttpError(409, 'Email already registered');
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new User.create({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };
};

//login
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const payload = { id: user._id };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};
