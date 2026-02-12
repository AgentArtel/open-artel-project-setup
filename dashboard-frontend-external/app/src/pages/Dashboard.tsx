// ============================================================================
// Dashboard Page - Project List and Add Project Form
// ============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Github, Trash2, ExternalLink, Loader2, Search, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject } from '@/hooks/useProject';
import { MockWrapper } from '@/components/ui/mock-label';
import { reposApi, type GitHubRepo } from '@/lib/api';
import { toast } from 'sonner';
import { useUiStyle } from '@/hooks/useUiStyle';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const { projects, isLoading, error, createProject, deleteProject } = useProject();
  const { isClawLens } = useUiStyle();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ owner: string; repo: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  // Load from GitHub
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);
  const [repoSearch, setRepoSearch] = useState('');

  // Parse GitHub URL → owner/repo
  const handleUrlChange = (url: string) => {
    setRepoUrl(url);
    setUrlError(null);
    if (!url.trim()) {
      return;
    }
    // Match patterns: https://github.com/owner/repo, github.com/owner/repo, owner/repo
    const ghUrlMatch = url.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s#?]+)/);
    if (ghUrlMatch) {
      setOwner(ghUrlMatch[1]);
      setRepo(ghUrlMatch[2].replace(/\.git$/, ''));
      setUrlError(null);
      return;
    }
    // Try owner/repo shorthand
    const shortMatch = url.trim().match(/^([^/\s]+)\/([^/\s]+)$/);
    if (shortMatch) {
      setOwner(shortMatch[1]);
      setRepo(shortMatch[2].replace(/\.git$/, ''));
      setUrlError(null);
      return;
    }
    setUrlError('Paste a GitHub URL (e.g. https://github.com/owner/repo) or owner/repo');
  };

  const handleLoadRepos = async () => {
    setReposLoading(true);
    setReposError(null);
    try {
      const list = await reposApi.list();
      setRepos(list);
      if (list.length === 0) {
        toast.info('No repositories found. Add GITHUB_TOKEN to the backend if using a personal token.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load repositories';
      setReposError(msg);
      toast.error(msg);
    } finally {
      setReposLoading(false);
    }
  };

  const handleSelectRepo = (r: GitHubRepo) => {
    const [o, re] = r.full_name.split('/');
    setOwner(o);
    setRepo(re);
  };

  const filteredRepos = repoSearch.trim()
    ? repos.filter(
        (r) =>
          r.full_name.toLowerCase().includes(repoSearch.toLowerCase()) ||
          r.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
          (r.description?.toLowerCase().includes(repoSearch.toLowerCase()) ?? false)
      )
    : repos;

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner.trim() || !repo.trim()) return;

    setIsSubmitting(true);
    try {
      await createProject({
        owner: owner.trim(),
        repo: repo.trim(),
      });
      toast.success('Project added successfully');
      setOwner('');
      setRepo('');
      setRepoUrl('');
      setUrlError(null);
      setRepos([]);
      setRepoSearch('');
      setReposError(null);
      setIsAddDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (owner: string, repo: string) => {
    setProjectToDelete({ owner, repo });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    
    setIsSubmitting(true);
    try {
      await deleteProject(projectToDelete.owner, projectToDelete.repo);
      toast.success('Project removed successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove project');
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold tracking-tight", isClawLens && "section-title tracking-wider")}>Dashboard</h1>
          {isClawLens && (
            <p className="text-[9px] text-muted-foreground tracking-widest mt-1">ダッシュボード // OVERVIEW</p>
          )}
          <p className="text-muted-foreground">
            Manage your monitored GitHub projects
          </p>
        </div>
        
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setRepoSearch('');
              setUrlError(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className={cn(isClawLens && "btn-cyan")}>
              <Plus className="mr-2 h-4 w-4" strokeWidth={isClawLens ? 1.5 : 2} />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg overflow-hidden">
            <form onSubmit={handleAddProject} className="min-w-0 overflow-hidden">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>
                  Paste a GitHub URL, pick from your repos, or type owner/repo.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Option 1: Paste URL */}
                <div className="space-y-2">
                  <Label htmlFor="repoUrl" className="text-sm font-medium flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5" />
                    Paste a GitHub URL
                  </Label>
                  <Input
                    id="repoUrl"
                    placeholder="https://github.com/owner/repo"
                    value={repoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    disabled={isSubmitting}
                    className="h-9"
                  />
                  {urlError && (
                    <p className="text-xs text-destructive">{urlError}</p>
                  )}
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or browse your repos</span>
                  </div>
                </div>

                {/* Option 2: Load & pick from list */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLoadRepos}
                    disabled={reposLoading || isSubmitting}
                    className="w-full h-9"
                  >
                    {reposLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Github className="mr-2 h-4 w-4" />
                    )}
                    {repos.length > 0 ? `Refresh (${repos.length} repos)` : 'Load my repos from GitHub'}
                  </Button>
                  {reposError && (
                    <p className="text-sm text-destructive">{reposError}</p>
                  )}
                  {repos.length > 0 && (
                    <>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          placeholder="Filter repos..."
                          value={repoSearch}
                          onChange={(e) => setRepoSearch(e.target.value)}
                          className="pl-8 h-8 text-sm"
                        />
                      </div>
                      <div className="max-h-36 overflow-y-auto rounded-md border bg-muted/30 p-1 space-y-0.5">
                        {filteredRepos.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-2 px-2">No repos match your filter.</p>
                        ) : (
                          filteredRepos.map((r) => {
                            const selected = owner === r.owner.login && repo === r.name;
                            return (
                              <button
                                key={r.id}
                                type="button"
                                className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors overflow-hidden ${
                                  selected
                                    ? 'bg-primary/10 border border-primary/20'
                                    : 'hover:bg-muted'
                                }`}
                                onClick={() => handleSelectRepo(r)}
                              >
                                <span className="font-medium truncate block">{r.full_name}</span>
                                {r.description && (
                                  <span className="block text-muted-foreground truncate text-xs">
                                    {r.description}
                                  </span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Resolved owner/repo (always visible) */}
                <div className="rounded-md border bg-muted/20 p-3 space-y-2">
                  <Label className="text-xs text-muted-foreground">Repository to add</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0 space-y-1">
                      <Label htmlFor="owner" className="text-xs text-muted-foreground">Owner</Label>
                      <Input
                        id="owner"
                        placeholder="owner"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        disabled={isSubmitting}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <Label htmlFor="repo" className="text-xs text-muted-foreground">Repository</Label>
                      <Input
                        id="repo"
                        placeholder="repo"
                        value={repo}
                        onChange={(e) => setRepo(e.target.value)}
                        disabled={isSubmitting}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!owner.trim() || !repo.trim() || isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Project
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Error loading projects</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Github className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mt-2">
              Add your first GitHub project to start monitoring tasks, agents, and commits.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const isMock = '_isMock' in project && (project as { _isMock?: boolean })._isMock;
            return (
            <Card key={project.id} className={cn("group", isClawLens && "hud-card corner-accent")}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">
                      <MockWrapper isMock={isMock}>{project.name}</MockWrapper>
                    </CardTitle>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    {!isMock && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(project.owner, project.repo)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    )}
                  </div>
                </div>
                <CardDescription>
                  <MockWrapper isMock={isMock}>{project.fullName}</MockWrapper>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className={cn(isClawLens && "badge-cyan")}>
                    {isMock ? <em className="italic">Mock Data</em> : (project.isLocal ? 'Local' : 'GitHub')}
                  </Badge>
                  <Button variant="outline" size="sm" className={cn(isClawLens && "btn-outline")} asChild>
                    <Link to={`/project/${project.owner}/${project.repo}/tasks`}>
                      View Tasks
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <strong>{projectToDelete?.owner}/{projectToDelete?.repo}</strong>?
              This will stop monitoring the project but won't affect the repository.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
