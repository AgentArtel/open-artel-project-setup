import { Card } from '../common/Card';

interface FileHistoryProps {
  owner: string;
  repo: string;
  filePath: string;
}

export function FileHistory({ owner, repo, filePath }: FileHistoryProps) {
  // Placeholder component - file history can be enhanced later
  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File History</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        File history feature coming soon. This will show commit history for {filePath}
      </p>
    </Card>
  );
}

