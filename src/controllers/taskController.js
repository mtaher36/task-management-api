import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
} from '../services/taskService.js';

export const createTaskController = async (req, res) => {
  try {
    const {
      project_id,
      section_id,
      title,
      description,
      due_date,
      priority,
      is_recurring,
      recurrence_interval,
    } = req.body;
    const task = await createTask(
      req.user.id,
      project_id,
      section_id,
      title,
      description,
      due_date,
      priority,
      is_recurring,
      recurrence_interval
    );
    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTasksController = async (req, res) => {
  try {
    const tasks = await getTasks(req.user.id);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTaskController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      title,
      description,
      due_date,
      priority,
      status,
      is_recurring,
      recurrence_interval,
    } = req.body;
    const task = await updateTask(
      id,
      req.user.id,
      title,
      description,
      due_date,
      priority,
      status,
      is_recurring,
      recurrence_interval
    );
    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTaskController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await deleteTask(id, req.user.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const completedTask = await completeTask(req.user.id, parseInt(id));
    res.status(200).json({
      message: 'Task completed successfully',
      task: completedTask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
