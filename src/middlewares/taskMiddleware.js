import prisma from '../config/database.js';

export const validateTaskOwnership = async (req, res, next) => {
  const taskId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.project.owner_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
