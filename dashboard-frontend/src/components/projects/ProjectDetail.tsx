import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Project } from '@/types';
import { api } from '@/lib/api';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Button } from '../common/Button';
import { Settings, ExternalLink, Trash2 } from 'lucide-react';

export function ProjectDetail() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!owner || !repo) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<Project>(`/api/projects/${owner}/${repo}`);
        
        if (response.success && response.data) {
          setProject(response.data);
        } else {
          setError(response.error || 'Project not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [owner, repo]);

  const handleDelete = async () => {
    if (!owner || !repo || !confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await api.delete<void>(`/api/projects/${owner}/${repo}`);
      
      if (response.success) {
        // Redirect to projects list
        window.location.href = '/projects';
      } else {
        setError(response.error || 'Failed to delete project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !project) {
    return <ErrorMessage message={error} />;
  }

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {project.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{project.fullName}</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link to={`/projects/${owner}/${repo}/settings`}>
            <Button variant="secondary">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </Button>
            </a>
          )}
          <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Project Information
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Owner</dt>
              <dd className="text-sm text-gray-900 dark:text-white">{project.owner}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Repository</dt>
              <dd className="text-sm text-gray-900 dark:text-white">{project.repo}</dd>
            </div>
            {project.isLocal && project.localPath && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Local Path</dt>
                <dd className="text-sm text-gray-900 dark:text-white">{project.localPath}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {project.isLocal ? 'Local' : 'Remote'}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Settings
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Refresh Interval</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {project.settings.refreshInterval} seconds
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Default View</dt>
              <dd className="text-sm text-gray-900 dark:text-white capitalize">
                {project.settings.defaultView}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notifications</dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {project.settings.notifications ? 'Enabled' : 'Disabled'}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to={`/projects/${owner}/${repo}/tasks`}>
          <Card hover className="text-center p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">View all tasks</p>
          </Card>
        </Link>
        <Link to={`/projects/${owner}/${repo}/agents`}>
          <Card hover className="text-center p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Agents</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Agent status</p>
          </Card>
        </Link>
        <Link to={`/projects/${owner}/${repo}/commits`}>
          <Card hover className="text-center p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Commits</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Commit history</p>
          </Card>
        </Link>
        <Link to={`/projects/${owner}/${repo}/files`}>
          <Card hover className="text-center p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Files</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Browse files</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}

