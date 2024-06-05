// src/middlewares/errorMiddleware.js
import logger from '../config/logger.js';

const errorMiddleware = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
};

export default errorMiddleware;
