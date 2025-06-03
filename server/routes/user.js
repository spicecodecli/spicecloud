const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { authenticateJWT } = require('../middleware/auth');

// Get user profile
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate new API key
router.post('/api-key/generate', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate new API key
    const newApiKey = uuidv4();
    await user.update({ apiKey: newApiKey });
    
    res.json({ apiKey: newApiKey });
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
