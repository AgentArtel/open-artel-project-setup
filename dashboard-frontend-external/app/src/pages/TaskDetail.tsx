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
import { Markdown } from '@/components/ui/markdown';
import { useUiStyle } from '@/hooks/useUiStyle';

const statusIcons: Record<TaskStatus, React.ElementType> = {
  PENDING: Circle,
  IN_PROGRESS: Clock,
  REVIEW: AlertCircle,
  DONE: CheckCircle2,
  BLOCKED: XCircle,
};

export function TaskDetail() {
  const { owner, repo, taskId } = useParams<{ owner: string; repo: string; taskId: string }>();
  const { task, lifecycleEvents, isLoading, error, fetchLifecycle } = useTaskDetail({ owner, repo, taskId });
  const { isClawLens } = useUiStyle();
  const sw = isClawLens ? 1.5 : 2;

  useEffect(() => { if (task) fetchLifecycle(); }, [task]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" />
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
        <Button variant="outline" className="mt-4" asChild>
          <Link to={`/project/${owner}/${repo}/tasks`}>
            <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={sw} />Back to Tasks
          </Link>
        </Button>
      </div>
    );
  }

  const StatusIcon = statusIcons[task.status];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/project/${owner}/${repo}/tasks`}>
          <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={sw} />Back to Tasks
        </Link>
      </Button>

      {/* Task Header */}
      <div className={cn("space-y-2", isClawLens && "border-b border-border pb-4")}>
        <div className="flex items-center gap-2">
          <span className={cn("text-sm text-muted-foreground font-mono", isClawLens && "text-primary cyan-glow")}>{task.id}</span>
          <Badge variant="outline" className={cn(
            isClawLens
              ? (task.priority === 'P0' || task.priority === 'P1') ? "badge-vermillion" : "badge-cyan"
              : PriorityColors[task.priority]
          )}>
            {task.priority}
          </Badge>
          {task.type && <Badge variant="secondary">{task.type}</Badge>}
        </div>
        <h1 className={cn("text-2xl font-bold", isClawLens && "tracking-wider")}>{task.title}</h1>
        {isClawLens && <p className="text-[9px] text-muted-foreground tracking-widest">タスク詳細 // TASK DETAIL</p>}
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border",
          isClawLens ? "badge-cyan" : (
            TaskStatusLabels[task.status] === 'Done' ? "bg-green-500/10 text-green-500 border-green-500/20" :
            TaskStatusLabels[task.status] === 'Blocked' ? "bg-red-500/10 text-red-500 border-red-500/20" :
            TaskStatusLabels[task.status] === 'In Progress' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
            TaskStatusLabels[task.status] === 'Review' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
            "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
          )
        )}>
          <StatusIcon className="h-4 w-4" strokeWidth={sw} />
          <span className="text-sm font-medium">{TaskStatusLabels[task.status]}</span>
        </div>
        {task.assigned && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" strokeWidth={sw} />
            <span>Assigned to <strong>{task.assigned}</strong></span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Flag className="h-4 w-4" strokeWidth={sw} />
          <span>Priority <strong>{task.priority}</strong></span>
        </div>
      </div>

      {/* Dependencies */}
      {(task.dependsOn.length > 0 || task.blocks.length > 0) && (
        <div className="flex flex-wrap gap-4">
          {task.dependsOn.length > 0 && (
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" strokeWidth={sw} />
              <span className="text-sm text-muted-foreground">Depends on:</span>
              <div className="flex gap-1">
                {task.dependsOn.map((dep) => (
                  <Badge key={dep} variant="outline" className={cn("text-xs", isClawLens && "font-mono cyan-glow")}>{dep}</Badge>
                ))}
              </div>
            </div>
          )}
          {task.blocks.length > 0 && (
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground rotate-180" strokeWidth={sw} />
              <span className="text-sm text-muted-foreground">Blocks:</span>
              <div className="flex gap-1">
                {task.blocks.map((block) => (
                  <Badge key={block} variant="outline" className={cn("text-xs", isClawLens && "font-mono cyan-glow")}>{block}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Task Content Tabs */}
      <Tabs defaultValue="objective" className="w-full">
        <TabsList className={cn(isClawLens && "[&_[data-state=active]]:bg-primary [&_[data-state=active]]:text-primary-foreground")}>
          <TabsTrigger value="objective">Objective</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="criteria">Acceptance Criteria</TabsTrigger>
          <TabsTrigger value="notes">Handoff Notes</TabsTrigger>
          <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
        </TabsList>

        <TabsContent value="objective" className="mt-4">
          <Card className={cn(isClawLens && "hud-card")}>
            <CardContent className="pt-6">
              {task.objective ? <Markdown content={task.objective} /> : <p className="text-muted-foreground italic">No objective specified</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-4">
          <Card className={cn(isClawLens && "hud-card")}>
            <CardContent className="pt-6">
              {task.specifications ? <Markdown content={task.specifications} /> : <p className="text-muted-foreground italic">No specifications provided</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="mt-4">
          <Card className={cn(isClawLens && "hud-card")}>
            <CardContent className="pt-6">
              {task.acceptanceCriteria.length > 0 ? (
                <ul className="space-y-2">
                  {task.acceptanceCriteria.map((criterion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className={cn("h-5 w-5 mt-0.5 shrink-0", isClawLens ? "text-primary" : "text-green-500")} strokeWidth={sw} />
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-muted-foreground italic">No acceptance criteria specified</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card className={cn(isClawLens && "hud-card")}>
            <CardContent className="pt-6">
              {task.handoffNotes ? <Markdown content={task.handoffNotes} /> : <p className="text-muted-foreground italic">No handoff notes</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-4">
          <Card className={cn(isClawLens && "hud-card")}>
            <CardHeader>
              <CardTitle className={cn("text-lg", isClawLens && "font-mono tracking-wider")}>Task Lifecycle Events</CardTitle>
            </CardHeader>
            <CardContent>
              {lifecycleEvents.length > 0 ? (
                <div className="space-y-4">
                  {lifecycleEvents.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          isClawLens ? "bg-primary cyan-border-glow" : "bg-primary"
                        )} />
                        {index < lifecycleEvents.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium capitalize">{event.type}</p>
                        <p className={cn("text-sm text-muted-foreground", isClawLens && "font-mono")}>
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                        {event.agent && <p className="text-sm">by {event.agent}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-muted-foreground italic">No lifecycle events recorded</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Do NOT Section */}
      {task.doNot.length > 0 && (
        <Card className={cn("border-destructive/50", isClawLens && "hud-card border-destructive/50")}>
          <CardHeader>
            <CardTitle className={cn("text-lg flex items-center gap-2 text-destructive", isClawLens && "badge-vermillion bg-transparent border-none")}>
              <Ban className="h-5 w-5" strokeWidth={sw} />
              Do NOT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {task.doNot.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" strokeWidth={sw} />
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
