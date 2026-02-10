import { Router } from 'express';
import { ApiResponse, Task, TaskLifecycleEvent } from '../types';

export const tasksRouter = Router({ mergeParams: true });

// Placeholder data (replace with GitHub API integration in D1-3)
const tasks: Task[] = [];
const lifecycleEvents: TaskLifecycleEvent[] = [];

// GET /api/projects/:owner/:repo/tasks - List all tasks
tasksRouter.get('/', (req, res) => {
  const owner = req.params.owner as string;
  const repo = req.params.repo as string;
  
  // TODO: Fetch from GitHub API in D1-3
  const response: ApiResponse<Task[]> = {
    success: true,
    data: tasks,
    message: 'Tasks endpoint ready. GitHub integration pending (D1-3).',
  };
  res.json(response);
});

// GET /api/projects/:owner/:repo/tasks/:taskId - Get task details
tasksRouter.get('/:taskId', (req, res) => {
  const { taskId } = req.params;
  
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found',
    });
  }
  
  const response: ApiResponse<Task> = {
    success: true,
    data: task,
  };
  res.json(response);
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

