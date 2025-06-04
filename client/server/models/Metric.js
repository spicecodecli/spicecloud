const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const crypto = require('crypto');

const Metric = sequelize.define('Metric', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Files',
      key: 'id'
    }
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  hooks: {
    beforeValidate: (metric) => {
      // Generate hash from data to enable deduplication
      if (metric.data) {
        const dataString = JSON.stringify(metric.data);
        metric.hash = crypto.createHash('sha256').update(dataString).digest('hex');
      }
    }
  }
});

module.exports = { Metric };
