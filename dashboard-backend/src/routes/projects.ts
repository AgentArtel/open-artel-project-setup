import { Router } from 'express';
import { ApiResponse, Project } from '../types';

export const projectsRouter = Router();

// In-memory storage (replace with database in production)
const projects: Project[] = [];

// GET /api/projects - List all monitored projects
projectsRouter.get('/', (req, res) => {
  const response: ApiResponse<Project[]> = {
    success: true,
    data: projects,
  };
  res.json(response);
});

// GET /api/projects/:owner/:repo - Get project details
projectsRouter.get('/:owner/:repo', (req, res) => {
  const { owner, repo } = req.params;
  const fullName = `${owner}/${repo}`;
  
  const project = projects.find(p => p.fullName === fullName);
  
  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Project not found',
    });
  }
  
  const response: ApiResponse<Project> = {
    success: true,
    data: project,
  };
  res.json(response);
});

// POST /api/projects - Add new project
projectsRouter.post('/', (req, res) => {
  const { owner, repo, url, isLocal, localPath, settings } = req.body;
  
  if (!owner || !repo) {
    return res.status(400).json({
      success: false,
      error: 'owner and repo are required',
    });
  }
  
  const fullName = `${owner}/${repo}`;
  const existingProject = projects.find(p => p.fullName === fullName);
  
  if (existingProject) {
    return res.status(409).json({
      success: false,
      error: 'Project already exists',
    });
  }
  
  const project: Project = {
    id: fullName,
    name: repo,
    fullName,
    owner,
    repo,
    url: url || `https://github.com/${fullName}`,
    isLocal: isLocal || false,
    localPath,
    settings: settings || {
      refreshInterval: 30,
      defaultView: 'dashboard',
      notifications: true,
    },
  };
  
  projects.push(project);
  
  const response: ApiResponse<Project> = {
    success: true,
    data: project,
    message: 'Project added successfully',
  };
  res.status(201).json(response);
});

// DELETE /api/projects/:owner/:repo - Remove project
projectsRouter.delete('/:owner/:repo', (req, res) => {
  const { owner, repo } = req.params;
  const fullName = `${owner}/${repo}`;
  
  const index = projects.findIndex(p => p.fullName === fullName);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Project not found',
    });
  }
  
  projects.splice(index, 1);
  
  res.json({
    success: true,
    message: 'Project removed successfully',
  });
});

