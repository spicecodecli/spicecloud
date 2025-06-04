const { User } = require('./User');
const { Project } = require('./Project');
const { File } = require('./File');
const { Metric } = require('./Metric');

// Define relationships
User.hasMany(Project, { foreignKey: 'userId', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'userId' });

Project.hasMany(File, { foreignKey: 'projectId', onDelete: 'CASCADE' });
File.belongsTo(Project, { foreignKey: 'projectId' });

File.hasMany(Metric, { foreignKey: 'fileId', onDelete: 'CASCADE' });
Metric.belongsTo(File, { foreignKey: 'fileId' });

module.exports = {
  User,
  Project,
  File,
  Metric
};
