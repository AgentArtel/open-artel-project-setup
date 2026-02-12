// ============================================================================
// Commit History Page - Commit List with Routing Headers
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
  GitCommit, 
  ExternalLink, 
  User, 
  Calendar,
  Filter,
  Search,
  Tag,
  ChevronDown,
  ChevronUp,
  FileCode,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { commitsApi } from '@/lib/api';
import { subscribeToEvent } from '@/lib/websocket';
import type { Commit } from '@/types';
import { cn, formatRelativeTime, truncateSha, truncateText } from '@/lib/utils';
import { toast } from 'sonner';
import { useUiStyle } from '@/hooks/useUiStyle';

export function CommitHistory() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const { isClawLens } = useUiStyle();
  const sw = isClawLens ? 1.5 : 2;
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [expandedSha, setExpandedSha] = useState<string | null>(null);
  const [commitDetails, setCommitDetails] = useState<Record<string, Commit>>({});
  const [loadingSha, setLoadingSha] = useState<string | null>(null);

  const toggleFiles = useCallback(async (sha: string) => {
    if (expandedSha === sha) { setExpandedSha(null); return; }
    setExpandedSha(sha);
    if (commitDetails[sha]?.files) return;
    if (!owner || !repo) return;
    setLoadingSha(sha);
    try {
      const detail = await commitsApi.get(owner, repo, sha);
      setCommitDetails(prev => ({ ...prev, [sha]: detail }));
    } catch {
      setCommitDetails(prev => ({ ...prev, [sha]: { ...commits.find(c => c.sha === sha)!, files: [] } }));
    } finally { setLoadingSha(null); }
  }, [expandedSha, commitDetails, owner, repo, commits]);

  useEffect(() => { if (owner && repo) loadCommits(); }, [owner, repo]);

  useEffect(() => {
    if (!owner || !repo) return;
    const unsubscribe = subscribeToEvent<{ sha: string; message: string; author: string }>(
      'commit:new', (data) => {
        toast.info('New commit detected', { description: `${truncateSha(data.sha)}: ${truncateText(data.message, 50)}` });
        loadCommits();
      }
    );
    return () => unsubscribe();
  }, [owner, repo]);

  const loadCommits = async () => {
    if (!owner || !repo) return;
    setIsLoading(true); setError(null);
    try { const data = await commitsApi.list(owner, repo, { limit: 50 }); setCommits(data); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to load commits'); }
    finally { setIsLoading(false); }
  };

  const agents = Array.from(new Set(commits.map(c => c.parsed?.agent).filter((a): a is string => Boolean(a)))).sort();
  const actions = Array.from(new Set(commits.map(c => c.parsed?.action).filter((a): a is string => Boolean(a)))).sort();

  const filteredCommits = commits.filter((commit) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = commit.message.toLowerCase().includes(query) || commit.sha.toLowerCase().includes(query) || commit.author.name.toLowerCase().includes(query) || commit.parsed?.agent?.toLowerCase().includes(query) || commit.parsed?.task?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    if (selectedAgents.length > 0 && (!commit.parsed?.agent || !selectedAgents.includes(commit.parsed.agent))) return false;
    if (selectedActions.length > 0 && (!commit.parsed?.action || !selectedActions.includes(commit.parsed.action))) return false;
    return true;
  });

  const toggleAgent = (agent: string) => { setSelectedAgents(prev => prev.includes(agent) ? prev.filter(a => a !== agent) : [...prev, agent]); };
  const toggleAction = (action: string) => { setSelectedActions(prev => prev.includes(action) ? prev.filter(a => a !== action) : [...prev, action]); };
  const clearFilters = () => { setSearchQuery(''); setSelectedAgents([]); setSelectedActions([]); };
  const hasFilters = searchQuery || selectedAgents.length > 0 || selectedActions.length > 0;

  const getAgentColor = (agent?: string): string => {
    if (!agent) return '';
    const colors: Record<string, string> = {
      claude: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      cursor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      lovable: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      kimi: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    };
    return colors[agent.toLowerCase()] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p className="font-medium">Error loading commits</p>
        <p className="text-sm">{error}</p>
        <Button variant="outline" className="mt-4" onClick={loadCommits}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={cn(isClawLens && "border-b border-border pb-4")}>
        <h2 className={cn("text-2xl font-bold tracking-tight", isClawLens && "section-title tracking-wider")}>Commit History</h2>
        {isClawLens && <p className="text-[9px] text-muted-foreground tracking-widest mt-1">コミット // COMMITS</p>}
        <p className="text-muted-foreground">Recent commits with routing header parsing</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={sw} />
          <Input placeholder="Search commits..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" strokeWidth={sw} />Filter
              {(selectedAgents.length + selectedActions.length) > 0 && <Badge variant="secondary" className="ml-1">{selectedAgents.length + selectedActions.length}</Badge>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {agents.length > 0 && (<><DropdownMenuLabel>Agent</DropdownMenuLabel>{agents.map((agent) => (<DropdownMenuCheckboxItem key={agent} checked={selectedAgents.includes(agent)} onCheckedChange={() => toggleAgent(agent)}>{agent}</DropdownMenuCheckboxItem>))}</>)}
            {actions.length > 0 && agents.length > 0 && <DropdownMenuSeparator />}
            {actions.length > 0 && (<><DropdownMenuLabel>Action</DropdownMenuLabel>{actions.map((action) => (<DropdownMenuCheckboxItem key={action} checked={selectedActions.includes(action)} onCheckedChange={() => toggleAction(action)}>{action}</DropdownMenuCheckboxItem>))}</>)}
          </DropdownMenuContent>
        </DropdownMenu>
        {hasFilters && <Button variant="ghost" onClick={clearFilters}>Clear filters</Button>}
      </div>

      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedAgents.map((agent) => <Badge key={agent} variant="secondary" className="cursor-pointer" onClick={() => toggleAgent(agent)}>Agent: {agent} ×</Badge>)}
          {selectedActions.map((action) => <Badge key={action} variant="secondary" className="cursor-pointer" onClick={() => toggleAction(action)}>Action: {action} ×</Badge>)}
        </div>
      )}

      <p className={cn("text-sm text-muted-foreground", isClawLens && "font-mono")}>
        Showing {filteredCommits.length} of {commits.length} commits
      </p>

      {/* Commits List */}
      <ScrollArea className="h-[calc(100vh-20rem)]">
        <div className="space-y-3">
          {filteredCommits.map((commit) => (
            <Card key={commit.sha} className={cn("hover:shadow-md transition-shadow", isClawLens && "hud-card")}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", isClawLens ? "bg-primary/10" : "bg-primary/10")}>
                    <GitCommit className="h-5 w-5 text-primary" strokeWidth={sw} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium leading-tight">{commit.parsed?.description || commit.message.split('\n')[0]}</p>
                      <a href={commit.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="h-4 w-4" strokeWidth={sw} /></Button>
                      </a>
                    </div>
                    {commit.parsed?.isRoutingHeader && (
                      <div className="flex flex-wrap gap-1.5">
                        {commit.parsed.agent && <Badge variant="outline" className={cn("text-xs", isClawLens ? "badge-cyan" : getAgentColor(commit.parsed.agent))}><Tag className="mr-1 h-3 w-3" strokeWidth={sw} />{commit.parsed.agent}</Badge>}
                        {commit.parsed.action && <Badge variant="outline" className="text-xs">{commit.parsed.action}</Badge>}
                        {commit.parsed.task && <Badge variant="outline" className={cn("text-xs font-mono", isClawLens && "cyan-glow")}>{commit.parsed.task}</Badge>}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("font-mono text-xs bg-muted px-1.5 py-0.5 rounded", isClawLens && "cyan-glow")}>{truncateSha(commit.sha)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" strokeWidth={sw} /><span>{commit.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" strokeWidth={sw} /><span className={cn(isClawLens && "font-mono")}>{formatRelativeTime(commit.author.date)}</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground gap-1" onClick={() => toggleFiles(commit.sha)}>
                        {loadingSha === commit.sha ? <Loader2 className="h-3 w-3 animate-spin" /> : expandedSha === commit.sha ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        {(commit.files?.length ?? commitDetails[commit.sha]?.files?.length ?? 0) > 0 ? `${commitDetails[commit.sha]?.files?.length ?? commit.files?.length ?? 0} file(s) changed` : 'Show files'}
                      </Button>
                      {expandedSha === commit.sha && (
                        <ul className={cn("mt-2 pl-4 space-y-1 text-xs font-mono text-muted-foreground border-l-2", isClawLens ? "border-primary/30" : "border-muted")}>
                          {loadingSha === commit.sha ? (
                            <li className="flex items-center gap-1.5"><Loader2 className="h-3 w-3 animate-spin" />Loading files…</li>
                          ) : ((commitDetails[commit.sha]?.files ?? commit.files) ?? []).length > 0 ? (
                            (commitDetails[commit.sha]?.files ?? commit.files ?? []).map((file, i) => (
                              <li key={i} className="flex items-center gap-1.5"><FileCode className="h-3 w-3 shrink-0" strokeWidth={sw} />{file}</li>
                            ))
                          ) : <li>No file list available</li>}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
