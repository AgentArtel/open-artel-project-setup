import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, User, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/types';
import { useUiStyle } from '@/hooks/useUiStyle';
import { cn } from '@/lib/utils';

export function ReviewList() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const { isClawLens } = useUiStyle();
  const sw = isClawLens ? 1.5 : 2;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (owner && repo) {
      reviewsApi.list(owner, repo).then(setReviews).catch((e) => setError(e instanceof Error ? e.message : 'Failed to load')).finally(() => setIsLoading(false));
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
        <p className="font-medium">Error loading reviews</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const verdictIcon = (v: Review['verdict']) => {
    if (v === 'APPROVED') return <CheckCircle2 className={cn("h-4 w-4", isClawLens ? "text-primary" : "text-green-500")} strokeWidth={sw} />;
    if (v === 'REJECTED') return <XCircle className={cn("h-4 w-4", isClawLens ? "text-destructive" : "text-red-500")} strokeWidth={sw} />;
    return <AlertCircle className={cn("h-4 w-4", isClawLens ? "text-muted-foreground" : "text-amber-500")} strokeWidth={sw} />;
  };

  const verdictColor = (v: Review['verdict']) => {
    if (isClawLens) return v === 'APPROVED' ? 'badge-cyan' : v === 'REJECTED' ? 'badge-vermillion' : 'bg-muted text-muted-foreground';
    if (v === 'APPROVED') return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (v === 'REJECTED') return 'bg-red-500/10 text-red-500 border-red-500/20';
    return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
  };

  return (
    <div className="space-y-4">
      <div className={cn(isClawLens && "border-b border-border pb-4")}>
        <h2 className={cn("text-2xl font-bold tracking-tight", isClawLens && "section-title tracking-wider")}>Reviews</h2>
        {isClawLens && <p className="text-[9px] text-muted-foreground tracking-widest mt-1">レビュー // REVIEWS</p>}
        <p className="text-muted-foreground">Code reviews from .ai/reviews/</p>
      </div>
      {reviews.length === 0 ? (
        <Card className={cn(isClawLens && "hud-card")}>
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" strokeWidth={sw} />
            <p>No reviews yet</p>
            <p className="text-sm">Reviews appear when .ai/reviews/ contains markdown files.</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review.id} className={cn(isClawLens && "hud-card")}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      {verdictIcon(review.verdict)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {review.taskId && (
                          <Link to={`/project/${owner}/${repo}/tasks/${review.taskId}`} className={cn("font-medium text-primary hover:underline", isClawLens && "font-mono cyan-glow")}>
                            {review.taskId}
                          </Link>
                        )}
                        <Badge variant="outline" className={verdictColor(review.verdict)}>
                          {review.verdict.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {review.reviewer && <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" strokeWidth={sw} />{review.reviewer}</span>}
                        {review.date && <span className={cn("flex items-center gap-1", isClawLens && "font-mono")}><Calendar className="h-3.5 w-3.5" strokeWidth={sw} />{review.date}</span>}
                      </div>
                      {review.feedback && (
                        <div className={cn("text-sm whitespace-pre-wrap border-l-2 pl-3 mt-2", isClawLens ? "border-primary/30" : "border-muted")}>
                          {review.feedback}
                        </div>
                      )}
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
