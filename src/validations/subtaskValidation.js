import Joi from 'joi';

export const createSubtaskSchema = Joi.object({
  task_id: Joi.number().integer(),
  title: Joi.string().max(100).required(),
  description: Joi.string().required(),
  due_date: Joi.date().optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').required(),
  is_recurring: Joi.boolean().optional(),
  recurrence_interval: Joi.string()
    .valid('Daily', 'Weekly', 'Monthly', 'Yearly')
    .optional(),
});

export const updateSubtaskSchema = Joi.object({
  title: Joi.string().max(100).optional(),
  description: Joi.string().optional(),
  due_date: Joi.date().optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
  status: Joi.string().valid('InProgress', 'Completed').optional(),
  is_recurring: Joi.boolean().optional(),
  recurrence_interval: Joi.string()
    .valid('Daily', 'Weekly', 'Monthly', 'Yearly')
    .optional(),
});
