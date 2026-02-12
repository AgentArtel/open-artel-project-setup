import { Link } from 'react-router-dom';
import type { Commit } from '@/types';
import { Card } from '../common/Card';
import { GitCommit as GitCommitIcon, User, Calendar } from 'lucide-react';

interface CommitCardProps {
  commit: Commit;
  owner: string;
  repo: string;
}

export function CommitCard({ commit, owner, repo }: CommitCardProps) {
  const date = new Date(commit.author.date);
  const shortSha = commit.sha.substring(0, 7);

  return (
    <Card hover>
      <Link to={`/projects/${owner}/${repo}/commits/${commit.sha}`} className="block" aria-label={`View commit ${shortSha}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <GitCommitIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <code className="text-xs font-mono text-gray-500 dark:text-gray-400">
                {shortSha}
              </code>
              {commit.parsed?.isRoutingHeader && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Routed
                </span>
              )}
            </div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
              {commit.parsed?.description || commit.message}
            </h3>
            {commit.parsed && (
              <div className="flex flex-wrap gap-2 mb-2">
                {commit.parsed.agent && (
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Agent: {commit.parsed.agent}
                  </span>
                )}
                {commit.parsed.action && (
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Action: {commit.parsed.action}
                  </span>
                )}
                {commit.parsed.task && (
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Task: {commit.parsed.task}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {commit.author.name}
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {date.toLocaleDateString()}
              </div>
              {commit.files && commit.files.length > 0 && (
                <span>{commit.files.length} file{commit.files.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

