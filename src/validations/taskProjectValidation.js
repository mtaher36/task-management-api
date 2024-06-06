import Joi from 'joi';

export const createTaskProjectSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().required().optional(),
});

export const updateTaskProjectSchema = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string(),
});
