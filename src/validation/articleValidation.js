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

  article: Joi.string().min(40).max(4000).trim().required().messages({
    'string.empty': 'Article content cannot be empty',
    'any.required': 'Article content is required',
    'string.min': 'Description must be at least 100 characters long',
    'string.max': 'Description must be at most 4000 characters long',
  }),

  rate: Joi.number().min(0).default(0).messages({
    'number.base': 'The rate must be a number',
    'number.min': 'The rate field cannot be less than 0.',
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

  article: Joi.string().min(100).max(4000).trim().messages({
    'string.empty': 'Article content cannot be empty',
    'string.min': 'Description must be at least 100 characters long',
    'string.max': 'Description must be at most 4000 characters long',
  }),
})
  .min(1) // гарантує, що запит не буде порожнім
  .messages({
    'object.min': 'At least one field must be provided for update',
  });
