import { Router } from 'express';
import { ApiResponse } from '../types';
import { githubService } from '../services/github';

export const reportsRouter = Router({ mergeParams: true });

// GET /api/projects/:owner/:repo/reports - List reports from .ai/reports/
reportsRouter.get('/', async (req, res) => {
  const params = req.params as { owner?: string; repo?: string };
  const owner = params.owner || '';
  const repo = params.repo || '';

  try {
    const reports = await githubService.listReports(owner, repo);
    const response: ApiResponse<typeof reports> = {
      success: true,
      data: reports,
    };
    res.json(response);
  } catch (error: any) {
    if (error.message?.includes('Directory not found') || error.message?.includes('not found')) {
      return res.json({
        success: true,
        data: [],
        message: 'No reports directory',
      });
    }
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch reports',
    });
  }
});
