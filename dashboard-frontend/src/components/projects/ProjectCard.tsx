import { Link } from 'react-router-dom';
import type { Project } from '@/types';
import { Card } from '../common/Card';
import { Folder, Settings } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card hover className="h-full">
      <Link to={`/projects/${project.owner}/${project.repo}`} className="block" aria-label={`View project ${project.name}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Folder className="h-6 w-6 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {project.fullName}
              </p>
              {project.isLocal && project.localPath && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  📁 {project.localPath}
                </p>
              )}
            </div>
          </div>
          <Link
            to={`/projects/${project.owner}/${project.repo}/settings`}
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Project settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Refresh: {project.settings.refreshInterval}s</span>
          <span className={project.settings.notifications ? 'text-green-600' : 'text-gray-400'}>
            {project.settings.notifications ? '🔔' : '🔕'}
          </span>
        </div>
      </Link>
    </Card>
  );
}

