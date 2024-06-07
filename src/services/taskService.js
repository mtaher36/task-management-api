import prisma from '../config/database.js';

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
  const project = await prisma.taskProject.findUnique({
    where: { id: project_id },
  });

  if (!project || project.owner_id !== userId) {
    throw new Error('Unauthorized');
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

  if (task.project.owner_id !== userId) {
    throw new Error('Unauthorized');
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

  return await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      due_date: new Date(due_date),
      priority,
      status,
      is_recurring,
      recurrence_interval,
    },
  });
};

export const deleteTask = async (id, userId) => {
  const task = await getTaskById(id, userId);

  await prisma.task.delete({
    where: { id },
  });
};
