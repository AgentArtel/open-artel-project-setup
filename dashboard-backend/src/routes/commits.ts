import { Router } from 'express';
import { ApiResponse, Commit } from '../types';
import { githubService } from '../services/github';

export const commitsRouter = Router({ mergeParams: true });

// GET /api/projects/:owner/:repo/commits - Commit history
commitsRouter.get('/', async (req, res) => {
  const params = req.params as { owner?: string; repo?: string };
  const owner = params.owner || '';
  const repo = params.repo || '';
  const branch = req.query.branch as string | undefined;
  const limit = parseInt(req.query.limit as string || '50', 10);
  
  try {
    const commits = await githubService.listCommits(owner, repo, branch);
    const response: ApiResponse<Commit[]> = {
      success: true,
      data: commits.slice(0, limit),
    };
    res.json(response);
  } catch (error: any) {
    console.error('Error fetching commits:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch commits',
    });
  }
});

// GET /api/projects/:owner/:repo/commits/:sha - Single commit details
commitsRouter.get('/:sha', async (req, res) => {
  const params = req.params as { owner?: string; repo?: string; sha?: string };
  const owner = params.owner || '';
  const repo = params.repo || '';
  const sha = params.sha || '';
  
  try {
    const commit = await githubService.getCommit(owner, repo, sha);
    const response: ApiResponse<Commit> = {
      success: true,
      data: commit,
    };
    res.json(response);
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Commit not found',
      });
    }
    console.error('Error fetching commit:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch commit',
    });
  }
});

