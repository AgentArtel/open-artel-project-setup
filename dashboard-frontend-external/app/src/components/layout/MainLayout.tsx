// ============================================================================
// Main Layout - Sidebar + Header + Content Area
// ============================================================================

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { WebSocketStatus } from './WebSocketStatus';
import { KimiChat } from '@/components/chat/KimiChat';
import { cn } from '@/lib/utils';
import { useUiStyle } from '@/hooks/useUiStyle';

export function MainLayout() {
  const { isClawLens } = useUiStyle();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* WebSocket Connection Status */}
      <WebSocketStatus />
      
      {/* Main Content */}
      <main 
        className={cn(
          "transition-all duration-300",
          "pt-16", // Header height
          "pl-64", // Sidebar width
        )}
      >
        <div className={cn("p-6", isClawLens && "animate-fade-in")}>
          <Outlet />
        </div>
      </main>

      {/* Kimi Chat */}
      <KimiChat />
    </div>
  );
}
