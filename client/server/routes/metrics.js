const express = require('express');
const router = express.Router();
const { Metric, File, Project } = require('../models');
const { authenticateJWT, authenticateApiKey } = require('../middleware/auth');

// Submit metrics via API key
router.post('/submit', authenticateApiKey, async (req, res) => {
  try {
    const { projectName, filePath, fileName, metrics } = req.body;
    
    if (!projectName || !filePath || !fileName || !metrics) {
      return res.status(400).json({ 
        message: 'Missing required fields: projectName, filePath, fileName, metrics' 
      });
    }
    
    // Find or create project
    let [project] = await Project.findOrCreate({
      where: { 
        name: projectName,
        userId: req.user.id
      },
      defaults: {
        description: `Project created via SpiceCode CLI for ${projectName}`
      }
    });
    
    // Find or create file
    let [file] = await File.findOrCreate({
      where: { 
        path: filePath,
        projectId: project.id
      },
      defaults: {
        name: fileName
      }
    });
    
    // Check for duplicate metrics using hash
    const dataString = JSON.stringify(metrics);
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');
    
    const existingMetric = await Metric.findOne({
      where: {
        fileId: file.id,
        hash: hash
      },
      order: [['createdAt', 'DESC']]
    });
    
    if (existingMetric) {
      return res.json({ 
        message: 'Metrics already exist',
        metricId: existingMetric.id,
        timestamp: existingMetric.timestamp
      });
    }
    
    // Create new metric
    const metric = await Metric.create({
      fileId: file.id,
      data: metrics,
      hash: hash,
      timestamp: new Date()
    });
    
    res.status(201).json({
      message: 'Metrics saved successfully',
      metricId: metric.id,
      timestamp: metric.timestamp
    });
  } catch (error) {
    console.error('Error submitting metrics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get metrics for a file
router.get('/file/:fileId', authenticateJWT, async (req, res) => {
  try {
    const file = await File.findOne({
      where: { id: req.params.fileId },
      include: [{ 
        model: Project,
        where: { userId: req.user.id }
      }]
    });
    
    if (!file) {
      return res.status(404).json({ message: 'File not found or access denied' });
    }
    
    const metrics = await Metric.findAll({
      where: { fileId: file.id },
      order: [['timestamp', 'DESC']]
    });
    
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching file metrics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get latest metrics for a project
router.get('/project/:projectId/latest', authenticateJWT, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.projectId,
        userId: req.user.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const files = await File.findAll({
      where: { projectId: project.id },
      include: [{
        model: Metric,
        limit: 1,
        order: [['timestamp', 'DESC']]
      }]
    });
    
    res.json(files);
  } catch (error) {
    console.error('Error fetching project metrics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get historical metrics for a project
router.get('/project/:projectId/history', authenticateJWT, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.projectId,
        userId: req.user.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const files = await File.findAll({
      where: { projectId: project.id },
      include: [{
        model: Metric,
        order: [['timestamp', 'DESC']]
      }]
    });
    
    res.json(files);
  } catch (error) {
    console.error('Error fetching project metrics history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
