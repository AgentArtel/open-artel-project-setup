import { useEffect, useState } from 'react';
import type { TaskLifecycleEvent } from '@/types';
import { api } from '@/lib/api';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { CheckCircle2, User, Play, Send, Eye, ThumbsUp, GitMerge, Circle } from 'lucide-react';

interface TaskLifecycleTimelineProps {
  owner: string;
  repo: string;
  taskId: string;
}

const eventIcons = {
  created: Circle,
  assigned: User,
  started: Play,
  submitted: Send,
  reviewed: Eye,
  approved: ThumbsUp,
  merged: GitMerge,
  done: CheckCircle2,
};

export function TaskLifecycleTimeline({ owner, repo, taskId }: TaskLifecycleTimelineProps) {
  const [events, setEvents] = useState<TaskLifecycleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLifecycle = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<TaskLifecycleEvent[]>(
          `/api/projects/${owner}/${repo}/tasks/${taskId}/lifecycle`
        );
        
        if (response.success && response.data) {
          setEvents(response.data);
        } else {
          setError(response.error || 'Failed to load lifecycle events');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lifecycle events');
      } finally {
        setLoading(false);
      }
    };

    fetchLifecycle();
  }, [owner, repo, taskId]);

  if (loading) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lifecycle Timeline</h2>
        <div className="flex justify-center py-4">
          <LoadingSpinner size="sm" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lifecycle Timeline</h2>
        <ErrorMessage message={error} />
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lifecycle Timeline</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">No lifecycle events yet</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lifecycle Timeline</h2>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
        <ul className="space-y-4">
          {events.map((event, index) => {
            const Icon = eventIcons[event.type] || Circle;
            const date = new Date(event.timestamp);
            
            return (
              <li key={event.id} className="relative pl-12">
                <div className="absolute left-0 top-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {event.type}
                    </span>
                    {event.agent && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        by {event.agent}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {date.toLocaleString()}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}

