import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/database.js';

describe('Task API', () => {
  let token;
  let taskId;

  beforeAll(async () => {
    // Buat user untuk mendapatkan token autentikasi
    const user = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        password: 'password',
      },
    });

    // Dapatkan token autentikasi
    const response = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'password',
    });

    token = response.body.token;

    // Buat task untuk keperluan testing
    const task = await prisma.task.create({
      data: {
        title: 'Test Task',
        description: 'Test Task Description',
        due_date: new Date(),
        user_id: user.id,
        project_id: 1,
        section_id: 1,
      },
    });

    taskId = task.id;
  });

  afterAll(async () => {
    // Hapus data yang telah dibuat setelah testing selesai
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  it('GET /api/tasks/:id - should return task details for a valid task ID', async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', taskId);
    expect(response.body).toHaveProperty('title', 'Test Task');
    expect(response.body).toHaveProperty(
      'description',
      'Test Task Description'
    );
  });

  it('GET /api/tasks/:id - should return 400 for an invalid task ID', async () => {
    const response = await request(app)
      .get('/api/tasks/invalid-id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid task ID');
  });

  it('GET /api/tasks/:id - should return 404 for a non-existent task ID', async () => {
    const nonExistentTaskId = 9999;
    const response = await request(app)
      .get(`/api/tasks/${nonExistentTaskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Task not found');
  });

  it('POST /api/tasks - should create a new task', async () => {
    const newTask = {
      title: 'New Task',
      description: 'New Task Description',
      due_date: new Date(),
      project_id: 1,
      section_id: 1,
    };

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(newTask);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'Task created successfully'
    );
    expect(response.body.task).toHaveProperty('title', 'New Task');
  });

  it('PUT /api/tasks/:id - should update an existing task', async () => {
    const updatedTask = {
      title: 'Updated Task',
      description: 'Updated Task Description',
      due_date: new Date(),
    };

    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedTask);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Task updated successfully'
    );
    expect(response.body.task).toHaveProperty('title', 'Updated Task');
  });

  it('DELETE /api/tasks/:id - should delete an existing task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Task deleted successfully'
    );
  });

  it('GET /api/tasks - should return tasks for the authenticated user', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
