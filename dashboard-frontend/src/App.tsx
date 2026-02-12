import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TasksPage } from './pages/TasksPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { AgentsPage } from './pages/AgentsPage';
import { CommitsPage } from './pages/CommitsPage';
import { CommitDetailPage } from './pages/CommitDetailPage';
import { FilesPage } from './pages/FilesPage';
import { KimiChatPage } from './pages/KimiChatPage';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <WebSocketProvider>
          <NotificationProvider>
            <Router>
            <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:owner/:repo" element={<ProjectDetailPage />} />
          <Route path="/projects/:owner/:repo/tasks" element={<TasksPage />} />
          <Route path="/projects/:owner/:repo/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="/projects/:owner/:repo/agents" element={<AgentsPage />} />
          <Route path="/projects/:owner/:repo/commits" element={<CommitsPage />} />
          <Route path="/projects/:owner/:repo/commits/:sha" element={<CommitDetailPage />} />
          <Route path="/projects/:owner/:repo/files" element={<FilesPage />} />
          <Route path="/kimi" element={<KimiChatPage />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </WebSocketProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
