import { useEffect, useState } from 'react';
import type { Project } from '@/types';
import { api } from '@/lib/api';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { ProjectCard } from './ProjectCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { FolderPlus } from 'lucide-react';

export function ProjectList() {
  const { socket } = useWebSocket();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Project[]>('/api/projects');
      
      if (response.success && response.data) {
        setProjects(response.data);
      } else {
        setError(response.error || 'Failed to load projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Listen for project updates via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleProjectUpdate = () => {
      // Refresh projects when update received
      fetchProjects();
    };

    socket.on('project:updated', handleProjectUpdate);

    return () => {
      socket.off('project:updated', handleProjectUpdate);
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProjects} />;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Get started by adding your first project to monitor"
        icon={<FolderPlus className="h-12 w-12 mx-auto" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

