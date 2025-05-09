const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Middleware to verify JWT token
 */
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  const token = authHeader.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    logger.error('Token verification error:', err);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

/**
 * Middleware to check if user is admin
 */
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

/**
 * Middleware to check if user is a doctor
 */
exports.isDoctor = (req, res, next) => {
  if (req.user && req.user.role === 'doctor') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Doctor role required.' });
  }
};

/**
 * Middleware to check if user is either admin or doctor
 */
exports.isAdminOrDoctor = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'doctor')) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin or doctor role required.' });
  }
}; 