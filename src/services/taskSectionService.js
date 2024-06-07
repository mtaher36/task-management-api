// src/services/taskSectionService.js

import prisma from '../config/database.js';

export const createTaskSection = async (name, projectId) => {
  return prisma.taskSection.create({
    data: {
      name,
      project_id: projectId,
    },
  });
};

export const getTaskSectionsByProjectId = async (projectId) => {
  return prisma.taskSection.findMany({
    where: { project_id: Number(projectId) },
  });
};
export const getTaskSectionById = async (id) => {
  return await prisma.taskSection.findUnique({
    where: { id },
  });
};

export const updateTaskSection = async (id, name) => {
  return prisma.taskSection.update({
    where: { id: Number(id) },
    data: {
      name,
    },
  });
};

export const deleteTaskSection = async (id) => {
  return prisma.taskSection.delete({
    where: { id: Number(id) },
  });
};

// Function to check if the user is the owner of the project that contains the task section
export const isTaskSectionOwner = async (sectionId, userId) => {
  const section = await prisma.taskSection.findUnique({
    where: { id: Number(sectionId) },
    select: {
      project: {
        select: {
          owner_id: true,
        },
      },
    },
  });
  return section && section.project.owner_id === userId;
};

// Function to check if the user is the owner of the project
export const isProjectOwner = async (projectId, userId) => {
  const project = await prisma.taskProject.findUnique({
    where: { id: Number(projectId) },
    select: {
      owner_id: true,
    },
  });
  return project && project.owner_id === userId;
};
