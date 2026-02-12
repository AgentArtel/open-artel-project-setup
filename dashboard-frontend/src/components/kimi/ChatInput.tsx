import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../common/Button';

interface ChatInputProps {
  onSend: (message: string, context?: { project?: string; task?: string }) => void;
  isLoading?: boolean;
  availableProjects?: Array<{ owner: string; repo: string; name: string }>;
  availableTasks?: Array<{ id: string; title: string }>;
}

export function ChatInput({ onSend, isLoading = false, availableProjects = [], availableTasks = [] }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const context = selectedProject || selectedTask
      ? {
          project: selectedProject,
          task: selectedTask,
        }
      : undefined;

    onSend(message, context);
    setMessage('');
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="space-y-3" aria-label="Chat input form">
        {(availableProjects.length > 0 || availableTasks.length > 0) && (
          <div className="flex space-x-2">
            {availableProjects.length > 0 && (
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No project context</option>
                {availableProjects.map((project) => (
                  <option key={`${project.owner}/${project.repo}`} value={`${project.owner}/${project.repo}`}>
                    {project.name}
                  </option>
                ))}
              </select>
            )}
            {availableTasks.length > 0 && (
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No task context</option>
                {availableTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        <div className="flex space-x-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message to Kimi..."
            rows={3}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={isLoading}
            aria-label="Chat message input"
            aria-describedby="chat-input-help"
          />
          <span id="chat-input-help" className="sr-only">Press Enter to send, Shift+Enter for new line</span>
          <Button type="submit" isLoading={isLoading} disabled={!message.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

