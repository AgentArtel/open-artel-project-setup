import { useEffect, useState } from 'react';
import type { Project } from '@/types';
import { api } from '@/lib/api';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import ReactMarkdown from 'react-markdown';

interface FileViewerProps {
  owner: string;
  repo: string;
  filePath: string;
  ref?: string;
}

export function FileViewer({ owner, repo, filePath, ref }: FileViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = ref ? { ref } : {};
        const response = await api.get<{ path: string; content: string }>(
          `/api/projects/${owner}/${repo}/files/${filePath}`,
          params
        );
        
        if (response.success && response.data) {
          setContent(response.data.content);
        } else {
          setError(response.error || 'Failed to load file');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load file');
      } finally {
        setLoading(false);
      }
    };

    if (filePath) {
      fetchFile();
    }
  }, [owner, repo, filePath, ref]);

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <ErrorMessage message={error} />
      </Card>
    );
  }

  if (!content) {
    return null;
  }

  const isMarkdown = filePath.endsWith('.md') || filePath.endsWith('.mdx');
  const isCode = /\.(ts|tsx|js|jsx|py|java|cpp|c|h|json|yaml|yml|xml|html|css|scss|sql|sh|bash)$/i.test(filePath);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{filePath}</h2>
      </div>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {isMarkdown ? (
          <div className="p-4 prose dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : isCode ? (
          <pre className="p-4 bg-gray-50 dark:bg-gray-900 overflow-x-auto">
            <code className="text-sm text-gray-900 dark:text-gray-100 font-mono">
              {content}
            </code>
          </pre>
        ) : (
          <div className="p-4">
            <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {content}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
}

