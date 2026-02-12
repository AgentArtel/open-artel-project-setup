import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

interface FileTreeProps {
  nodes: FileNode[];
  onFileSelect: (path: string) => void;
  selectedPath?: string;
}

function FileTreeNode({ node, onFileSelect, selectedPath, level = 0 }: {
  node: FileNode;
  onFileSelect: (path: string) => void;
  selectedPath?: string;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels

  const handleClick = () => {
    if (node.type === 'file') {
      onFileSelect(node.path);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const isSelected = selectedPath === node.path;
  const paddingLeft = level * 16 + 8;

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
          isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleClick}
      >
        {node.type === 'directory' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400 mr-1" />
            )}
            <Folder className="h-4 w-4 text-gray-400 mr-2" />
          </>
        ) : (
          <File className="h-4 w-4 text-gray-400 mr-2 ml-5" />
        )}
        <span className="text-sm text-gray-700 dark:text-gray-300">{node.name}</span>
      </div>
      {node.type === 'directory' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              onFileSelect={onFileSelect}
              selectedPath={selectedPath}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ nodes, onFileSelect, selectedPath }: FileTreeProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-auto max-h-[600px]">
      {nodes.length === 0 ? (
        <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          No files found
        </div>
      ) : (
        <div>
          {nodes.map((node) => (
            <FileTreeNode
              key={node.path}
              node={node}
              onFileSelect={onFileSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

