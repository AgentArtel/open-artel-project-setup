import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Task } from '@/types';
import { api } from '@/lib/api';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { joinProject } from '@/lib/websocket';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import ReactMarkdown from 'react-markdown';
import { TaskLifecycleTimeline } from './TaskLifecycleTimeline';

export function TaskDetail() {
  const { owner, repo, taskId } = useParams<{ owner: string; repo: string; taskId: string }>();
  const { socket } = useWebSocket();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!owner || !repo || !taskId) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<Task>(`/api/projects/${owner}/${repo}/tasks/${taskId}`);
        
        if (response.success && response.data) {
          setTask(response.data);
        } else {
          setError(response.error || 'Task not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [owner, repo, taskId]);

  // Join project room and listen for task updates
  useEffect(() => {
    if (!socket || !owner || !repo) return;

    joinProject(socket, owner, repo);

    const handleTaskUpdate = (data: { taskId: string; status: string; data: unknown }) => {
      if (data.taskId === taskId) {
        setTask(prevTask => prevTask ? { ...prevTask, status: data.status as Task['status'] } : null);
      }
    };

    const handleTaskLifecycle = (data: { taskId: string; events: unknown[] }) => {
      if (data.taskId === taskId) {
        // Refresh task to get updated lifecycle
        if (owner && repo && taskId) {
          const fetchTask = async () => {
            const response = await api.get<Task>(`/api/projects/${owner}/${repo}/tasks/${taskId}`);
            if (response.success && response.data) {
              setTask(response.data);
            }
          };
          fetchTask();
        }
      }
    };

    socket.on('task:update', handleTaskUpdate);
    socket.on('task:lifecycle', handleTaskLifecycle);

    return () => {
      socket.off('task:update', handleTaskUpdate);
      socket.off('task:lifecycle', handleTaskLifecycle);
    };
  }, [socket, owner, repo, taskId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !task) {
    return <ErrorMessage message={error} />;
  }

  if (!task || !owner || !repo) {
    return null;
  }

  const statusColors = {
    PENDING: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    REVIEW: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    DONE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    BLOCKED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
          <div className="flex items-center space-x-3 mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
              {task.status}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Priority: {task.priority}</span>
            {task.assigned && (
              <span className="text-sm text-gray-500 dark:text-gray-400">Assigned to: {task.assigned}</span>
            )}
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Objective</h2>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{task.objective}</ReactMarkdown>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Specifications</h2>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{task.specifications}</ReactMarkdown>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Acceptance Criteria</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {task.acceptanceCriteria.map((criterion, index) => (
                <li key={index}>{criterion}</li>
              ))}
            </ul>
          </Card>

          {task.doNot.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Do Not</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {task.doNot.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Card>
          )}

          {task.handoffNotes && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Handoff Notes</h2>
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{task.handoffNotes}</ReactMarkdown>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Information</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1">{task.status}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1">{task.priority}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1">{task.type}</dd>
              </div>
              {task.assigned && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</dt>
                  <dd className="text-sm text-gray-900 dark:text-white mt-1">{task.assigned}</dd>
                </div>
              )}
            </dl>
          </Card>

          {task.dependsOn.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Depends On</h2>
              <ul className="space-y-1">
                {task.dependsOn.map((depId) => (
                  <li key={depId} className="text-sm text-gray-700 dark:text-gray-300">
                    {depId}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {task.blocks.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Blocks</h2>
              <ul className="space-y-1">
                {task.blocks.map((blockId) => (
                  <li key={blockId} className="text-sm text-gray-700 dark:text-gray-300">
                    {blockId}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <TaskLifecycleTimeline owner={owner} repo={repo} taskId={task.id} />
        </div>
      </div>
    </div>
  );
}

