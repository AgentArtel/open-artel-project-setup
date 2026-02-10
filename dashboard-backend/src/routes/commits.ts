import { Router } from 'express';
import { ApiResponse, Commit } from '../types';

export const commitsRouter = Router({ mergeParams: true });

// Placeholder data (replace with GitHub API integration in D1-3)
const commits: Commit[] = [];

// GET /api/projects/:owner/:repo/commits - Commit history
commitsRouter.get('/', (req, res) => {
  const params = req.params as { owner?: string; repo?: string };
  const owner = params.owner || '';
  const repo = params.repo || '';
  const limit = parseInt(req.query.limit as string || '50', 10);
  
  // TODO: Fetch from GitHub API in D1-3
  const response: ApiResponse<Commit[]> = {
    success: true,
    data: commits.slice(0, limit),
    message: 'Commits endpoint ready. GitHub integration pending (D1-3).',
  };
  res.json(response);
});

// GET /api/projects/:owner/:repo/commits/:sha - Single commit details
commitsRouter.get('/:sha', (req, res) => {
  const { sha } = req.params;
  
  const commit = commits.find(c => c.sha === sha);
  
  if (!commit) {
    return res.status(404).json({
      success: false,
      error: 'Commit not found',
    });
  }
  
  const response: ApiResponse<Commit> = {
    success: true,
    data: commit,
  };
  res.json(response);
});

