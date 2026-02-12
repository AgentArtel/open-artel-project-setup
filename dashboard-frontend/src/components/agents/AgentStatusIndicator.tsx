import type { Agent } from '@/types';
import { Circle } from 'lucide-react';

interface AgentStatusIndicatorProps {
  status: Agent['status'];
  size?: 'sm' | 'md' | 'lg';
}

const statusColors = {
  idle: 'text-gray-400 dark:text-gray-500',
  working: 'text-blue-500 dark:text-blue-400',
  blocked: 'text-red-500 dark:text-red-400',
};

const statusLabels = {
  idle: 'Idle',
  working: 'Working',
  blocked: 'Blocked',
};

export function AgentStatusIndicator({ status, size = 'md' }: AgentStatusIndicatorProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  return (
    <div className="flex items-center space-x-2">
      <Circle className={`${sizeClasses[size]} ${statusColors[status]} fill-current`} />
      <span className="text-sm text-gray-700 dark:text-gray-300">{statusLabels[status]}</span>
    </div>
  );
}

