import { Router } from 'express';
import { ApiResponse, Agent } from '../types';
import { githubService } from '../services/github';

export const agentsRouter = Router({ mergeParams: true });

// GET /api/projects/:owner/:repo/agents - List agent status
agentsRouter.get('/', async (req, res) => {
  const params = req.params as { owner?: string; repo?: string };
  const owner = params.owner || '';
  const repo = params.repo || '';
  
  try {
    // Get status.md to determine agent activity
    const statusData = await githubService.getStatusMd(owner, repo);
    
    // Extract agent status from active sprint tasks
    const agentMap = new Map<string, Agent>();
    
    // Initialize default agents
    const defaultAgents = ['claude', 'cursor', 'lovable', 'kimi'];
    defaultAgents.forEach((name) => {
      agentMap.set(name, {
        name,
        status: 'idle',
      });
    });
    
    // Update agent status based on active tasks
    statusData.activeSprint.forEach((task) => {
      if (task.assigned) {
        const agent = agentMap.get(task.assigned.toLowerCase()) || {
          name: task.assigned,
          status: 'working' as const,
          currentTask: task.id,
        };
        agent.status = task.status === 'DONE' ? 'idle' : 'working';
        agent.currentTask = task.id;
        agentMap.set(task.assigned.toLowerCase(), agent);
      }
    });
    
    const agents = Array.from(agentMap.values());
    
    const response: ApiResponse<Agent[]> = {
      success: true,
      data: agents,
    };
    res.json(response);
  } catch (error: any) {
    console.error('Error fetching agents:', error);
    // Return default agents if status.md not found
    const defaultAgents: Agent[] = [
      { name: 'claude', status: 'idle' },
      { name: 'cursor', status: 'idle' },
      { name: 'lovable', status: 'idle' },
      { name: 'kimi', status: 'idle' },
    ];
    res.json({
      success: true,
      data: defaultAgents,
      message: 'Using default agent list (status.md not accessible)',
    });
  }
});

