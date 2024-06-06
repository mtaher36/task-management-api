import {
  createTaskProject,
  getAllTaskProjects,
  getTaskProjectById,
  updateTaskProjectById,
  deleteTaskProjectById,
} from '../services/taskProjectService.js';
import { getUserById } from '../services/userService.js';
import {
  createTaskProjectSchema,
  updateTaskProjectSchema,
} from '../validations/taskProjectValidation.js';

export const createTaskProjectController = async (req, res) => {
  try {
    const { error } = createTaskProjectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description } = req.body;
    const owner_id = req.user.id;

    const taskProject = await createTaskProject({
      title,
      description,
      owner_id,
    });

    res.status(201).json({
      message: 'Task project created successfully',
      taskProject,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTaskProjectsController = async (req, res) => {
  try {
    const taskProjects = await getAllTaskProjects();
    res.status(200).json(taskProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTaskProjectController = async (req, res) => {
  try {
    const { error } = updateTaskProjectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const id = parseInt(req.params.id);
    const { title, description } = req.body;
    const taskProjectFind = await getTaskProjectById(id);
    if (!taskProjectFind) {
      return res.status(400).json({ error: 'Project ID not found' });
    }

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task project ID' });
    }

    const taskProject = await updateTaskProjectById(id, { title, description });

    res.status(200).json({
      message: 'Task project updated successfully',
      taskProject,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTaskProjectController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const taskProjectFind = await getTaskProjectById(id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task project ID' });
    }
    if (!taskProjectFind) {
      return res.status(400).json({ error: 'Project ID not found' });
    }
    await deleteTaskProjectById(id);

    res.status(200).json({ message: 'Task project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
