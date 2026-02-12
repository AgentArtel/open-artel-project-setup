import { TaskDetail } from '../components/tasks/TaskDetail';
import { Layout } from '../components/layout/Layout';

export function TaskDetailPage() {
  return (
    <Layout showSidebar>
      <TaskDetail />
    </Layout>
  );
}

