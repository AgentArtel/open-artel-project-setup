import { useState } from 'react';
import { ProjectList } from '../components/projects/ProjectList';
import { AddProjectForm } from '../components/projects/AddProjectForm';
import { Layout } from '../components/layout/Layout';
import type { Project } from '@/types';
import { Plus, X } from 'lucide-react';
import { Button } from '../components/common/Button';

export function ProjectsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const handleProjectAdded = (project: Project) => {
    setProjects([...projects, project]);
    setShowAddForm(false);
    // Refresh the project list
    window.location.reload();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? 'secondary' : 'primary'}
          >
            {showAddForm ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </>
            )}
          </Button>
        </div>

        {showAddForm && (
          <AddProjectForm
            onSuccess={handleProjectAdded}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        <ProjectList />
      </div>
    </Layout>
  );
}

