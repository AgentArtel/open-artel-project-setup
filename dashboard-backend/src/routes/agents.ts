import { Router } from 'express';
import { ApiResponse, Agent } from '../types';

export const agentsRouter = Router({ mergeParams: true });

// Placeholder data (replace with GitHub API integration in D1-3)
const agents: Agent[] = [
  { name: 'claude', status: 'idle' },
  { name: 'cursor', status: 'working', currentTask: 'D1-2' },
  { name: 'lovable', status: 'idle' },
  { name: 'kimi', status: 'idle' },
];

// GET /api/projects/:owner/:repo/agents - List agent status
agentsRouter.get('/', (req, res) => {
  // TODO: Fetch from GitHub API in D1-3
  const response: ApiResponse<Agent[]> = {
    success: true,
    data: agents,
    message: 'Agents endpoint ready. GitHub integration pending (D1-3).',
  };
  res.json(response);
});

