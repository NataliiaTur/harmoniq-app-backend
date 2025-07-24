import Joi from 'joi';

export const createArticleSchema = Joi.object({
  img: Joi.string().uri().messages({
    'string.uri': 'Image link must be a valid URL',
  }),

  title: Joi.string().min(3).max(48).trim().required().messages({
    'string.min': 'Article title must be at least 3 characters long',
    'string.max': 'Article title must be at most 48 characters long',
    'string.empty': 'Article title cannot be empty',
    'any.required': 'Article title is required',
  }),

  desc: Joi.string().min(100).max(4000).trim().required().messages({
    'string.min': 'Description must be at least 100 characters long',
    'string.max': 'Description must be at most 4000 characters long',
    'string.empty': 'Description cannot be empty',
    'any.required': 'Description is required',
  }),

  article: Joi.string().trim().required().messages({
    'string.empty': 'Article content cannot be empty',
    'any.required': 'Article content is required',
  }),

  ownerId: Joi.string().length(24).hex().required().messages({
    'string.base': 'ownerId must be a string',
    'string.length': 'ownerId must contain exactly 24 characters',
    'string.hex': 'ownerId must be in hex format (0-9, a-f)',
    'any.required': 'Field ownerId is required',
  }),

  rate: Joi.number().min(0).default(0).messages({
    'number.base': 'The rate must be a number',
    'number.min': 'The rate field cannot be less than 0.',
  }),

  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'The date must be in the format YYYY-MM-DD',
      'string.empty': 'The date field cannot be empty.',
      'any.required': 'The date field is required.',
    }),
});

export const updateArticleSchema = Joi.object({
  img: Joi.string().uri().messages({
    'string.uri': 'Image link must be a valid URL',
    'string.empty': 'Image link cannot be empty',
  }),

  title: Joi.string().min(3).max(48).trim().messages({
    'string.min': 'Article title must be at least 3 characters long',
    'string.max': 'Article title must be at most 48 characters long',
    'string.empty': 'Article title cannot be empty',
  }),

  desc: Joi.string().min(100).max(4000).trim().messages({
    'string.min': 'Description must be at least 100 characters long',
    'string.max': 'Description must be at most 4000 characters long',
    'string.empty': 'Description cannot be empty',
  }),

  article: Joi.string().trim().messages({
    'string.empty': 'Article content cannot be empty',
  }),
})
  .min(1) // гарантує, що запит не буде порожнім
  .messages({
    'object.min': 'At least one field must be provided for update',
  });
