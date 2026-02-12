import { useState, useEffect } from 'react';
import type { Project, ProjectSettings } from '@/types';
import { api } from '@/lib/api';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ErrorMessage } from '../common/ErrorMessage';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ProjectSettingsProps {
  owner: string;
  repo: string;
  onUpdate?: (settings: ProjectSettings) => void;
}

export function ProjectSettingsComponent({ owner, repo, onUpdate }: ProjectSettingsProps) {
  const [settings, setSettings] = useState<ProjectSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<Project>(`/api/projects/${owner}/${repo}`);
        
        if (response.success && response.data) {
          setSettings(response.data.settings);
        } else {
          setError(response.error || 'Failed to load project settings');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project settings');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [owner, repo]);

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      
      // Note: Backend doesn't have PUT endpoint yet, this is prepared for when it's added
      // For now, we'll just update local state
      onUpdate?.(settings);
      
      // TODO: Call PUT /api/projects/:owner/:repo when backend supports it
      // const response = await api.put<Project>(`/api/projects/${owner}/${repo}`, { settings });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !settings) {
    return <ErrorMessage message={error} />;
  }

  if (!settings) {
    return null;
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Project Settings
      </h2>
      
      {error && <ErrorMessage message={error} className="mb-4" />}

      <div className="space-y-4">
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

        <div>
          <label htmlFor="defaultView" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Default View
          </label>
          <select
            id="defaultView"
            value={settings.defaultView}
            onChange={(e) => setSettings({ ...settings, defaultView: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="dashboard">Dashboard</option>
            <option value="tasks">Tasks</option>
            <option value="commits">Commits</option>
          </select>
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

        <div className="pt-4">
          <Button onClick={handleSave} isLoading={saving}>
            Save Settings
          </Button>
        </div>
      </div>
    </Card>
  );
}

