import { useState } from 'react';
import type { Project, ProjectSettings } from '@/types';
import { api } from '@/lib/api';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ErrorMessage } from '../common/ErrorMessage';

interface AddProjectFormProps {
  onSuccess?: (project: Project) => void;
  onCancel?: () => void;
}

export function AddProjectForm({ onSuccess, onCancel }: AddProjectFormProps) {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [url, setUrl] = useState('');
  const [isLocal, setIsLocal] = useState(false);
  const [localPath, setLocalPath] = useState('');
  const [settings, setSettings] = useState<ProjectSettings>({
    refreshInterval: 30,
    defaultView: 'dashboard',
    notifications: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!owner || !repo) {
      setError('Owner and repository are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.post<Project>('/api/projects', {
        owner,
        repo,
        url: url || undefined,
        isLocal,
        localPath: localPath || undefined,
        settings,
      });

      if (response.success && response.data) {
        onSuccess?.(response.data);
        // Reset form
        setOwner('');
        setRepo('');
        setUrl('');
        setIsLocal(false);
        setLocalPath('');
        setSettings({
          refreshInterval: 30,
          defaultView: 'dashboard',
          notifications: true,
        });
      } else {
        setError(response.error || 'Failed to add project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Add New Project
      </h2>
      
      {error && <ErrorMessage message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Add new project form">
        <div>
          <label htmlFor="owner" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Owner/Organization
          </label>
          <input
            id="owner"
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="e.g., myorg"
          />
        </div>

        <div>
          <label htmlFor="repo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Repository
          </label>
          <input
            id="repo"
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="e.g., myrepo"
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            URL (optional)
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/owner/repo"
          />
        </div>

        <div className="flex items-center">
          <input
            id="isLocal"
            type="checkbox"
            checked={isLocal}
            onChange={(e) => setIsLocal(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isLocal" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Local project
          </label>
        </div>

        {isLocal && (
          <div>
            <label htmlFor="localPath" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Local Path
            </label>
            <input
              id="localPath"
              type="text"
              value={localPath}
              onChange={(e) => setLocalPath(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/path/to/project"
            />
          </div>
        )}

        <div>
          <label htmlFor="refreshInterval" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Refresh Interval (seconds)
          </label>
          <input
            id="refreshInterval"
            type="number"
            min="10"
            value={settings.refreshInterval}
            onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) || 30 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            id="notifications"
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Enable notifications
          </label>
        </div>

        <div className="flex space-x-3">
          <Button type="submit" isLoading={loading}>
            Add Project
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

