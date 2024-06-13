import {
  createTaskProject,
  getAllTaskProjects,
  getTaskProjectById,
  updateTaskProjectById,
  deleteTaskProjectById,
  getTaskProjectsByOwnerId,
} from '../services/taskProjectService.js';
import { getUserById } from '../services/userService.js';

export const createTaskProjectController = async (req, res) => {
  try {
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
    const ownerId = req.user.id;
    const taskProject = await getTaskProjectsByOwnerId(ownerId);

    if (!taskProject) {
      return res.status(400).json({ error: 'Project ID not found' });
    }
    res.status(200).json(taskProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskProjectByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const intId = parseInt(id);
    const ownerId = req.user.id;

    if (isNaN(intId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await getTaskProjectById(intId);

    if (!project) {
      return res.status(404).json({ error: 'Task project not found' });
    }

    if (project.owner_id !== ownerId) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You are not the owner of this project' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTaskProjectController = async (req, res) => {
  const projectId = parseInt(req.params.id);
  const { title, description } = req.body;
  const ownerId = req.user.id;
  try {
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid task project ID' });
    }

    const project = await getTaskProjectById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Task project not found' });
    }

    if (project.owner_id !== ownerId) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You are not the owner of this project' });
    }

    const taskProject = await updateTaskProjectById(projectId, {
      title,
      description,
    });

    res.status(200).json({
      message: 'Task project updated successfully',
      taskProject,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTaskProjectController = async (req, res) => {
  const projectId = parseInt(req.params.id);
  const ownerId = req.user.id;
  try {
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid task project ID' });
    }
    const project = await getTaskProjectById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Task project not found' });
    }

    if (project.owner_id !== ownerId) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You are not the owner of this project' });
    }

    await deleteTaskProjectById(projectId);

    res.status(200).json({ message: 'Task project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
