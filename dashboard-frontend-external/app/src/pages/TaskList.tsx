// ============================================================================
// Task List Page - Task List with Filters
// ============================================================================

import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTasks } from '@/hooks/useTasks';
import type { TaskStatus } from '@/types';
import { TaskStatusLabels, PriorityColors } from '@/types';
import { cn } from '@/lib/utils';
import { useUiStyle } from '@/hooks/useUiStyle';

const statusIcons: Record<TaskStatus, React.ElementType> = {
  PENDING: Circle,
  IN_PROGRESS: Clock,
  REVIEW: AlertCircle,
  DONE: CheckCircle2,
  BLOCKED: XCircle,
};

export function TaskList() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const { tasks, isLoading, error } = useTasks({ owner, repo, subscribe: true });
  const { isClawLens } = useUiStyle();
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  // Get unique assignees for filter
  const assignees = useMemo(() => {
    const unique = new Set(tasks.map(t => t.assigned).filter(Boolean));
    return Array.from(unique).sort();
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(query) ||
          task.id.toLowerCase().includes(query) ||
          task.objective.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(task.status)) {
        return false;
      }
      if (selectedPriorities.length > 0 && !selectedPriorities.includes(task.priority)) {
        return false;
      }
      if (selectedAssignees.length > 0) {
        const taskAssignee = task.assigned || 'Unassigned';
        if (!selectedAssignees.includes(taskAssignee)) return false;
      }
      return true;
    });
  }, [tasks, searchQuery, selectedStatuses, selectedPriorities, selectedAssignees]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, typeof tasks> = {
      PENDING: [], IN_PROGRESS: [], REVIEW: [], DONE: [], BLOCKED: [],
    };
    filteredTasks.forEach((task) => { grouped[task.status].push(task); });
    return grouped;
  }, [filteredTasks]);

  const toggleStatus = (status: TaskStatus) => {
    setSelectedStatuses(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
  };
  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev => prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]);
  };
  const toggleAssignee = (assignee: string) => {
    setSelectedAssignees(prev => prev.includes(assignee) ? prev.filter(a => a !== assignee) : [...prev, assignee]);
  };
  const clearFilters = () => {
    setSearchQuery(''); setSelectedStatuses([]); setSelectedPriorities([]); setSelectedAssignees([]);
  };
  const hasFilters = selectedStatuses.length > 0 || selectedPriorities.length > 0 || selectedAssignees.length > 0 || searchQuery;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p className="font-medium">Error loading tasks</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const sw = isClawLens ? 1.5 : 2;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={cn(isClawLens && "border-b border-border pb-4")}>
        <h2 className={cn("text-2xl font-bold tracking-tight", isClawLens && "section-title tracking-wider")}>Tasks</h2>
        {isClawLens && (
          <p className="text-[9px] text-muted-foreground tracking-widest mt-1">タスク // TASKS</p>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={sw} />
          <Input placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" strokeWidth={sw} />
              Filter
              {(selectedStatuses.length + selectedPriorities.length + selectedAssignees.length) > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedStatuses.length + selectedPriorities.length + selectedAssignees.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {(['PENDING', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED'] as TaskStatus[]).map((status) => (
              <DropdownMenuCheckboxItem key={status} checked={selectedStatuses.includes(status)} onCheckedChange={() => toggleStatus(status)}>
                {TaskStatusLabels[status]}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Priority</DropdownMenuLabel>
            {['P0', 'P1', 'P2', 'P3', 'P4'].map((priority) => (
              <DropdownMenuCheckboxItem key={priority} checked={selectedPriorities.includes(priority)} onCheckedChange={() => togglePriority(priority)}>
                {priority}
              </DropdownMenuCheckboxItem>
            ))}
            {assignees.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Assigned To</DropdownMenuLabel>
                {assignees.map((assignee) => (
                  <DropdownMenuCheckboxItem key={assignee} checked={selectedAssignees.includes(assignee!)} onCheckedChange={() => toggleAssignee(assignee!)}>
                    {assignee}
                  </DropdownMenuCheckboxItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>Clear filters</Button>
        )}
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedStatuses.map((status) => (
            <Badge key={status} variant="secondary" className="cursor-pointer" onClick={() => toggleStatus(status)}>
              {TaskStatusLabels[status]} ×
            </Badge>
          ))}
          {selectedPriorities.map((priority) => (
            <Badge key={priority} variant="secondary" className="cursor-pointer" onClick={() => togglePriority(priority)}>
              {priority} ×
            </Badge>
          ))}
          {selectedAssignees.map((assignee) => (
            <Badge key={assignee} variant="secondary" className="cursor-pointer" onClick={() => toggleAssignee(assignee)}>
              {assignee} ×
            </Badge>
          ))}
        </div>
      )}

      {/* Results Count */}
      <p className={cn("text-sm text-muted-foreground", isClawLens && "font-mono")}>
        Showing {filteredTasks.length} of {tasks.length} tasks
      </p>

      {/* Task Columns */}
      <ScrollArea className="h-[calc(100vh-20rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {(['PENDING', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED'] as TaskStatus[]).map((status) => {
            const StatusIcon = statusIcons[status];
            const statusTasks = tasksByStatus[status];
            
            return (
              <div key={status} className="space-y-3">
                {/* Column Header */}
                <div className="flex items-center gap-2 px-2">
                  <StatusIcon className={cn(
                    "h-4 w-4",
                    isClawLens && status === 'IN_PROGRESS' && "text-primary animate-pulse-cyan",
                    !isClawLens && status === 'DONE' && "text-green-500",
                    !isClawLens && status === 'BLOCKED' && "text-red-500",
                    !isClawLens && status === 'IN_PROGRESS' && "text-blue-500",
                    !isClawLens && status === 'REVIEW' && "text-orange-500",
                    !isClawLens && status === 'PENDING' && "text-yellow-500",
                    isClawLens && status !== 'IN_PROGRESS' && "text-muted-foreground"
                  )} strokeWidth={sw} />
                  <span className={cn("font-medium text-sm", isClawLens && "font-mono tracking-wider uppercase text-xs")}>
                    {TaskStatusLabels[status]}
                  </span>
                  <Badge variant="secondary" className={cn("ml-auto", isClawLens && "badge-cyan")}>
                    {statusTasks.length}
                  </Badge>
                </div>

                {/* Task Cards */}
                <div className="space-y-2">
                  {statusTasks.map((task, i) => (
                    <Link key={task.id} to={`/project/${owner}/${repo}/tasks/${task.id}`}>
                      <Card className={cn(
                        "cursor-pointer hover:shadow-md transition-shadow",
                        isClawLens && "hud-card"
                      )} style={isClawLens ? { animationDelay: `${i * 50}ms` } : undefined}>
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className={cn(
                              "text-xs text-muted-foreground font-mono",
                              isClawLens && "text-primary cyan-glow"
                            )}>
                              {task.id}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                isClawLens
                                  ? (task.priority === 'P0' || task.priority === 'P1') ? "badge-vermillion" : "badge-cyan"
                                  : PriorityColors[task.priority]
                              )}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium line-clamp-2">{task.title}</p>
                          {task.assigned && (
                            <div className="flex items-center gap-1">
                              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                                {task.assigned.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-xs text-muted-foreground">{task.assigned}</span>
                            </div>
                          )}
                          {(task.dependsOn.length > 0 || task.blocks.length > 0) && (
                            <div className="flex gap-2 text-xs text-muted-foreground">
                              {task.dependsOn.length > 0 && <span>↓ {task.dependsOn.length}</span>}
                              {task.blocks.length > 0 && <span>↑ {task.blocks.length}</span>}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
