import { useEffect, useState } from 'react';
import { ChatWindow } from '../components/kimi/ChatWindow';
import { Layout } from '../components/layout/Layout';
import { api } from '@/lib/api';
import type { Project, Task } from '@/types';

export function KimiChatPage() {
  const [projects, setProjects] = useState<Array<{ owner: string; repo: string; name: string }>>([]);
  const [tasks, setTasks] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    // Fetch projects for context selection
    const fetchProjects = async () => {
      const response = await api.get<Project[]>('/api/projects');
      if (response.success && response.data) {
        setProjects(
          response.data.map(p => ({
            owner: p.owner,
            repo: p.repo,
            name: p.name,
          }))
        );
      }
    };

    fetchProjects();
  }, []);

  // Tasks would be fetched based on selected project
  // For now, we'll leave it empty

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Kimi Chat</h1>
        <ChatWindow availableProjects={projects} availableTasks={tasks} />
      </div>
    </Layout>
  );
}

