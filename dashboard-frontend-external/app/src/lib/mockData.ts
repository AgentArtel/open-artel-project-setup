// ============================================================================
// Mock Data - Fallback data when no backend is connected
// All mock items have _isMock: true for visual distinction (italics)
// ============================================================================

import type { Project, Task, Agent } from '@/types';

export interface MockProject extends Project {
  _isMock: true;
}

export interface MockTask extends Task {
  _isMock: true;
}

export interface MockAgent extends Agent {
  _isMock: true;
}

export const mockProjects: MockProject[] = [
  {
    id: 'mock-1',
    name: 'sample-app',
    fullName: 'acme-org/sample-app',
    owner: 'acme-org',
    repo: 'sample-app',
    url: 'https://github.com/acme-org/sample-app',
    isLocal: false,
    _isMock: true,
    settings: {
      refreshInterval: 30,
      defaultView: 'tasks',
      notifications: true,
    },
  },
  {
    id: 'mock-2',
    name: 'design-system',
    fullName: 'acme-org/design-system',
    owner: 'acme-org',
    repo: 'design-system',
    url: 'https://github.com/acme-org/design-system',
    isLocal: false,
    _isMock: true,
    settings: {
      refreshInterval: 30,
      defaultView: 'tasks',
      notifications: true,
    },
  },
];

export const mockTasks: MockTask[] = [
  {
    id: 'mock-task-1',
    title: 'Set up CI/CD pipeline',
    status: 'DONE',
    assigned: 'claude',
    priority: 'P1',
    type: 'infrastructure',
    dependsOn: [],
    blocks: ['mock-task-2'],
    objective: 'Configure automated build and deploy pipeline',
    specifications: 'Use GitHub Actions with staging and production environments',
    acceptanceCriteria: ['Pipeline runs on push to main', 'Deploy to staging on PR merge'],
    doNot: ['Deploy directly to production without staging'],
    _isMock: true,
  },
  {
    id: 'mock-task-2',
    title: 'Implement user authentication',
    status: 'IN_PROGRESS',
    assigned: 'cursor',
    priority: 'P0',
    type: 'feature',
    dependsOn: ['mock-task-1'],
    blocks: ['mock-task-3'],
    objective: 'Add login/signup flow with OAuth',
    specifications: 'Support GitHub and Google OAuth providers',
    acceptanceCriteria: ['Users can sign in with GitHub', 'Session persists on refresh'],
    doNot: ['Store passwords in plaintext'],
    _isMock: true,
  },
  {
    id: 'mock-task-3',
    title: 'Design landing page',
    status: 'PENDING',
    assigned: 'lovable',
    priority: 'P2',
    type: 'design',
    dependsOn: ['mock-task-2'],
    blocks: [],
    objective: 'Create a compelling landing page',
    specifications: 'Hero section, feature grid, CTA',
    acceptanceCriteria: ['Responsive on mobile', 'Lighthouse score > 90'],
    doNot: ['Use stock photos'],
    _isMock: true,
  },
  {
    id: 'mock-task-4',
    title: 'Fix sidebar navigation bug',
    status: 'REVIEW',
    assigned: 'kimi',
    priority: 'P1',
    type: 'bugfix',
    dependsOn: [],
    blocks: [],
    objective: 'Sidebar collapses unexpectedly on mobile',
    specifications: 'Investigate CSS media query breakpoints',
    acceptanceCriteria: ['Sidebar stays open on tablet', 'Smooth transition on toggle'],
    doNot: ['Remove responsive behavior'],
    _isMock: true,
  },
  {
    id: 'mock-task-5',
    title: 'Integrate payment processing',
    status: 'BLOCKED',
    assigned: 'claude',
    priority: 'P0',
    type: 'feature',
    dependsOn: ['mock-task-2'],
    blocks: [],
    objective: 'Add Stripe checkout flow',
    specifications: 'Subscription billing with free trial',
    acceptanceCriteria: ['Checkout completes successfully', 'Webhooks update subscription status'],
    doNot: ['Handle card data on our servers'],
    handoffNotes: 'Blocked on auth implementation',
    _isMock: true,
  },
];

export const mockAgents: MockAgent[] = [
  { name: 'claude', status: 'working', currentTask: 'mock-task-5', _isMock: true },
  { name: 'cursor', status: 'working', currentTask: 'mock-task-2', _isMock: true },
  { name: 'lovable', status: 'idle', _isMock: true },
  { name: 'kimi', status: 'idle', currentTask: 'mock-task-4', _isMock: true },
];

/**
 * Check if the backend URL looks like a real (non-default) backend
 */
export function isBackendConfigured(apiBaseUrl: string): boolean {
  const url = apiBaseUrl.toLowerCase().trim();
  return !!(
    url &&
    !url.includes('localhost') &&
    !url.includes('127.0.0.1') &&
    !url.includes('0.0.0.0')
  );
}
