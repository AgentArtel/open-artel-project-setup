import { AgentDashboard } from '../components/agents/AgentDashboard';
import { Layout } from '../components/layout/Layout';

export function AgentsPage() {
  return (
    <Layout showSidebar>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Agents</h1>
        <AgentDashboard />
      </div>
    </Layout>
  );
}

