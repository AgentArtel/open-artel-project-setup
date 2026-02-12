// ============================================================================
// File Browser Page - File Tree and Viewer with Syntax Highlighting
// ============================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Folder, 
  ChevronRight, 
  ChevronLeft,
  FileCode,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { filesApi } from '@/lib/api';
import { getFileExtension, getLanguageFromExtension } from '@/lib/utils';
import type { FileItem } from '@/lib/api';
import { Markdown } from '@/components/ui/markdown';
import { useUiStyle } from '@/hooks/useUiStyle';
import { cn } from '@/lib/utils';

function FileIcon({ path, className }: { path: string; className?: string }) {
  const ext = getFileExtension(path);
  const isCode = ['ts', 'tsx', 'js', 'jsx', 'py', 'java', 'go', 'rs', 'cpp', 'c', 'h'].includes(ext);
  if (isCode) return <FileCode className={className} />;
  return <FileText className={className} />;
}

export function FileBrowser() {
  const { owner, repo, '*': filePath } = useParams<{ owner: string; repo: string; '*': string }>();
  const navigate = useNavigate();
  const { isClawLens } = useUiStyle();
  const sw = isClawLens ? 1.5 : 2;
  
  const [files, setFiles] = useState<FileItem[]>([]);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState(filePath || '');

  useEffect(() => { if (owner && repo) loadPath(filePath || ''); }, [owner, repo, filePath]);

  const loadPath = async (path: string) => {
    if (!owner || !repo) return;
    setIsLoading(true); setError(null); setFileContent(null);
    try {
      try {
        const content = await filesApi.get(owner, repo, path);
        setFileContent(content.content); setCurrentPath(path);
      } catch {
        const items = await filesApi.listDirectory(owner, repo, path);
        setFiles(items.sort((a, b) => {
          if (a.type === 'dir' && b.type !== 'dir') return -1;
          if (a.type !== 'dir' && b.type === 'dir') return 1;
          return a.name.localeCompare(b.name);
        }));
        setCurrentPath(path);
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to load path'); }
    finally { setIsLoading(false); }
  };

  const navigateToPath = (path: string) => navigate(`/project/${owner}/${repo}/files/${path}`);
  const navigateUp = () => { const parts = currentPath.split('/').filter(Boolean); parts.pop(); navigateToPath(parts.join('/')); };
  const breadcrumbPaths = currentPath.split('/').filter(Boolean);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"><Skeleton className="h-96" /><Skeleton className="h-96 lg:col-span-2" /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <div className="flex items-center gap-2"><AlertCircle className="h-5 w-5" strokeWidth={sw} /><p className="font-medium">Error loading file browser</p></div>
        <p className="text-sm mt-1">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => loadPath(currentPath)}>Retry</Button>
      </div>
    );
  }

  // File Viewer
  if (fileContent !== null) {
    const ext = getFileExtension(currentPath);
    const language = getLanguageFromExtension(ext);
    const isMarkdown = ext === 'md' || ext === 'mdx';

    return (
      <div className="space-y-4">
        <div className={cn(isClawLens && "border-b border-border pb-4")}>
          <h2 className={cn("text-2xl font-bold tracking-tight", isClawLens && "section-title tracking-wider")}>Files</h2>
          {isClawLens && <p className="text-[9px] text-muted-foreground tracking-widest mt-1">ファイル // FILES</p>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={navigateUp}><ChevronLeft className="h-4 w-4 mr-1" strokeWidth={sw} />Back</Button>
          <div className="flex items-center gap-1 text-sm">
            <Button variant="ghost" size="sm" className="h-auto py-1" onClick={() => navigateToPath('')}>root</Button>
            {breadcrumbPaths.map((part: string, index: number) => {
              const pathUpToHere = breadcrumbPaths.slice(0, index + 1).join('/');
              const isLast = index === breadcrumbPaths.length - 1;
              return (
                <div key={index} className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" strokeWidth={sw} />
                  {isLast ? <span className={cn("px-2 py-1 font-medium", isClawLens && "font-mono cyan-glow")}>{part}</span> : (
                    <Button variant="ghost" size="sm" className="h-auto py-1" onClick={() => navigateToPath(pathUpToHere)}>{part}</Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <Card className={cn(isClawLens && "hud-card")}>
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-muted-foreground" strokeWidth={sw} />
                <span className={cn("font-mono text-sm", isClawLens && "cyan-glow")}>{breadcrumbPaths[breadcrumbPaths.length - 1]}</span>
              </div>
              <Badge variant="secondary" className={cn(isClawLens && "badge-cyan")}>{language}</Badge>
            </div>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              {isMarkdown ? (
                <div className="p-4"><Markdown content={fileContent ?? ''} /></div>
              ) : (
                <pre className="p-4 text-sm overflow-x-auto font-mono bg-muted/50">
                  {(fileContent ?? '').split('\n').map((line, i) => (
                    <div key={i}>
                      <span className={cn("inline-block w-8 text-right mr-4 text-muted-foreground select-none", isClawLens && "text-primary/40")}>{i + 1}</span>
                      {line || ' '}
                    </div>
                  ))}
                </pre>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Directory Listing
  return (
    <div className="space-y-4">
      <div className={cn(isClawLens && "border-b border-border pb-4")}>
        <h2 className={cn("text-2xl font-bold tracking-tight", isClawLens && "section-title tracking-wider")}>Files</h2>
        {isClawLens && <p className="text-[9px] text-muted-foreground tracking-widest mt-1">ファイル // FILES</p>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {currentPath && <Button variant="outline" size="sm" onClick={navigateUp}><ChevronLeft className="h-4 w-4 mr-1" strokeWidth={sw} />Up</Button>}
        <div className="flex items-center gap-1 text-sm">
          <Button variant="ghost" size="sm" className="h-auto py-1" onClick={() => navigateToPath('')}>root</Button>
          {breadcrumbPaths.map((part: string, index: number) => {
            const pathUpToHere = breadcrumbPaths.slice(0, index + 1).join('/');
            const isLast = index === breadcrumbPaths.length - 1;
            return (
              <div key={index} className="flex items-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground" strokeWidth={sw} />
                {isLast ? <span className={cn("px-2 py-1 font-medium", isClawLens && "font-mono")}>{part}</span> : (
                  <Button variant="ghost" size="sm" className="h-auto py-1" onClick={() => navigateToPath(pathUpToHere)}>{part}</Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Card className={cn(isClawLens && "hud-card")}>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-20rem)]">
            {files.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" strokeWidth={sw} /><p>This directory is empty</p>
              </div>
            ) : (
              <div className="divide-y">
                {files.map((file) => (
                  <button key={file.path} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left" onClick={() => navigateToPath(file.path)}>
                    {file.type === 'dir' ? (
                      <Folder className={cn("h-5 w-5 shrink-0", isClawLens ? "text-primary" : "text-blue-500")} strokeWidth={sw} />
                    ) : (
                      <FileIcon path={file.path} className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <span className={cn("flex-1 truncate", isClawLens && "font-mono")}>{file.name}</span>
                    {file.type === 'file' && (
                      <span className={cn("text-xs text-muted-foreground", isClawLens && "font-mono cyan-glow")}>{(file.size / 1024).toFixed(1)} KB</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={sw} />
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
