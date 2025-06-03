const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  githubId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  apiKey: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      // Generate API key if not provided
      if (!user.apiKey) {
        user.apiKey = uuidv4();
      }
    }
  }
});

module.exports = { User };
