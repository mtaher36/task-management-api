// src/services/notificationService.js
import prisma from '../config/database.js';
import { sendEmail } from '../utils/email.js';

export const createNotification = async (userId, taskId, message) => {
  console.log('Creating notification for user:', userId, 'and task:', taskId);

  const notification = await prisma.taskNotification.create({
    data: {
      user_id: userId,
      task_id: taskId,
      message,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!user) {
    console.error(`User with ID ${userId} not found.`);
    return;
  }

  if (!task) {
    console.error(`Task with ID ${taskId} not found.`);
    return;
  }

  const emailSubject = 'Task Notification';
  const emailBody = `${message}\n\nView Task: http://localhost:3000/tasks/${taskId}`;

  console.log(`Sending email to: ${user.email}`);
  await sendEmail(user.email, emailSubject, emailBody);
  console.log(`Email sent to: ${user.email}`);

  // Update task to mark as notified
  await prisma.task.update({
    where: { id: taskId },
    data: { notified: true },
  });

  return notification;
};
