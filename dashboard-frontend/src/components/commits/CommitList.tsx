import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Commit } from '@/types';
import { api } from '@/lib/api';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { joinProject } from '@/lib/websocket';
import { CommitCard } from './CommitCard';
import { CommitFilters } from './CommitFilters';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { GitCommit } from 'lucide-react';

export function CommitList() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const { socket } = useWebSocket();
  const { showNotification } = useNotifications();
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState(50);
  
  // Filters
  const [agentFilter, setAgentFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [taskFilter, setTaskFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('');

  const fetchCommits = async () => {
    if (!owner || !repo) return;

    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string | number> = { limit };
      if (branchFilter) {
        params.branch = branchFilter;
      }
      const response = await api.get<Commit[]>(`/api/projects/${owner}/${repo}/commits`, params);
      
      if (response.success && response.data) {
        setCommits(response.data);
      } else {
        setError(response.error || 'Failed to load commits');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load commits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommits();
  }, [owner, repo, branchFilter]);

  // Join project room and listen for new commits
  useEffect(() => {
    if (!socket || !owner || !repo) return;

    joinProject(socket, owner, repo);

    const handleNewCommit = (data: { sha: string; message: string; author: string }) => {
      showNotification(`New commit: ${data.message.substring(0, 50)}...`, 'success');
      // Refresh commits to include the new one
      fetchCommits();
    };

    socket.on('commit:new', handleNewCommit);

    return () => {
      socket.off('commit:new', handleNewCommit);
    };
  }, [socket, owner, repo]);

  // Get unique values for filters
  const availableAgents = Array.from(new Set(
    commits
      .map(c => c.parsed?.agent)
      .filter(Boolean) as string[]
  )).sort();

  const availableActions = Array.from(new Set(
    commits
      .map(c => c.parsed?.action)
      .filter(Boolean) as string[]
  )).sort();

  const availableTasks = Array.from(new Set(
    commits
      .map(c => c.parsed?.task)
      .filter(Boolean) as string[]
  )).sort();

  // Filter commits
  const filteredCommits = commits.filter(commit => {
    if (agentFilter !== 'ALL' && commit.parsed?.agent !== agentFilter) return false;
    if (actionFilter !== 'ALL' && commit.parsed?.action !== actionFilter) return false;
    if (taskFilter !== 'ALL' && commit.parsed?.task !== taskFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchCommits} />;
  }

  if (!owner || !repo) {
    return <ErrorMessage message="Project owner and repository are required" />;
  }

  return (
    <div>
      <CommitFilters
        agentFilter={agentFilter}
        actionFilter={actionFilter}
        taskFilter={taskFilter}
        branchFilter={branchFilter}
        onAgentChange={setAgentFilter}
        onActionChange={setActionFilter}
        onTaskChange={setTaskFilter}
        onBranchChange={setBranchFilter}
        availableAgents={availableAgents}
        availableActions={availableActions}
        availableTasks={availableTasks}
      />

      {filteredCommits.length === 0 ? (
        <EmptyState
          title="No commits found"
          description={commits.length === 0 ? "This project doesn't have any commits yet" : "No commits match the current filters"}
          icon={<GitCommit className="h-12 w-12 mx-auto" />}
        />
      ) : (
        <div className="space-y-4">
          {filteredCommits.map((commit) => (
            <CommitCard key={commit.sha} commit={commit} owner={owner} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}

