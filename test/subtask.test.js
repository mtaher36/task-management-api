import supertest from 'supertest';
import app from '../app.js';

const request = supertest(app);

describe('Subtask API', () => {
  let authToken;
  beforeAll(async () => {
    // Login untuk mendapatkan token
    const response = await request.post('/api/auth/login').send({
      email: 'user@example.com',
      password: 'your_password',
    });
    authToken = response.body.token;
  });

  it('should create a new subtask', async () => {
    const response = await request
      .post('/api/subtasks/taskId/subtasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'New Subtask',
        description: 'Description of the subtask',
        due_date: '2024-12-31',
        priority: 'High',
        is_recurring: false,
        recurrence_interval: null,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('subtask');
  });

  it('should get all subtasks', async () => {
    const response = await request
      .get('/api/subtasks/taskId/subtasks')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('subtasks');
  });

  it('should update a subtask', async () => {
    const response = await request
      .put('/api/subtasks/taskId/subtasks/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Subtask',
        description: 'Updated description',
        due_date: '2025-01-31',
        priority: 'Medium',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('subtask');
    expect(response.body.subtask.title).toBe('Updated Subtask');
  });

  it('should delete a subtask', async () => {
    const response = await request
      .delete('/api/subtasks/taskId/subtasks/1')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(204);
  });

  it('should complete a subtask', async () => {
    const response = await request
      .post('/api/subtasks/taskId/subtasks/1/complete')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('subtask');
    expect(response.body.subtask.status).toBe('Completed');
  });
});
