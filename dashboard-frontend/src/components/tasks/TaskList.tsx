import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { Task, TaskStatus } from '@/types';
import { api } from '@/lib/api';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { joinProject } from '@/lib/websocket';
import { TaskCard } from './TaskCard';
import { TaskFilters } from './TaskFilters';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { ListTodo } from 'lucide-react';

export function TaskList() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const { socket } = useWebSocket();
  const { showNotification } = useNotifications();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [assignedFilter, setAssignedFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const fetchTasks = async () => {
    if (!owner || !repo) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Task[]>(`/api/projects/${owner}/${repo}/tasks`);
      
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setError(response.error || 'Failed to load tasks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [owner, repo]);

  // Join project room and listen for task updates
  useEffect(() => {
    if (!socket || !owner || !repo) return;

    // Join project room
    joinProject(socket, owner, repo);

    const handleTaskUpdate = (data: { taskId: string; status: string; data: unknown }) => {
      const task = tasks.find(t => t.id === data.taskId);
      if (task) {
        showNotification(`Task "${task.title}" status changed to ${data.status}`, 'info');
      }
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === data.taskId ? { ...task, status: data.status as Task['status'] } : task
        )
      );
    };

    const handleTaskLifecycle = (data: { taskId: string; events: unknown[] }) => {
      // Refresh tasks to get updated lifecycle
      fetchTasks();
    };

    socket.on('task:update', handleTaskUpdate);
    socket.on('task:lifecycle', handleTaskLifecycle);

    return () => {
      socket.off('task:update', handleTaskUpdate);
      socket.off('task:lifecycle', handleTaskLifecycle);
    };
  }, [socket, owner, repo]);

  // Get unique values for filters
  const availableAssignees = useMemo(() => {
    const assignees = tasks.map(t => t.assigned).filter(Boolean) as string[];
    return Array.from(new Set(assignees)).sort();
  }, [tasks]);

  const availableTypes = useMemo(() => {
    const types = tasks.map(t => t.type);
    return Array.from(new Set(types)).sort();
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;
      if (assignedFilter !== 'ALL' && task.assigned !== assignedFilter) return false;
      if (typeFilter !== 'ALL' && task.type !== typeFilter) return false;
      return true;
    });
  }, [tasks, statusFilter, priorityFilter, assignedFilter, typeFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchTasks} />;
  }

  if (!owner || !repo) {
    return <ErrorMessage message="Project owner and repository are required" />;
  }

  return (
    <div>
      <TaskFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        assignedFilter={assignedFilter}
        typeFilter={typeFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onAssignedChange={setAssignedFilter}
        onTypeChange={setTypeFilter}
        availableAssignees={availableAssignees}
        availableTypes={availableTypes}
      />

      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description={tasks.length === 0 ? "This project doesn't have any tasks yet" : "No tasks match the current filters"}
          icon={<ListTodo className="h-12 w-12 mx-auto" />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} owner={owner} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}

