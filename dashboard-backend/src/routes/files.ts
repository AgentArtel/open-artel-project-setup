import { Router } from 'express';
import { ApiResponse } from '../types';
import { githubService } from '../services/github';

export const filesRouter = Router({ mergeParams: true });

// GET /api/projects/:owner/:repo/files/:path* - Read file content
filesRouter.get('/*', async (req, res) => {
  const params = req.params as { owner?: string; repo?: string; [key: string]: unknown };
  const owner = (params.owner as string) || '';
  const repo = (params.repo as string) || '';
  const filePath = (params['0'] as string) || ''; // Capture everything after /files/
  const ref = req.query.ref as string | undefined;
  
  if (!filePath) {
    return res.status(400).json({
      success: false,
      error: 'File path is required',
    });
  }
  
  try {
    const content = await githubService.getFileContent(owner, repo, filePath, ref);
    const response: ApiResponse<{ path: string; content: string }> = {
      success: true,
      data: {
        path: filePath,
        content,
      },
    };
    res.json(response);
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }
    console.error('Error fetching file:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch file',
    });
  }
});

