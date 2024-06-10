import {
  createSubtask,
  getSubtasks,
  updateSubtask,
  deleteSubtask,
  completeSubtask,
} from '../services/subTaskService.js';

export const createSubtaskController = async (req, res) => {
  const { taskId } = req.params;

  try {
    const {
      title,
      description,
      due_date,
      priority,
      is_recurring,
      recurrence_interval,
    } = req.body;
    const subtask = await createSubtask(
      parseInt(taskId),
      title,
      description,
      due_date,
      priority,
      is_recurring,
      recurrence_interval
    );
    res.status(201).json({
      message: 'Subtask created successfully',
      subtask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubtasksController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const subtasks = await getSubtasks(taskId);
    res.status(200).json(subtasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubtaskController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { id } = req.params;
    const {
      title,
      description,
      due_date,
      priority,
      status,
      is_recurring,
      recurrence_interval,
    } = req.body;
    const subtask = await updateSubtask(
      id,
      taskId,
      title,
      description,
      due_date,
      priority,
      status,
      is_recurring,
      recurrence_interval
    );
    res.status(200).json({
      message: 'Subtask updated successfully',
      subtask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubtaskController = async (req, res) => {
  try {
    const { taskId } = req.params;
    await deleteSubtask(Number(taskId));
    res.status(200).json({
      message: 'Subtask deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeSubtaskController = async (req, res) => {
  try {
    const { taskId, id } = req.params;
    const userId = req.user.id;
    const updatedSubtask = await completeSubtask(userId, parseInt(id));
    res.status(200).json({
      message: 'Subtask completed successfully',
      subtask: updatedSubtask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
