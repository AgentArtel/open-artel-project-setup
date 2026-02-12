// ============================================================================
// Task Detail Page - Full Task Information with Markdown Rendering
// ============================================================================

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Circle, 
  XCircle,
  User,
  Flag,
  Link2,
  Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaskDetail } from '@/hooks/useTasks';
import type { TaskStatus } from '@/types';
import { TaskStatusLabels, PriorityColors } from '@/types';
import { cn } from '@/lib/utils';

const statusIcons: Record<TaskStatus, React.ElementType> = {
  PENDING: Circle,
  IN_PROGRESS: Clock,
  REVIEW: AlertCircle,
  DONE: CheckCircle2,
  BLOCKED: XCircle,
};

export function TaskDetail() {
  const { owner, repo, taskId } = useParams<{ 
    owner: string; 
    repo: string; 
    taskId: string 
  }>();
  
  const { task, lifecycleEvents, isLoading, error, fetchLifecycle } = useTaskDetail({
    owner,
    repo,
    taskId,
  });

  // Fetch lifecycle events when task loads
  useEffect(() => {
    if (task) {
      fetchLifecycle();
    }
  }, [task]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p className="font-medium">Error loading task</p>
        <p className="text-sm">{error || 'Task not found'}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          asChild
        >
          <Link to={`/project/${owner}/${repo}/tasks`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
        </Button>
      </div>
    );
  }

  const StatusIcon = statusIcons[task.status];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/project/${owner}/${repo}/tasks`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Link>
      </Button>

      {/* Task Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-mono">{task.id}</span>
          <Badge 
            variant="outline" 
            className={cn(PriorityColors[task.priority])}
          >
            {task.priority}
          </Badge>
          {task.type && (
            <Badge variant="secondary">{task.type}</Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold">{task.title}</h1>
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border",
          TaskStatusLabels[task.status] === 'Done' && "bg-green-500/10 text-green-500 border-green-500/20",
          TaskStatusLabels[task.status] === 'Blocked' && "bg-red-500/10 text-red-500 border-red-500/20",
          TaskStatusLabels[task.status] === 'In Progress' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
          TaskStatusLabels[task.status] === 'Review' && "bg-orange-500/10 text-orange-500 border-orange-500/20",
          TaskStatusLabels[task.status] === 'Pending' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        )}>
          <StatusIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{TaskStatusLabels[task.status]}</span>
        </div>

        {task.assigned && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Assigned to <strong>{task.assigned}</strong></span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Flag className="h-4 w-4" />
          <span>Priority <strong>{task.priority}</strong></span>
        </div>
      </div>

      {/* Dependencies */}
      {(task.dependsOn.length > 0 || task.blocks.length > 0) && (
        <div className="flex flex-wrap gap-4">
          {task.dependsOn.length > 0 && (
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Depends on:</span>
              <div className="flex gap-1">
                {task.dependsOn.map((dep) => (
                  <Badge key={dep} variant="outline" className="text-xs">
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {task.blocks.length > 0 && (
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground rotate-180" />
              <span className="text-sm text-muted-foreground">Blocks:</span>
              <div className="flex gap-1">
                {task.blocks.map((block) => (
                  <Badge key={block} variant="outline" className="text-xs">
                    {block}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Task Content Tabs */}
      <Tabs defaultValue="objective" className="w-full">
        <TabsList>
          <TabsTrigger value="objective">Objective</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="criteria">Acceptance Criteria</TabsTrigger>
          <TabsTrigger value="notes">Handoff Notes</TabsTrigger>
          <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
        </TabsList>

        <TabsContent value="objective" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {task.objective ? (
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {task.objective}
                </pre>
              ) : (
                <p className="text-muted-foreground italic">No objective specified</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {task.specifications ? (
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {task.specifications}
                </pre>
              ) : (
                <p className="text-muted-foreground italic">No specifications provided</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {task.acceptanceCriteria.length > 0 ? (
                <ul className="space-y-2">
                  {task.acceptanceCriteria.map((criterion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic">No acceptance criteria specified</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {task.handoffNotes ? (
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {task.handoffNotes}
                </pre>
              ) : (
                <p className="text-muted-foreground italic">No handoff notes</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Task Lifecycle Events</CardTitle>
            </CardHeader>
            <CardContent>
              {lifecycleEvents.length > 0 ? (
                <div className="space-y-4">
                  {lifecycleEvents.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {index < lifecycleEvents.length - 1 && (
                          <div className="w-px h-full bg-border mt-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium capitalize">{event.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                        {event.agent && (
                          <p className="text-sm">by {event.agent}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No lifecycle events recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Do NOT Section */}
      {task.doNot.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <Ban className="h-5 w-5" />
              Do NOT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {task.doNot.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
