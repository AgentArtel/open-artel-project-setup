/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Task status colors
        'task-pending': '#9ca3af',
        'task-in-progress': '#3b82f6',
        'task-review': '#f97316',
        'task-done': '#10b981',
        'task-blocked': '#ef4444',
        // Agent status colors
        'agent-idle': '#9ca3af',
        'agent-working': '#3b82f6',
        'agent-blocked': '#ef4444',
        // Priority colors
        'priority-p0': '#ef4444',
        'priority-p1': '#ef4444',
        'priority-p2': '#f97316',
        'priority-p3': '#eab308',
      },
    },
  },
  plugins: [],
}

