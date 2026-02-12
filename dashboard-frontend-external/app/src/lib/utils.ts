// ============================================================================
// Utility Functions
// ============================================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string | Date, formatStr = 'MMM d, yyyy'): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format a date with time
 */
export function formatDateTime(dateString: string | Date): string {
  return formatDate(dateString, 'MMM d, yyyy HH:mm');
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Truncate SHA hash for display
 */
export function truncateSha(sha: string, length = 7): string {
  return sha.slice(0, length);
}

/**
 * Extract file extension from path
 */
export function getFileExtension(path: string): string {
  const parts = path.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Get language for syntax highlighting based on file extension
 */
export function getLanguageFromExtension(ext: string): string {
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    py: 'python',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    java: 'java',
    kt: 'kotlin',
    swift: 'swift',
    c: 'c',
    cpp: 'cpp',
    h: 'c',
    cs: 'csharp',
    php: 'php',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    md: 'markdown',
    mdx: 'markdown',
    sql: 'sql',
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
    dockerfile: 'docker',
    tf: 'hcl',
    vue: 'vue',
    svelte: 'svelte',
  };
  
  return languageMap[ext] || 'text';
}

/**
 * Parse routing headers from commit message
 */
export function parseRoutingHeaders(message: string): {
  agent?: string;
  action?: string;
  task?: string;
  description: string;
} {
  const agentMatch = message.match(/\[AGENT:([^\]]+)\]/);
  const actionMatch = message.match(/\[ACTION:([^\]]+)\]/);
  const taskMatch = message.match(/\[TASK:([^\]]+)\]/);

  const agent = agentMatch ? agentMatch[1] : undefined;
  const action = actionMatch ? actionMatch[1] : undefined;
  const task = taskMatch ? taskMatch[1] : undefined;

  // Extract description (everything after the last routing header)
  let description = message;
  if (agentMatch || actionMatch || taskMatch) {
    const lastMatch = [agentMatch, actionMatch, taskMatch]
      .filter(Boolean)
      .sort((a, b) => (b?.index || 0) - (a?.index || 0))[0];
    if (lastMatch) {
      description = message.substring((lastMatch.index || 0) + lastMatch[0].length).trim();
    }
  }

  return { agent, action, task, description };
}

/**
 * Check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Group array items by a key function
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sort tasks by priority (P0 first, P4 last)
 */
export function sortByPriority<T extends { priority: string }>(items: T[]): T[] {
  const priorityOrder: Record<string, number> = {
    P0: 0,
    P1: 1,
    P2: 2,
    P3: 3,
    P4: 4,
  };
  
  return [...items].sort((a, b) => {
    const aOrder = priorityOrder[a.priority] ?? 999;
    const bOrder = priorityOrder[b.priority] ?? 999;
    return aOrder - bOrder;
  });
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert kebab-case or snake_case to Title Case
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
