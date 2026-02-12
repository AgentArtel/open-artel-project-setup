// ============================================================================
// Project Detail Page - Layout with Tabs Navigation
// ============================================================================

import { useEffect } from 'react';
import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import { 
  ListTodo, 
  Bot, 
  GitCommit, 
  FolderOpen,
  MessageSquare,
  FileText,
  Loader2,
  ExternalLink,
  Github
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProject } from '@/hooks/useProject';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectSettingsDialog } from '@/components/projects/ProjectSettingsDialog';

interface TabItem {
  value: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

export function ProjectDetail() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const location = useLocation();
  const { currentProject, fetchProject, isLoading, error } = useProject();

  // Fetch project details on mount
  useEffect(() => {
    if (owner && repo) {
      fetchProject(owner, repo);
    }
  }, [owner, repo]);

  const tabs: TabItem[] = owner && repo ? [
    { value: 'tasks', label: 'Tasks', icon: ListTodo, href: `/project/${owner}/${repo}/tasks` },
    { value: 'agents', label: 'Agents', icon: Bot, href: `/project/${owner}/${repo}/agents` },
    { value: 'commits', label: 'Commits', icon: GitCommit, href: `/project/${owner}/${repo}/commits` },
    { value: 'files', label: 'Files', icon: FolderOpen, href: `/project/${owner}/${repo}/files` },
    { value: 'reviews', label: 'Reviews', icon: MessageSquare, href: `/project/${owner}/${repo}/reviews` },
    { value: 'reports', label: 'Reports', icon: FileText, href: `/project/${owner}/${repo}/reports` },
  ] : [];

  // Determine active tab from pathname
  const activeTab = tabs.find(tab => location.pathname.includes(tab.value))?.value || 'tasks';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {currentProject?.name || repo}
            </h1>
            {currentProject?.isLocal ? (
              <Badge variant="secondary">Local</Badge>
            ) : (
              <Badge variant="secondary">GitHub</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Github className="h-4 w-4" />
            <span>{owner}/{repo}</span>
            {currentProject?.url && (
              <Button variant="ghost" size="sm" className="h-auto py-0" asChild>
                <a 
                  href={currentProject.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  View on GitHub
                </a>
              </Button>
            )}
          </div>
        </div>
        
        {/* Project Actions */}
        <div className="flex items-center gap-2">
          {owner && repo && currentProject?.settings && (
            <ProjectSettingsDialog 
              owner={owner} 
              repo={repo} 
              currentSettings={currentProject.settings}
            />
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} className="w-full">
        <TabsList className="w-full justify-start">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link 
                to={tab.href}
                className={cn(
                  "flex items-center gap-2",
                  activeTab === tab.value && "data-[state=active]:bg-background"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Tab Content */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
