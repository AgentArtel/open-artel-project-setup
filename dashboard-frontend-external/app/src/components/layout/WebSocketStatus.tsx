// ============================================================================
// WebSocket Status - Connection State Indicator
// ============================================================================

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useWebSocket } from '@/hooks/useWebSocket';

export function WebSocketStatus() {
  const { connected, reconnecting, error, connect } = useWebSocket();
  const [showError, setShowError] = useState(false);

  // Show error briefly when it changes (defer setState to avoid synchronous setState in effect)
  useEffect(() => {
    if (error) {
      const showTimer = setTimeout(() => setShowError(true), 0);
      const hideTimer = setTimeout(() => setShowError(false), 5000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [error]);

  // Don't show anything if connected and no error
  if (connected && !showError) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        {/* Error Message */}
        {showError && error && (
          <div className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm max-w-xs">
            {error}
          </div>
        )}

        {/* Connection Status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full shadow-lg",
                connected && "bg-green-500/10 text-green-500 border-green-500/20",
                reconnecting && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse",
                !connected && !reconnecting && "bg-red-500/10 text-red-500 border-red-500/20"
              )}
              onClick={connect}
              disabled={connected || reconnecting}
            >
              {connected ? (
                <Wifi className="h-5 w-5" />
              ) : reconnecting ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <WifiOff className="h-5 w-5" />
              )}
              <span className="sr-only">
                {connected 
                  ? 'Connected' 
                  : reconnecting 
                    ? 'Reconnecting...' 
                    : 'Disconnected - Click to reconnect'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {connected 
              ? 'WebSocket connected' 
              : reconnecting 
                ? 'Reconnecting to WebSocket...' 
                : 'WebSocket disconnected - Click to reconnect'}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
