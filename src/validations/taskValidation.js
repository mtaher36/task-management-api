import Joi from 'joi';

export const createTaskSchema = Joi.object({
  project_id: Joi.number().integer().required(),
  section_id: Joi.number().integer().required(),
  title: Joi.string().max(100).required(),
  description: Joi.string().required(),
  due_date: Joi.date().optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').required(),
  is_recurring: Joi.boolean().required(),
  recurrence_interval: Joi.string()
    .valid('Daily', 'Weekly', 'Monthly', 'Yearly')
    .optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().required(),
  due_date: Joi.date().optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').required(),
  status: Joi.string().valid('Pending', 'In Progress', 'Completed').required(),
  is_recurring: Joi.boolean().required(),
  recurrence_interval: Joi.string()
    .valid('Daily', 'Weekly', 'Monthly', 'Yearly')
    .optional(),
});
