const { verifyToken } = require('../utils/jwt');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateJWT;
