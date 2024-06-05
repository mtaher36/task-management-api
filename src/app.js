// src/app.js
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorMiddleware);

export default app;
