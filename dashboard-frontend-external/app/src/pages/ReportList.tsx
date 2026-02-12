import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { reportsApi } from '@/lib/api';
import type { Report } from '@/types';
import { useUiStyle } from '@/hooks/useUiStyle';
import { cn } from '@/lib/utils';

export function ReportList() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const { isClawLens } = useUiStyle();
  const sw = isClawLens ? 1.5 : 2;
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (owner && repo) {
      reportsApi.list(owner, repo).then(setReports).catch((e) => setError(e instanceof Error ? e.message : 'Failed to load')).finally(() => setIsLoading(false));
    }
  }, [owner, repo]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p className="font-medium">Error loading reports</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={cn(isClawLens && "border-b border-border pb-4")}>
        <h2 className={cn("text-2xl font-bold tracking-tight", isClawLens && "section-title tracking-wider")}>Reports</h2>
        {isClawLens && <p className="text-[9px] text-muted-foreground tracking-widest mt-1">レポート // REPORTS</p>}
        <p className="text-muted-foreground">Sprint and status reports from .ai/reports/</p>
      </div>
      {reports.length === 0 ? (
        <Card className={cn(isClawLens && "hud-card")}>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" strokeWidth={sw} />
            <p>No reports yet</p>
            <p className="text-sm">Reports appear when .ai/reports/ contains markdown files.</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="space-y-3">
            {reports.map((report) => (
              <Card key={report.id} className={cn(isClawLens && "hud-card")}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      <FileText className={cn("h-4 w-4", isClawLens ? "text-primary" : "text-muted-foreground")} strokeWidth={sw} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className={cn("font-medium", isClawLens && "font-mono tracking-wide")}>{report.title}</h3>
                      {report.date && (
                        <div className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", isClawLens && "font-mono")}>
                          <Calendar className="h-3.5 w-3.5" strokeWidth={sw} />{report.date}
                        </div>
                      )}
                      {report.summary && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.summary}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
