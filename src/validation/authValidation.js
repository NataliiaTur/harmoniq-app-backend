import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(32).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 32 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().max(64).required().messages({
    'string.email': 'Invalid email format',
    'string.empty': 'Email is required',
    'string.max': 'Email must be at most 64 characters',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).max(64).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must be at most 64 characters',
    'any.required': 'Password is required',
  }),
  avatar: Joi.any()
    .optional()
    .meta({ swaggerType: 'file' })
    .description('User avatar image'),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().max(64).required(),
  password: Joi.string().min(8).max(64).required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
