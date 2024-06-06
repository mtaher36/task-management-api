import prisma from '../config/database.js';

const getUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      profile_image: true,
      role_id: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getUserByIdWithPassword = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      password: true,
      username: true,
    },
  });
};

const updateUserById = async (id, data) => {
  return prisma.user.update({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      profile_image: true,
      role_id: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    data,
  });
};

const updatePasswordById = async (id, hashedPassword) => {
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
};

export {
  getUserById,
  updateUserById,
  updatePasswordById,
  getUserByIdWithPassword,
};
