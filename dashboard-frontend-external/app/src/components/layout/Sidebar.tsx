// ============================================================================
// Sidebar - Project Navigation
// ============================================================================

import { Link, useParams, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  Bot, 
  GitCommit, 
  FolderOpen,
  ChevronRight,
  Settings,
  Cog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProject } from '@/hooks/useProject';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  active: boolean;
}

export function Sidebar() {
  const { owner, repo } = useParams<{ owner?: string; repo?: string }>();
  const location = useLocation();
  const { projects, isLoading } = useProject();

  // Project-specific navigation items
  const projectNavItems: NavItem[] = owner && repo ? [
    {
      label: 'Tasks',
      icon: ListTodo,
      href: `/project/${owner}/${repo}/tasks`,
      active: location.pathname.includes('/tasks'),
    },
    {
      label: 'Agents',
      icon: Bot,
      href: `/project/${owner}/${repo}/agents`,
      active: location.pathname.includes('/agents'),
    },
    {
      label: 'Commits',
      icon: GitCommit,
      href: `/project/${owner}/${repo}/commits`,
      active: location.pathname.includes('/commits'),
    },
    {
      label: 'Files',
      icon: FolderOpen,
      href: `/project/${owner}/${repo}/files`,
      active: location.pathname.includes('/files'),
    },
  ] : [];

  const isSettingsActive = location.pathname === '/settings';

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r bg-background z-40">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Dashboard Link */}
          <div>
            <Link
              to="/"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === '/' 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </div>

          {/* Project Navigation */}
          {owner && repo && (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {owner}/{repo}
              </div>
              {projectNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Projects List */}
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Projects
            </div>
            
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-3 py-2">
                  <Skeleton className="h-5 w-full" />
                </div>
              ))
            ) : projects.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No projects yet
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.owner}/${project.repo}/tasks`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    owner === project.owner && repo === project.repo
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <ChevronRight className="h-3 w-3 opacity-50" />
                  <span className="truncate">{project.name}</span>
                </Link>
              ))
            )}
          </div>

          {/* Settings Link */}
          <div className="pt-4 border-t">
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isSettingsActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
