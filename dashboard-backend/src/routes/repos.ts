import { Router } from 'express';
import { ApiResponse } from '../types';
import { githubService } from '../services/github';

export const reposRouter = Router();

// GET /api/repos - List repositories (user's repos, or optional ?org= for org repos)
reposRouter.get('/', async (req, res) => {
  const org = req.query.org as string | undefined;

  try {
    const repos = await githubService.listRepositories(org);
    const response: ApiResponse<typeof repos> = {
      success: true,
      data: repos,
    };
    res.json(response);
  } catch (error: any) {
    console.error('Error listing repositories:', error);
    if (error.message?.includes('token not configured')) {
      return res.status(503).json({
        success: false,
        error: 'GitHub token not configured',
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to list repositories',
    });
  }
});
