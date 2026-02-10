import { Router } from 'express';
import { ApiResponse } from '../types';

export const filesRouter = Router({ mergeParams: true });

// GET /api/projects/:owner/:repo/files/:path* - Read file content
filesRouter.get('/*', (req, res) => {
  const { owner, repo } = req.params;
  const filePath = req.params[0]; // Capture everything after /files/
  
  if (!filePath) {
    return res.status(400).json({
      success: false,
      error: 'File path is required',
    });
  }
  
  // TODO: Fetch from GitHub API in D1-3
  const response: ApiResponse<{ path: string; content: string }> = {
    success: true,
    data: {
      path: filePath,
      content: '',
    },
    message: 'Files endpoint ready. GitHub integration pending (D1-3).',
  };
  res.json(response);
});

