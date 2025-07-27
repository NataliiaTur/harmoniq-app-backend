import Joi from 'joi';

export const userUpdateInfoSchema = Joi.object({
  name: Joi.string().min(2).max(32).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 32 characters',
  }),
  email: Joi.string().email().max(64).messages({
    'string.email': 'Invalid email format',
    'string.max': 'Email must be at most 64 characters',
  }),
});

export const userAvatarSchema = Joi.object({
  avatar: Joi.any()
    .meta({ swaggerType: 'file' })
    .description('User avatar image'),
});
