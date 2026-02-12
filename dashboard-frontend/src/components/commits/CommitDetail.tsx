import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Commit } from '@/types';
import { api } from '@/lib/api';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { GitCommit, User, Calendar, ExternalLink, FileText } from 'lucide-react';

export function CommitDetail() {
  const { owner, repo, sha } = useParams<{ owner: string; repo: string; sha: string }>();
  const [commit, setCommit] = useState<Commit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!owner || !repo || !sha) return;

    const fetchCommit = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<Commit>(`/api/projects/${owner}/${repo}/commits/${sha}`);
        
        if (response.success && response.data) {
          setCommit(response.data);
        } else {
          setError(response.error || 'Commit not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load commit');
      } finally {
        setLoading(false);
      }
    };

    fetchCommit();
  }, [owner, repo, sha]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !commit) {
    return <ErrorMessage message={error} />;
  }

  if (!commit || !owner || !repo) {
    return null;
  }

  const date = new Date(commit.author.date);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {commit.parsed?.description || commit.message}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <code className="font-mono">{commit.sha.substring(0, 7)}</code>
            {commit.url && (
              <a
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View on GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Commit Message</h2>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded">
                {commit.message}
              </pre>
            </div>
          </Card>

          {commit.parsed && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Parsed Routing</h2>
              <dl className="space-y-3">
                {commit.parsed.agent && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Agent</dt>
                    <dd className="text-sm text-gray-900 dark:text-white mt-1">{commit.parsed.agent}</dd>
                  </div>
                )}
                {commit.parsed.action && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Action</dt>
                    <dd className="text-sm text-gray-900 dark:text-white mt-1">{commit.parsed.action}</dd>
                  </div>
                )}
                {commit.parsed.task && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Task</dt>
                    <dd className="text-sm text-gray-900 dark:text-white mt-1">{commit.parsed.task}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Raw Header</dt>
                  <dd className="text-sm text-gray-900 dark:text-white mt-1 font-mono">
                    {commit.parsed.raw}
                  </dd>
                </div>
              </dl>
            </Card>
          )}

          {commit.files && commit.files.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Files Changed ({commit.files.length})
              </h2>
              <ul className="space-y-2">
                {commit.files.map((file, index) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                    {file}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commit Information</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Author
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1">
                  {commit.author.name}
                </dd>
                <dd className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {commit.author.email}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Date
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1">
                  {date.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <GitCommit className="h-4 w-4 mr-1" />
                  SHA
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1 font-mono">
                  {commit.sha}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}

