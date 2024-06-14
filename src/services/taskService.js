import prisma from '../config/database.js';
import { addDays, addMonths, addWeeks, addYears } from 'date-fns';

export const createTask = async (
  userId,
  project_id,
  section_id,
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

  const project = await prisma.taskProject.findUnique({
    where: { id: project_id },
  });

  if (!project || project.owner_id !== userId) {
    throw new Error('Forbidden: You do not own this project');
  }

  return await prisma.task.create({
    data: {
      project_id,
      section_id,
      title,
      description,
      due_date: new Date(due_date),
      priority,
      is_recurring,
      recurrence_interval,
    },
  });
};

export const getTasks = async (userId) => {
  return await prisma.task.findMany({
    where: {
      project: {
        owner_id: userId,
      },
    },
  });
};

export const getTaskById = async (id, userId) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  if (task.project.owner_id !== userId) {
    throw new Error('Forbidden: You do not own this project');
  }

  return task;
};

export const updateTask = async (
  id,
  userId,
  title,
  description,
  due_date,
  priority,
  status,
  is_recurring,
  recurrence_interval
) => {
  const task = await getTaskById(id, userId);

  if (
    recurrence_interval !== null &&
    recurrence_interval !== undefined &&
    recurrence_interval !== ''
  ) {
    is_recurring = true;
  }

  const updatedTaskData = {
    title: title ?? task.title,
    description: description ?? task.description,
    due_date: due_date ? new Date(due_date) : task.due_date,
    priority: priority ?? task.priority,
    status: status ?? task.status,
    is_recurring: is_recurring ?? task.is_recurring,
    recurrence_interval: recurrence_interval ?? task.recurrence_interval,
  };

  return await prisma.task.update({
    where: { id },
    data: updatedTaskData,
  });
};

export const deleteTask = async (id, userId) => {
  const task = await getTaskById(id, userId);

  await prisma.task.delete({
    where: { id },
  });
};

export const completeTask = async (userId, taskId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  if (task.project.owner_id !== userId) {
    throw new Error('Unauthorized');
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status: 'Completed' },
  });

  if (task.is_recurring) {
    let newDueDate;

    switch (task.recurrence_interval) {
      case 'Daily':
        newDueDate = addDays(new Date(task.due_date), 1);
        break;
      case 'Weekly':
        newDueDate = addWeeks(new Date(task.due_date), 1);
        break;
      case 'Monthly':
        newDueDate = addMonths(new Date(task.due_date), 1);
        break;
      case 'Yearly':
        newDueDate = addYears(new Date(task.due_date), 1);
        break;
      default:
        newDueDate = task.due_date;
    }

    await prisma.task.create({
      data: {
        project_id: task.project_id,
        section_id: task.section_id,
        title: task.title,
        description: task.description,
        due_date: newDueDate,
        priority: task.priority,
        status: 'InProgress',
        is_recurring: task.is_recurring,
        recurrence_interval: task.recurrence_interval,
      },
    });
  }

  return updatedTask;
};
