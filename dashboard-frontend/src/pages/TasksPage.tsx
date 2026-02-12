import { TaskList } from '../components/tasks/TaskList';
import { Layout } from '../components/layout/Layout';

export function TasksPage() {
  return (
    <Layout showSidebar>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        <TaskList />
      </div>
    </Layout>
  );
}

