const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// GitHub OAuth login route
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback route
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  (req, res) => {
    // Create JWT token
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

// Check authentication status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ isAuthenticated: true, user: req.user });
  }
  return res.json({ isAuthenticated: false });
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
