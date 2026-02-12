import type { Agent } from '@/types';
import { Card } from '../common/Card';
import { AgentStatusIndicator } from './AgentStatusIndicator';
import { User, Briefcase, Database } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {agent.name}
            </h3>
            <div className="mt-2">
              <AgentStatusIndicator status={agent.status} />
            </div>
            {agent.currentTask && (
              <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Briefcase className="h-4 w-4 mr-1" />
                <span className="truncate">{agent.currentTask}</span>
              </div>
            )}
            {agent.contextSize !== undefined && (
              <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Database className="h-3 w-3 mr-1" />
                <span>Context: {Math.round(agent.contextSize / 1024)}KB</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

