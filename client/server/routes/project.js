const express = require('express');
const router = express.Router();
const { Project, File } = require('../models');
const { authenticateJWT } = require('../middleware/auth');

// Get all projects for a user
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user.id },
      order: [['updatedAt', 'DESC']]
    });
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific project with its files
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [{ model: File }]
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { name, description, repositoryUrl } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    
    const project = await Project.create({
      name,
      description,
      repositoryUrl,
      userId: req.user.id
    });
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a project
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { name, description, repositoryUrl } = req.body;
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await project.update({
      name: name || project.name,
      description: description !== undefined ? description : project.description,
      repositoryUrl: repositoryUrl !== undefined ? repositoryUrl : project.repositoryUrl
    });
    
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a project
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
