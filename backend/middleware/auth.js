const jwt = require('jsonwebtoken');
const { getIsInMemory } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'medicare_ai_super_secret_jwt_key_2026';

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (getIsInMemory()) {
      const user = memoryStore.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found in session store.' });
      }
      req.user = user;
    } else {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found.' });
      }
      req.user = user;
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
  }
  next();
};

module.exports = { requireAuth, requireAdmin, JWT_SECRET };
