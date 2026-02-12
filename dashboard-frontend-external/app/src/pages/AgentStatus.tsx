// ============================================================================
// Agent Status Page - Agent Dashboard
// ============================================================================

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Bot, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAgentStore } from '@/stores/agentStore';
import type { AgentStatus as AgentStatusType, Agent } from '@/types';
import { AgentStatusColors, AgentStatusLabels, DefaultAgents } from '@/types';
import { cn } from '@/lib/utils';

const statusIcons: Record<AgentStatusType, React.ElementType> = {
  idle: CheckCircle2,
  working: Clock,
  blocked: AlertCircle,
};

export function AgentStatus() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const { agents, isLoading, error, fetchAgents, subscribeToUpdates } = useAgentStore();

  // Fetch agents and subscribe to updates
  useEffect(() => {
    if (owner && repo) {
      fetchAgents(owner, repo);
      subscribeToUpdates();
    }
  }, [owner, repo]);

  // Ensure all default agents are shown
  const displayAgents: Agent[] = DefaultAgents.map((name) => {
    const existing = agents.find((a: Agent) => a.name.toLowerCase() === name.toLowerCase());
    return existing || { name, status: 'idle' as AgentStatusType };
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p className="font-medium">Error loading agents</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Agent Status</h2>
        <p className="text-muted-foreground">
          Monitor agent activity and current tasks
        </p>
      </div>

      {/* Agent Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {displayAgents.map((agent) => {
          const StatusIcon = statusIcons[agent.status];
          
          return (
            <Card key={agent.name} className={cn(
              "transition-all",
              agent.status === 'working' && "ring-2 ring-blue-500/20"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      agent.status === 'idle' && "bg-gray-500/10",
                      agent.status === 'working' && "bg-blue-500/10",
                      agent.status === 'blocked' && "bg-red-500/10"
                    )}>
                      <Bot className={cn(
                        "h-5 w-5",
                        agent.status === 'idle' && "text-gray-500",
                        agent.status === 'working' && "text-blue-500",
                        agent.status === 'blocked' && "text-red-500"
                      )} />
                    </div>
                    <div>
                      <CardTitle className="text-lg capitalize">
                        {agent.name}
                      </CardTitle>
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className={cn(
                          "h-3.5 w-3.5",
                          agent.status === 'idle' && "text-gray-500",
                          agent.status === 'working' && "text-blue-500",
                          agent.status === 'blocked' && "text-red-500"
                        )} />
                        <span className={cn(
                          "text-sm font-medium",
                          agent.status === 'idle' && "text-gray-500",
                          agent.status === 'working' && "text-blue-500",
                          agent.status === 'blocked' && "text-red-500"
                        )}>
                          {AgentStatusLabels[agent.status]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(AgentStatusColors[agent.status])}
                  >
                    {agent.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {agent.currentTask ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Current Task</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-between"
                      asChild
                    >
                      <Link to={`/project/${owner}/${repo}/tasks/${agent.currentTask}`}>
                        <span className="truncate">{agent.currentTask}</span>
                        <ExternalLink className="h-3.5 w-3.5 ml-2 shrink-0" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-12 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">No active task</p>
                  </div>
                )}
                
                {agent.contextSize !== undefined && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Context Size</span>
                      <span className="font-mono">{agent.contextSize.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-500/10">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {displayAgents.filter(a => a.status === 'working').length}
                </p>
                <p className="text-sm text-muted-foreground">Working</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-500/10">
              <CheckCircle2 className="h-8 w-8 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">
                  {displayAgents.filter(a => a.status === 'idle').length}
                </p>
                <p className="text-sm text-muted-foreground">Idle</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-lg bg-red-500/10">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">
                  {displayAgents.filter(a => a.status === 'blocked').length}
                </p>
                <p className="text-sm text-muted-foreground">Blocked</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
