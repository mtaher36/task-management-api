import Joi from 'joi';

export const createTaskSectionSchema = Joi.object({
  name: Joi.string().required(),
  project_id: Joi.number().integer().required(),
});

export const updateTaskSectionSchema = Joi.object({
  name: Joi.string().required(),
});
