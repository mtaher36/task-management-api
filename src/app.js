import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskProjectRoutes from './routes/taskProjectRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/task-projects', taskProjectRoutes);
app.use(errorMiddleware);

export default app;
