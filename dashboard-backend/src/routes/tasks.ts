import { Router } from 'express';
import { ApiResponse, Task, TaskLifecycleEvent } from '../types';
import { githubService } from '../services/github';

export const tasksRouter = Router({ mergeParams: true });

// Placeholder lifecycle events (can be enhanced with Git history parsing)
const lifecycleEvents: TaskLifecycleEvent[] = [];

// GET /api/projects/:owner/:repo/tasks - List all tasks
tasksRouter.get('/', async (req, res) => {
  const params = req.params as { owner?: string; repo?: string };
  const owner = params.owner || '';
  const repo = params.repo || '';
  
  try {
    const taskBriefs = await githubService.listTasks(owner, repo);
    
    // Convert TaskBrief to Task format
    const tasks: Task[] = taskBriefs.map((brief) => ({
      id: brief.id,
      title: brief.title,
      status: brief.status as Task['status'],
      assigned: brief.assigned || undefined,
      priority: brief.priority,
      type: brief.type,
      dependsOn: brief.dependsOn,
      blocks: brief.blocks,
      objective: brief.objective,
      specifications: brief.specifications,
      acceptanceCriteria: brief.acceptanceCriteria,
      doNot: brief.doNot,
      handoffNotes: brief.handoffNotes,
    }));
    
    const response: ApiResponse<Task[]> = {
      success: true,
      data: tasks,
    };
    res.json(response);
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch tasks',
    });
  }
});

// GET /api/projects/:owner/:repo/tasks/:taskId - Get task details
tasksRouter.get('/:taskId', async (req, res) => {
  const params = req.params as { owner?: string; repo?: string; taskId?: string };
  const owner = params.owner || '';
  const repo = params.repo || '';
  const taskId = params.taskId || '';
  
  try {
    const taskBrief = await githubService.getTask(owner, repo, taskId);
    
    const task: Task = {
      id: taskBrief.id,
      title: taskBrief.title,
      status: taskBrief.status as Task['status'],
      assigned: taskBrief.assigned || undefined,
      priority: taskBrief.priority,
      type: taskBrief.type,
      dependsOn: taskBrief.dependsOn,
      blocks: taskBrief.blocks,
      objective: taskBrief.objective,
      specifications: taskBrief.specifications,
      acceptanceCriteria: taskBrief.acceptanceCriteria,
      doNot: taskBrief.doNot,
      handoffNotes: taskBrief.handoffNotes,
    };
    
    const response: ApiResponse<Task> = {
      success: true,
      data: task,
    };
    res.json(response);
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch task',
    });
  }
});

// GET /api/projects/:owner/:repo/tasks/:taskId/lifecycle - Get task lifecycle
tasksRouter.get('/:taskId/lifecycle', (req, res) => {
  const { taskId } = req.params;
  
  const events = lifecycleEvents.filter(e => e.taskId === taskId);
  
  const response: ApiResponse<TaskLifecycleEvent[]> = {
    success: true,
    data: events,
  };
  res.json(response);
});

