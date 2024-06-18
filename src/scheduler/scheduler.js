// src/scheduler/scheduler.js
import { CronJob } from 'cron';
import prisma from '../config/database.js';
import { createNotification } from '../services/notificationService.js';

// Jadwal untuk memeriksa tugas yang mendekati due date (1 hari ke depan)
const dailyJob = new CronJob(
  '0 0 * * *', // At midnight every day
  async function () {
    console.log('Running daily cron job to check tasks due soon...');
    const now = new Date();
    const oneDayBefore = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    const tasks = await prisma.task.findMany({
      where: {
        due_date: {
          gte: oneDayBefore,
          lt: new Date(oneDayBefore.getTime() + 24 * 60 * 60 * 1000),
        },
        status: 'InProgress',
        notified: false, // Periksa hanya tugas yang belum diberitahu
      },
      include: {
        project: true, // Include project to get owner_id
      },
    });

    console.log('Tasks found for due soon:', tasks.length);

    for (const task of tasks) {
      const message = `Your task "${task.title}" is due soon!`;
      await createNotification(task.project.owner_id, task.id, message);
      console.log(`Notification created for task due soon: ${task.id}`);

      // Update task to mark it as notified
      await prisma.task.update({
        where: { id: task.id },
        data: { notified: true },
      });
    }
  },
  null,
  true,
  'Asia/Jakarta'
);

// Jadwal untuk memeriksa tugas yang sudah mencapai due date
const minuteJob = new CronJob(
  '* * * * *', // Every minute
  async function () {
    console.log('Running minute cron job to check tasks now due...');
    const now = new Date();
    const tasks = await prisma.task.findMany({
      where: {
        due_date: {
          lte: now,
        },
        status: 'InProgress',
        notified: false, // Periksa hanya tugas yang belum diberitahu
      },
      include: {
        project: true, // Include project to get owner_id
      },
    });

    console.log('Tasks found for now due:', tasks.length);

    for (const task of tasks) {
      const message = `Your task "${task.title}" is now due!`;
      await createNotification(task.project.owner_id, task.id, message);
      console.log(`Notification created for task now due: ${task.id}`);
    }
  },
  null,
  true,
  'Asia/Jakarta'
);

export { dailyJob, minuteJob };
