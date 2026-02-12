import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Agent } from '@/types';
import { api } from '@/lib/api';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { joinProject } from '@/lib/websocket';
import { AgentCard } from './AgentCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { Users } from 'lucide-react';

export function AgentDashboard() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const { socket } = useWebSocket();
  const { showNotification } = useNotifications();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    if (!owner || !repo) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Agent[]>(`/api/projects/${owner}/${repo}/agents`);
      
      if (response.success && response.data) {
        setAgents(response.data);
      } else {
        setError(response.error || 'Failed to load agents');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [owner, repo]);

  // Join project room and listen for agent status updates
  useEffect(() => {
    if (!socket || !owner || !repo) return;

    joinProject(socket, owner, repo);

    const handleAgentStatus = (data: { agent: string; status: string; task?: string }) => {
      showNotification(`Agent ${data.agent} status: ${data.status}`, 'info');
      setAgents(prevAgents =>
        prevAgents.map(agent =>
          agent.name === data.agent
            ? { ...agent, status: data.status as Agent['status'], currentTask: data.task }
            : agent
        )
      );
    };

    socket.on('agent:status', handleAgentStatus);

    return () => {
      socket.off('agent:status', handleAgentStatus);
    };
  }, [socket, owner, repo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAgents} />;
  }

  if (!owner || !repo) {
    return <ErrorMessage message="Project owner and repository are required" />;
  }

  if (agents.length === 0) {
    return (
      <EmptyState
        title="No agents found"
        description="No agents are currently active for this project"
        icon={<Users className="h-12 w-12 mx-auto" />}
      />
    );
  }

  // Group agents by status
  const agentsByStatus = {
    working: agents.filter(a => a.status === 'working'),
    idle: agents.filter(a => a.status === 'idle'),
    blocked: agents.filter(a => a.status === 'blocked'),
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {agentsByStatus.working.length}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Working</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {agentsByStatus.idle.length}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Idle</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {agentsByStatus.blocked.length}
          </div>
          <div className="text-sm text-red-700 dark:text-red-300">Blocked</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>
    </div>
  );
}

