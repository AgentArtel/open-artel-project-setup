interface CommitFiltersProps {
  agentFilter: string;
  actionFilter: string;
  taskFilter: string;
  branchFilter: string;
  onAgentChange: (agent: string) => void;
  onActionChange: (action: string) => void;
  onTaskChange: (task: string) => void;
  onBranchChange: (branch: string) => void;
  availableAgents: string[];
  availableActions: string[];
  availableTasks: string[];
}

export function CommitFilters({
  agentFilter,
  actionFilter,
  taskFilter,
  branchFilter,
  onAgentChange,
  onActionChange,
  onTaskChange,
  onBranchChange,
  availableAgents,
  availableActions,
  availableTasks,
}: CommitFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="agent-filter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Agent
          </label>
          <select
            id="agent-filter"
            value={agentFilter}
            onChange={(e) => onAgentChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All</option>
            {availableAgents.map((agent) => (
              <option key={agent} value={agent}>
                {agent}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="action-filter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Action
          </label>
          <select
            id="action-filter"
            value={actionFilter}
            onChange={(e) => onActionChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All</option>
            {availableActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task-filter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Task
          </label>
          <select
            id="task-filter"
            value={taskFilter}
            onChange={(e) => onTaskChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All</option>
            {availableTasks.map((task) => (
              <option key={task} value={task}>
                {task}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="branch-filter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Branch
          </label>
          <input
            id="branch-filter"
            type="text"
            value={branchFilter}
            onChange={(e) => onBranchChange(e.target.value)}
            placeholder="e.g., main"
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

