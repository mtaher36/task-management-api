// tests/taskProject.test.js
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/database.js';

describe('Task Project API', () => {
  let token;
  let projectId;

  beforeAll(async () => {
    // Assume you have a way to get a valid token
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });
    token = res.body.token;
  });

  afterAll(async () => {
    await prisma.taskProject.deleteMany(); // Clear test data
    await prisma.user.deleteMany(); // Clear test data
    await prisma.$disconnect();
  });

  it('should create a new task project', async () => {
    const res = await request(app)
      .post('/api/task-projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Project',
        description: 'Project description',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body.taskProject).toHaveProperty('id');
    projectId = res.body.taskProject.id;
  });

  it('should not create a new task project with invalid data', async () => {
    const res = await request(app)
      .post('/api/task-projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '', // Invalid title
        description: 'Project description',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should get all task projects', async () => {
    const res = await request(app)
      .get('/api/task-projects')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should update a task project', async () => {
    const res = await request(app)
      .put(`/api/task-projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Project',
        description: 'Updated description',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.taskProject.title).toBe('Updated Project');
  });

  it('should not update a task project with invalid data', async () => {
    const res = await request(app)
      .put(`/api/task-projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '', // Invalid title
        description: 'Updated description',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should delete a task project', async () => {
    const res = await request(app)
      .delete(`/api/task-projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  });
});
