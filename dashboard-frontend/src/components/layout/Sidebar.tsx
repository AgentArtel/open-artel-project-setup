import { Link, useParams } from 'react-router-dom';
import { Folder, ListTodo, Users, GitCommit, FileText, MessageSquare } from 'lucide-react';

interface SidebarProps {
  projectOwner?: string;
  projectRepo?: string;
}

export function Sidebar({ projectOwner, projectRepo }: SidebarProps) {
  const params = useParams();
  const owner = projectOwner || params.owner;
  const repo = projectRepo || params.repo;

  const navItems = owner && repo ? [
    { path: `/projects/${owner}/${repo}`, label: 'Overview', icon: Folder },
    { path: `/projects/${owner}/${repo}/tasks`, label: 'Tasks', icon: ListTodo },
    { path: `/projects/${owner}/${repo}/agents`, label: 'Agents', icon: Users },
    { path: `/projects/${owner}/${repo}/commits`, label: 'Commits', icon: GitCommit },
    { path: `/projects/${owner}/${repo}/files`, label: 'Files', icon: FileText },
  ] : [];

  return (
    <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen" role="complementary" aria-label="Project navigation">
      <nav className="p-4" role="navigation" aria-label="Project sections">
        {navItems.length > 0 ? (
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Navigate to ${item.label}`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Select a project to view navigation
          </div>
        )}
      </nav>
    </aside>
  );
}

