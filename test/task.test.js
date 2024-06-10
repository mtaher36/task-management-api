import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/prismaClient';

describe('Task API', () => {
  let token;
  let user;
  let project;
  let section;

  beforeAll(async () => {
    // Create a user and get a token
    const userRes = await request(app).post('/api/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    user = userRes.body.user;

    const loginRes = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    token = loginRes.body.token;

    // Create a project
    project = await prisma.taskProject.create({
      data: {
        title: 'Test Project',
        description: 'Test Project Description',
        owner_id: user.id,
      },
    });

    // Create a section
    section = await prisma.taskSection.create({
      data: {
        name: 'Test Section',
        project_id: project.id,
      },
    });
  });

  afterAll(async () => {
    // Clean up database
    await prisma.taskSection.deleteMany();
    await prisma.taskProject.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          project_id: project.id,
          section_id: section.id,
          title: 'New Task',
          description: 'Task description',
          due_date: '2023-12-31',
          priority: 'High',
          is_recurring: true,
          recurrence_interval: 'Daily',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'Task created successfully');
      expect(res.body.task).toHaveProperty('id');
      expect(res.body.task.title).toBe('New Task');
    });

    it('should return an error for invalid input data', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          section_id: section.id,
          title: 'New Task',
          description: 'Task description',
          due_date: '2023-12-31',
          priority: 'High',
          is_recurring: true,
          recurrence_interval: 'Daily',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let task;

    beforeAll(async () => {
      task = await prisma.task.create({
        data: {
          project_id: project.id,
          section_id: section.id,
          title: 'Task to Update',
          description: 'Task description',
          due_date: new Date('2023-12-31'),
          priority: 'High',
          status: 'Pending',
          is_recurring: true,
          recurrence_interval: 'Daily',
        },
      });
    });

    it('should update a task', async () => {
      const res = await request(app)
        .put(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Task',
          description: 'Updated description',
          due_date: '2024-01-31',
          priority: 'Medium',
          status: 'In Progress',
          is_recurring: false,
          recurrence_interval: null,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Task updated successfully');
      expect(res.body.task.title).toBe('Updated Task');
    });

    it('should return an error for invalid input data', async () => {
      const res = await request(app)
        .put(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '',
          description: 'Updated description',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let task;

    beforeAll(async () => {
      task = await prisma.task.create({
        data: {
          project_id: project.id,
          section_id: section.id,
          title: 'Task to Delete',
          description: 'Task description',
          due_date: new Date('2023-12-31'),
          priority: 'High',
          status: 'Pending',
          is_recurring: true,
          recurrence_interval: 'Daily',
        },
      });
    });

    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Task deleted successfully');
    });

    it('should return an error for non-existent task', async () => {
      const res = await request(app)
        .delete('/api/tasks/999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/tasks/:id/complete', () => {
    let task;

    beforeAll(async () => {
      task = await prisma.task.create({
        data: {
          project_id: project.id,
          section_id: section.id,
          title: 'Task to Complete',
          description: 'Task description',
          due_date: new Date('2023-12-31'),
          priority: 'High',
          status: 'Pending',
          is_recurring: true,
          recurrence_interval: 'Daily',
        },
      });
    });

    it('should mark a task as completed', async () => {
      const res = await request(app)
        .post(`/api/tasks/${task.id}/complete`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty(
        'message',
        'Task marked as completed successfully'
      );
      expect(res.body.task.status).toBe('Completed');
    });

    it('should return an error for non-existent task', async () => {
      const res = await request(app)
        .post('/api/tasks/999/complete')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
