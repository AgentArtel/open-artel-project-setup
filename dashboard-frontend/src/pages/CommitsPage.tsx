import { CommitList } from '../components/commits/CommitList';
import { Layout } from '../components/layout/Layout';

export function CommitsPage() {
  return (
    <Layout showSidebar>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Commits</h1>
        <CommitList />
      </div>
    </Layout>
  );
}

