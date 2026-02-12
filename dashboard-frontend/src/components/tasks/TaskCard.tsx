import { Link } from 'react-router-dom';
import type { Task } from '@/types';
import { Card } from '../common/Card';
import { CheckCircle2, Clock, AlertCircle, XCircle, Ban } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  owner: string;
  repo: string;
}

const statusConfig = {
  PENDING: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', icon: Clock },
  IN_PROGRESS: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Clock },
  REVIEW: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: AlertCircle },
  DONE: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle2 },
  BLOCKED: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: Ban },
};

const priorityColors = {
  P0: 'text-red-600 dark:text-red-400',
  P1: 'text-red-600 dark:text-red-400',
  P2: 'text-orange-600 dark:text-orange-400',
  P3: 'text-yellow-600 dark:text-yellow-400',
};

export function TaskCard({ task, owner, repo }: TaskCardProps) {
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;
  const priorityClass = priorityColors[task.priority as keyof typeof priorityColors] || 'text-gray-600';

  return (
    <Card hover>
      <Link to={`/projects/${owner}/${repo}/tasks/${task.id}`} className="block" aria-label={`View task ${task.title}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {task.status}
              </span>
              <span className={`text-xs font-semibold ${priorityClass}`}>
                {task.priority}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {task.title}
            </h3>
            {task.assigned && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Assigned to: {task.assigned}
              </p>
            )}
            {task.objective && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                {task.objective}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Type: {task.type}</span>
          {task.dependsOn.length > 0 && (
            <span>Depends on {task.dependsOn.length}</span>
          )}
        </div>
      </Link>
    </Card>
  );
}

