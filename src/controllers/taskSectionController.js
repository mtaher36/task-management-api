import {
  createTaskSection,
  getTaskSectionsByProjectId,
  updateTaskSection,
  deleteTaskSection,
  isProjectOwner,
  getTaskSectionById,
  isTaskSectionOwner,
} from '../services/taskSectionService.js';

// Create Task Section
export const createTaskSectionController = async (req, res) => {
  try {
    const { name, project_id } = req.body;
    const userId = req.user.id;

    // Check if the user is the owner of the project
    const isOwner = await isProjectOwner(project_id, userId);
    if (!isOwner) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You do not own this project' });
    }

    const taskSection = await createTaskSection(name, project_id);
    res.status(201).json({
      message: 'Task section created successfully',
      taskSection,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Task Section By ID Section
export const getTaskSectionByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const intId = parseInt(id);

    if (isNaN(intId)) {
      return res.status(400).json({ error: 'Invalid section ID' });
    }

    const taskSection = await getTaskSectionById(intId);

    if (!taskSection) {
      return res.status(404).json({ error: 'Task section not found' });
    }

    res.status(200).json(taskSection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Task Sections by Project ID
export const getTaskSectionsController = async (req, res) => {
  try {
    const { project_id } = req.params;
    const userId = req.user.id; // Assumes user ID is stored in req.user

    if (isNaN(project_id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    // Check if the user is the owner of the project
    const isOwner = await isProjectOwner(project_id, userId);
    if (!isOwner) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You do not own this project' });
    }
    const taskSections = await getTaskSectionsByProjectId(project_id);
    res.status(200).json(taskSections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Task Section
export const updateTaskSectionController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name } = req.body;

    const isOwner = await isTaskSectionOwner(id, userId);
    if (!isOwner) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You do not own this task section' });
    }

    const updatedTaskSection = await updateTaskSection(id, name);
    res.json({
      message: 'Task section updated successfully',
      taskSection: updatedTaskSection,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Task Section
export const deleteTaskSectionController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const isOwner = await isTaskSectionOwner(id, userId);
    if (!isOwner) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You do not own this task section' });
    }
    await deleteTaskSection(id);
    res.json({ message: 'Task section deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
