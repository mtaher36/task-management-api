import prisma from '../config/database.js';

export const createSubtask = async (task_id, title, description, priority) => {
  return await prisma.subTask.create({
    data: {
      task_id,
      title,
      description,
      priority,
    },
  });
};

export const getSubtasks = async (taskId) => {
  return await prisma.subTask.findMany({
    where: {
      task_id: Number(taskId),
    },
  });
};

export const updateSubtask = async (
  id,
  task_id,
  title,
  description,
  priority,
  status
) => {
  const subtask = await prisma.subTask.findUnique({
    where: { id: parseInt(id) },
  });

  if (!subtask) {
    throw new Error('Subtask not found');
  }

  return await prisma.subTask.update({
    where: { id: parseInt(id) },
    data: {
      title: title !== undefined ? title : subtask.title,
      description:
        description !== undefined ? description : subtask.description,
      priority: priority !== undefined ? priority : subtask.priority,
      status: status !== undefined ? status : subtask.status,
    },
  });
};

export const deleteSubtask = async (id) => {
  const subtask = await prisma.subTask.findUnique({ where: { id } });

  if (!subtask) {
    throw new Error('Subtask not found');
  }

  await prisma.subTask.delete({
    where: { id },
  });
};

// Complete Subtask
export const completeSubtask = async (userId, subtaskId) => {
  const subtask = await prisma.subTask.findUnique({
    where: { id: subtaskId },
    include: { task: { include: { project: true } } },
  });

  if (!subtask) {
    throw new Error('Subtask not found');
  }

  if (subtask.task.project.owner_id !== userId) {
    throw new Error('Unauthorized');
  }

  const updatedSubtask = await prisma.subTask.update({
    where: { id: subtaskId },
    data: { status: 'Completed' },
  });

  return updatedSubtask;
};
