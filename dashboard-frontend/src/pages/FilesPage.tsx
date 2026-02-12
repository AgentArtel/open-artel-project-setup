import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileTree } from '../components/files/FileTree';
import { FileViewer } from '../components/files/FileViewer';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { Folder } from 'lucide-react';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export function FilesPage() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [fileTree, setFileTree] = useState<FileNode[]>([]);

  // For now, we'll use a simple placeholder file tree
  // In a real implementation, this would fetch from the API
  useEffect(() => {
    // Placeholder: Create a simple tree structure
    // In production, this would come from an API endpoint
    const placeholderTree: FileNode[] = [
      {
        name: '.ai',
        path: '.ai',
        type: 'directory',
        children: [
          { name: 'status.md', path: '.ai/status.md', type: 'file' },
          { name: 'tasks', path: '.ai/tasks', type: 'directory' },
        ],
      },
      {
        name: 'src',
        path: 'src',
        type: 'directory',
        children: [
          { name: 'index.ts', path: 'src/index.ts', type: 'file' },
        ],
      },
    ];
    setFileTree(placeholderTree);
  }, [owner, repo]);

  if (!owner || !repo) {
    return (
      <Layout showSidebar>
        <EmptyState
          title="Project required"
          description="Please select a project to browse files"
          icon={<Folder className="h-12 w-12 mx-auto" />}
        />
      </Layout>
    );
  }

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Files</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Tree</h2>
            <FileTree
              nodes={fileTree}
              onFileSelect={setSelectedPath}
              selectedPath={selectedPath}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Content</h2>
            {selectedPath ? (
              <FileViewer owner={owner} repo={repo} filePath={selectedPath} />
            ) : (
              <Card>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  Select a file from the tree to view its content
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

