import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/database.js';

describe('Task Section API', () => {
  let userToken, userToken2, project, project2, taskSection;

  beforeAll(async () => {
    // Create two users
    const user1 = await prisma.user.create({
      data: {
        username: 'testuser1',
        email: 'testuser1@example.com',
        password: 'password123',
      },
    });

    const user2 = await prisma.user.create({
      data: {
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: 'password123',
      },
    });

    // Simulate user login to get tokens
    const res1 = await request(app).post('/api/auth/login').send({
      email: 'testuser1@example.com',
      password: 'password123',
    });
    userToken = res1.body.token;

    const res2 = await request(app).post('/api/auth/login').send({
      email: 'testuser2@example.com',
      password: 'password123',
    });
    userToken2 = res2.body.token;

    // Create projects for both users
    project = await prisma.taskProject.create({
      data: {
        title: 'User 1 Project',
        description: 'Description for user 1 project',
        owner_id: user1.id,
      },
    });

    project2 = await prisma.taskProject.create({
      data: {
        title: 'User 2 Project',
        description: 'Description for user 2 project',
        owner_id: user2.id,
      },
    });

    // Create a task section for user 1's project
    taskSection = await prisma.taskSection.create({
      data: {
        name: 'User 1 Task Section',
        project_id: project.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.taskSection.deleteMany();
    await prisma.taskProject.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a task section for the authenticated user', async () => {
    const res = await request(app)
      .post('/api/task-sections')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'New Task Section',
        project_id: project.id,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.taskSection).toHaveProperty('id');
    expect(res.body.taskSection.name).toBe('New Task Section');
  });

  it('should get task section by ID if owner', async () => {
    const res = await request(app)
      .get(`/api/task-sections/${taskSection.id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('User 1 Task Section');
  });

  it('should not get task section by ID if not owner', async () => {
    const res = await request(app)
      .get(`/api/task-sections/${taskSection.id}`)
      .set('Authorization', `Bearer ${userToken2}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('should update task section if owner', async () => {
    const res = await request(app)
      .put(`/api/task-sections/${taskSection.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Updated Task Section',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.taskSection.name).toBe('Updated Task Section');
  });

  it('should not update task section if not owner', async () => {
    const res = await request(app)
      .put(`/api/task-sections/${taskSection.id}`)
      .set('Authorization', `Bearer ${userToken2}`)
      .send({
        name: 'Updated Task Section',
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('should delete task section if owner', async () => {
    const res = await request(app)
      .delete(`/api/task-sections/${taskSection.id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Task section deleted successfully');
  });

  it('should not delete task section if not owner', async () => {
    // Create another task section for this test
    const newTaskSection = await prisma.taskSection.create({
      data: {
        name: 'Another Task Section',
        project_id: project.id,
      },
    });

    const res = await request(app)
      .delete(`/api/task-sections/${newTaskSection.id}`)
      .set('Authorization', `Bearer ${userToken2}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body.error).toBe('Unauthorized');
  });
});
