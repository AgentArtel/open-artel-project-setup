// ============================================================================
// App Component - Main Application with Routing
// ============================================================================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Dashboard } from '@/pages/Dashboard';
import { ProjectDetail } from '@/pages/ProjectDetail';
import { TaskList } from '@/pages/TaskList';
import { TaskDetail } from '@/pages/TaskDetail';
import { AgentStatus } from '@/pages/AgentStatus';
import { CommitHistory } from '@/pages/CommitHistory';
import { FileBrowser } from '@/pages/FileBrowser';
import { SettingsPage } from '@/pages/SettingsPage';
import { MainLayout } from '@/components/layout/MainLayout';
import { initializeSocket } from '@/lib/websocket';
import { healthApi } from '@/lib/api';
import { useSettingsStore } from '@/stores/settingsStore';
import { useEffect } from 'react';

// Initialize WebSocket and health check on app load
function AppInit() {
  useEffect(() => {
    // Initialize WebSocket
    initializeSocket();
    
    // Check backend health on startup
    const checkHealth = async () => {
      try {
        const health = await healthApi.check();
        useSettingsStore.getState().updateBackendHealth({
          status: 'healthy',
          timestamp: health.timestamp,
          uptime: health.uptime,
        });
      } catch (error) {
        useSettingsStore.getState().updateBackendHealth({
          status: 'unhealthy',
        });
        console.warn('Backend health check failed:', error);
      }
    };
    
    checkHealth();
    
    // Periodic health check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return null;
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <AppInit />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Dashboard - Project List */}
            <Route index element={<Dashboard />} />
            
            {/* Settings */}
            <Route path="settings" element={<SettingsPage />} />
            
            {/* Project Routes */}
            <Route path="project/:owner/:repo" element={<ProjectDetail />}>
              <Route index element={<Navigate to="tasks" replace />} />
              <Route path="tasks" element={<TaskList />} />
              <Route path="tasks/:taskId" element={<TaskDetail />} />
              <Route path="agents" element={<AgentStatus />} />
              <Route path="commits" element={<CommitHistory />} />
              <Route path="files/*" element={<FileBrowser />} />
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </Router>
    </ThemeProvider>
  );
}

export default App;
