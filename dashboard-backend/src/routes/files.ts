import { Router } from 'express';
import { ApiResponse } from '../types';
import { githubService } from '../services/github';

export const filesRouter = Router({ mergeParams: true });

// GET /api/projects/:owner/:repo/files/:path* - File content or directory listing
// Path ending with / (or empty) => list directory; otherwise => file content
filesRouter.get('/*', async (req, res) => {
  const params = req.params as { owner?: string; repo?: string; [key: string]: unknown };
  const owner = (params.owner as string) || '';
  const repo = (params.repo as string) || '';
  let rawPath = (params['0'] as string) || '';
  const ref = req.query.ref as string | undefined;
  const isDirectoryRequest = rawPath.endsWith('/') || rawPath === '';
  const path = rawPath.replace(/\/+$/, '');

  try {
    if (isDirectoryRequest) {
      const dirPath = path || '';
      const items = await githubService.listDirectory(owner, repo, dirPath);
      const response: ApiResponse<{ path: string; items: typeof items }> = {
        success: true,
        data: {
          path: dirPath,
          items,
        },
      };
      return res.json(response);
    }

    const content = await githubService.getFileContent(owner, repo, path, ref);
    const response: ApiResponse<{ path: string; content: string }> = {
      success: true,
      data: {
        path,
        content,
      },
    };
    res.json(response);
  } catch (error: any) {
    if (error.message?.includes('not found') || error.message?.includes('Path is not a directory')) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }
    if (error.message?.includes('token not configured')) {
      return res.status(503).json({
        success: false,
        error: error.message,
      });
    }
    console.error('Error fetching file or directory:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch file or directory',
    });
  }
});

