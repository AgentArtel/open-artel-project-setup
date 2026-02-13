import { Router } from 'express';
import { ApiResponse } from '../types';
import { githubService } from '../services/github';

export const reviewsRouter = Router({ mergeParams: true });

// GET /api/projects/:owner/:repo/reviews - List reviews from .ai/reviews/
reviewsRouter.get('/', async (req, res) => {
  const params = req.params as { owner?: string; repo?: string };
  const owner = params.owner || '';
  const repo = params.repo || '';

  try {
    const reviews = await githubService.listReviews(owner, repo);
    const response: ApiResponse<typeof reviews> = {
      success: true,
      data: reviews,
    };
    res.json(response);
  } catch (error: any) {
    if (error.message?.includes('Directory not found') || error.message?.includes('not found')) {
      return res.json({
        success: true,
        data: [],
        message: 'No reviews directory',
      });
    }
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch reviews',
    });
  }
});
