import prisma from '../config/database.js';
import { addDays, addMonths, addWeeks, addYears } from 'date-fns';

export const createSubtask = async (
  task_id,
  title,
  description,
  due_date,
  priority,
  is_recurring,
  recurrence_interval
) => {
  if (
    recurrence_interval !== null &&
    recurrence_interval !== undefined &&
    recurrence_interval !== ''
  ) {
    is_recurring = true;
    due_date = new Date();
  }
  return await prisma.subTask.create({
    data: {
      task_id,
      title,
      description,
      due_date: new Date(due_date),
      priority,
      is_recurring,
      recurrence_interval,
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
  due_date,
  priority,
  status,
  is_recurring,
  recurrence_interval
) => {
  if (
    recurrence_interval !== null &&
    recurrence_interval !== undefined &&
    recurrence_interval !== ''
  ) {
    is_recurring = true;
    due_date = new Date();
  }

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
      due_date: due_date !== undefined ? new Date(due_date) : subtask.due_date,
      priority: priority !== undefined ? priority : subtask.priority,
      status: status !== undefined ? status : subtask.status,
      is_recurring:
        is_recurring !== undefined ? is_recurring : subtask.is_recurring,
      recurrence_interval:
        recurrence_interval !== undefined
          ? recurrence_interval
          : subtask.recurrence_interval,
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

  if (subtask.is_recurring) {
    let newDueDate;

    switch (subtask.recurrence_interval) {
      case 'Daily':
        newDueDate = addDays(new Date(subtask.due_date), 1);
        break;
      case 'Weekly':
        newDueDate = addWeeks(new Date(subtask.due_date), 1);
        break;
      case 'Monthly':
        newDueDate = addMonths(new Date(subtask.due_date), 1);
        break;
      case 'Yearly':
        newDueDate = addYears(new Date(subtask.due_date), 1);
        break;
      default:
        newDueDate = subtask.due_date;
    }

    await prisma.subTask.create({
      data: {
        task_id: subtask.task_id,
        title: subtask.title,
        description: subtask.description,
        due_date: newDueDate,
        priority: subtask.priority,
        status: 'InProgress',
        is_recurring: subtask.is_recurring,
        recurrence_interval: subtask.recurrence_interval,
      },
    });
  }

  return updatedSubtask;
};
