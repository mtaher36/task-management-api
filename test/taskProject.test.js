import request from 'supertest';
import app from '../src/app.js'; // Pastikan path ini sesuai dengan struktur folder Anda
import prisma from '../src/config/database.js';

describe('Task Project API', () => {
  let token;
  let projectId;

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

    // Buat project untuk keperluan testing
    const project = await prisma.taskProject.create({
      data: {
        name: 'Test Project',
        description: 'Test Project Description',
        owner_id: user.id,
      },
    });

    projectId = project.id;
  });

  afterAll(async () => {
    // Hapus data yang telah dibuat setelah testing selesai
    await prisma.taskProject.deleteMany();
    await prisma.user.deleteMany();
  });

  it('POST /api/task-projects - should create a new task project', async () => {
    const newProject = {
      title: 'New Project',
      description: 'New Project Description',
    };

    const response = await request(app)
      .post('/api/task-projects')
      .set('Authorization', `Bearer ${token}`)
      .send(newProject);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'Task project created successfully'
    );
    expect(response.body.taskProject).toHaveProperty('id');
    expect(response.body.taskProject).toMatchObject({
      title: newProject.title,
      description: newProject.description,
      owner_id: expect.any(Number), // Jika menggunakan user dummy yang sama, sesuaikan dengan user.id yang ada
    });
  });

  it('GET /api/task-projects/:id - should return project details for a valid project ID', async () => {
    const response = await request(app)
      .get(`/api/task-projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', projectId);
    expect(response.body).toHaveProperty('title', 'Test Project');
    expect(response.body).toHaveProperty(
      'description',
      'Test Project Description'
    );
  });

  it('GET /api/task-projects/:id - should return 400 for an invalid project ID', async () => {
    const response = await request(app)
      .get('/api/task-projects/invalid-id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid project ID');
  });

  it('GET /api/task-projects/:id - should return 404 for a non-existent project ID', async () => {
    const nonExistentProjectId = 9999;
    const response = await request(app)
      .get(`/api/task-projects/${nonExistentProjectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Task project not found');
  });

  it('PUT /api/task-projects/:id - should update a task project', async () => {
    const updatedProject = {
      title: 'Updated Project',
      description: 'Updated Project Description',
    };

    const response = await request(app)
      .put(`/api/task-projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedProject);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Task project updated successfully'
    );
    expect(response.body.taskProject).toHaveProperty('id', projectId);
    expect(response.body.taskProject).toMatchObject(updatedProject);
  });

  it('PUT /api/task-projects/:id - should return 404 for a non-existent project ID during update', async () => {
    const nonExistentProjectId = 9999;
    const updatedProject = {
      title: 'Updated Project',
      description: 'Updated Project Description',
    };

    const response = await request(app)
      .put(`/api/task-projects/${nonExistentProjectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedProject);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Task project not found');
  });

  it('DELETE /api/task-projects/:id - should delete a task project', async () => {
    const response = await request(app)
      .delete(`/api/task-projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Task project deleted successfully'
    );
  });

  it('DELETE /api/task-projects/:id - should return 404 for a non-existent project ID during delete', async () => {
    const nonExistentProjectId = 9999;
    const response = await request(app)
      .delete(`/api/task-projects/${nonExistentProjectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Task project not found');
  });
});
