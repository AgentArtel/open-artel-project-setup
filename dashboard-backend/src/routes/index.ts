import { Express } from 'express';
import { projectsRouter } from './projects';
import { reposRouter } from './repos';
import { tasksRouter } from './tasks';
import { agentsRouter } from './agents';
import { commitsRouter } from './commits';
import { filesRouter } from './files';
import { reviewsRouter } from './reviews';
import { reportsRouter } from './reports';
import { kimiRouter } from './kimi';

export function setupRoutes(app: Express): void {
  app.use('/api/projects', projectsRouter);
  app.use('/api/repos', reposRouter);
  app.use('/api/projects/:owner/:repo/tasks', tasksRouter);
  app.use('/api/projects/:owner/:repo/agents', agentsRouter);
  app.use('/api/projects/:owner/:repo/commits', commitsRouter);
  app.use('/api/projects/:owner/:repo/files', filesRouter);
  app.use('/api/projects/:owner/:repo/reviews', reviewsRouter);
  app.use('/api/projects/:owner/:repo/reports', reportsRouter);
  app.use('/api/kimi', kimiRouter);
}

