import { prisma } from '../src/prismaClient';
import { createNotification } from '../src/services/notificationService';
import { sendEmail } from '../src/utils/email';

jest.mock('../src/utils/email');

describe('Notification Service', () => {
  let user;
  let task;

  beforeAll(async () => {
    user = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      },
    });

    task = await prisma.task.create({
      data: {
        project_id: 1,
        section_id: 1,
        title: 'Test Task',
        description: 'This is a test task',
        due_date: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
        priority: 'High',
        status: 'InProgress',
        user_id: user.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a notification and send an email', async () => {
    const message = 'Your task "Test Task" is due soon!';
    await createNotification(user.id, task.id, message);

    expect(sendEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Task Notification',
      `${message}\n\nView Task: http://your-app-url/tasks/${task.id}`
    );
  });

  it('should schedule and send notifications for due tasks', async () => {
    const now = new Date();
    const tasks = await prisma.task.findMany({
      where: {
        due_date: {
          gte: now,
          lte: new Date(now.getTime() + 15 * 60 * 1000),
        },
        status: 'InProgress',
      },
    });

    for (const task of tasks) {
      const message = `Your task "${task.title}" is due soon!`;
      await createNotification(task.user_id, task.id, message);
    }

    expect(sendEmail).toHaveBeenCalledTimes(tasks.length);
  });
});
