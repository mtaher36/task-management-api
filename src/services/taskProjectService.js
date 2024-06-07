import prisma from '../config/database.js';

export const createTaskProject = async (data) => {
  return prisma.taskProject.create({ data });
};

export const getAllTaskProjects = async () => {
  return prisma.taskProject.findMany();
};

export const getTaskProjectsByOwnerId = async (owner_id) => {
  return prisma.taskProject.findMany({
    where: { owner_id },
  });
};
export const getTaskProjectById = async (id) => {
  return prisma.taskProject.findUnique({ where: { id } });
};

export const updateTaskProjectById = async (id, data) => {
  return prisma.taskProject.update({ where: { id }, data });
};

export const deleteTaskProjectById = async (id) => {
  return prisma.taskProject.delete({ where: { id } });
};
