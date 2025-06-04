const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Authentication token required' });
  }
};

const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ message: 'API key required' });
  }

  try {
    const { User } = require('../models');
    const user = await User.findOne({ where: { apiKey } });
    
    if (!user) {
      return res.status(403).json({ message: 'Invalid API key' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Error authenticating API key:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  authenticateJWT,
  authenticateApiKey
};
