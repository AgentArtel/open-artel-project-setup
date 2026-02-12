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
import { ReviewList } from '@/pages/ReviewList';
import { ReportList } from '@/pages/ReportList';
import { SettingsPage } from '@/pages/SettingsPage';
import { MainLayout } from '@/components/layout/MainLayout';
import { initializeSocket } from '@/lib/websocket';
import { healthApi } from '@/lib/api';
import { useSettingsStore } from '@/stores/settingsStore';
import { isBackendConfigured } from '@/lib/mockData';
import { useEffect } from 'react';

// Apply ClawLens class to document root
function UiStyleSync() {
  const uiStyle = useSettingsStore((s) => s.uiStyle);

  useEffect(() => {
    if (uiStyle === 'clawlens') {
      document.documentElement.classList.add('clawlens');
    } else {
      document.documentElement.classList.remove('clawlens');
    }
  }, [uiStyle]);

  return null;
}

// Initialize WebSocket and health check only when backend is configured
function AppInit() {
  const apiBaseUrl = useSettingsStore((s) => s.apiBaseUrl);
  const refreshIntervalSeconds = useSettingsStore((s) => s.defaultRefreshInterval);

  useEffect(() => {
    // Don't auto-connect if backend URL is localhost/not configured
    if (!isBackendConfigured(apiBaseUrl)) {
      console.debug('[AppInit] No backend configured — running with mock data');
      useSettingsStore.getState().updateBackendHealth({ status: 'unknown' });
      return;
    }

    initializeSocket();

    const checkHealth = async () => {
      try {
        const health = await healthApi.check();
        useSettingsStore.getState().updateBackendHealth({
          status: 'healthy',
          timestamp: health.timestamp,
          uptime: health.uptime,
        });
      } catch {
        useSettingsStore.getState().updateBackendHealth({ status: 'unhealthy' });
        console.debug('[AppInit] Backend health check failed (will retry)');
      }
    };

    checkHealth();

    const intervalMs = Math.max(5000, Math.min(300000, refreshIntervalSeconds * 1000));
    const interval = setInterval(checkHealth, intervalMs);
    return () => clearInterval(interval);
  }, [apiBaseUrl, refreshIntervalSeconds]);

  return null;
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <AppInit />
        <UiStyleSync />
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
              <Route path="reviews" element={<ReviewList />} />
              <Route path="reports" element={<ReportList />} />
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
