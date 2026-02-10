import { Octokit } from '@octokit/rest';
import { config } from '../config';
import { Commit, ParsedCommit, Task, TaskLifecycleEvent } from '../types';

// Initialize Octokit client
const octokit = new Octokit({
  auth: config.github.token,
});

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  html_url: string;
  description: string | null;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
  } | null;
  html_url: string;
  files?: Array<{
    filename: string;
    status: string;
  }>;
}

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  sha: string;
  url: string;
}

export interface StatusData {
  currentFocus: string;
  activeSprint: Array<{
    id: string;
    title: string;
    status: string;
    assigned?: string;
    notes?: string;
  }>;
  backlog: Array<{
    id: string;
    title: string;
    priority: string;
  }>;
  recentlyCompleted: Array<{
    id: string;
    title: string;
    date: string;
  }>;
}

export interface TaskBrief {
  id: string;
  title: string;
  status: string;
  assigned: string;
  priority: string;
  type: string;
  dependsOn: string[];
  blocks: string[];
  objective: string;
  specifications: string;
  acceptanceCriteria: string[];
  doNot: string[];
  handoffNotes?: string;
}

export interface Review {
  id: string;
  taskId: string;
  reviewer: string;
  verdict: 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED';
  feedback: string;
  date: string;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  summary: string;
}

/**
 * GitHub Service - Handles all GitHub API interactions
 */
export class GitHubService {
  /**
   * List repositories for an organization or user
   */
  async listRepositories(org?: string): Promise<Repository[]> {
    if (!config.github.token) {
      throw new Error('GitHub token not configured');
    }

    try {
      const response = org
        ? await octokit.repos.listForOrg({ org })
        : await octokit.repos.listForAuthenticatedUser({ type: 'all' });

      return response.data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: {
          login: repo.owner.login,
        },
        html_url: repo.html_url,
        description: repo.description,
      }));
    } catch (error) {
      console.error('Error listing repositories:', error);
      throw error;
    }
  }

  /**
   * Get repository details
   */
  async getRepository(owner: string, repo: string): Promise<Repository> {
    if (!config.github.token) {
      throw new Error('GitHub token not configured');
    }

    try {
      const response = await octokit.repos.get({ owner, repo });
      const repoData = response.data;

      return {
        id: repoData.id,
        name: repoData.name,
        full_name: repoData.full_name,
        owner: {
          login: repoData.owner.login,
        },
        html_url: repoData.html_url,
        description: repoData.description,
      };
    } catch (error) {
      console.error('Error getting repository:', error);
      throw error;
    }
  }

  /**
   * List commits for a repository
   */
  async listCommits(owner: string, repo: string, branch?: string): Promise<Commit[]> {
    if (!config.github.token) {
      throw new Error('GitHub token not configured');
    }

    try {
      const response = await octokit.repos.listCommits({
        owner,
        repo,
        sha: branch,
        per_page: 100,
      });

      return response.data.map((commit) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author.name,
          email: commit.commit.author.email,
          date: commit.commit.author.date,
        },
        url: commit.html_url,
        files: commit.files?.map((f) => f.filename),
        parsed: this.parseCommitMessage(commit.commit.message),
      }));
    } catch (error) {
      console.error('Error listing commits:', error);
      throw error;
    }
  }

  /**
   * Get a single commit
   */
  async getCommit(owner: string, repo: string, sha: string): Promise<Commit> {
    if (!config.github.token) {
      throw new Error('GitHub token not configured');
    }

    try {
      const response = await octokit.repos.getCommit({ owner, repo, ref: sha });
      const commit = response.data;

      return {
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author.name,
          email: commit.commit.author.email,
          date: commit.commit.author.date,
        },
        url: commit.html_url,
        files: commit.files?.map((f) => f.filename),
        parsed: this.parseCommitMessage(commit.commit.message),
      };
    } catch (error) {
      console.error('Error getting commit:', error);
      throw error;
    }
  }

  /**
   * Parse Open Artel routing headers from commit message
   */
  parseCommitMessage(message: string): ParsedCommit {
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

    return {
      raw: message,
      agent,
      action,
      task,
      description,
      isRoutingHeader: !!(agent || action || task),
    };
  }

  /**
   * Get file content from repository
   */
  async getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<string> {
    if (!config.github.token) {
      throw new Error('GitHub token not configured');
    }

    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref,
      });

      if (Array.isArray(response.data)) {
        throw new Error('Path is a directory, not a file');
      }

      if (response.data.type !== 'file') {
        throw new Error('Path is not a file');
      }

      // Decode base64 content
      if ('content' in response.data) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        return content;
      }

      throw new Error('File content not available');
    } catch (error: any) {
      if (error.status === 404) {
        throw new Error(`File not found: ${path}`);
      }
      console.error('Error getting file content:', error);
      throw error;
    }
  }

  /**
   * List directory contents
   */
  async listDirectory(owner: string, repo: string, path: string): Promise<FileItem[]> {
    if (!config.github.token) {
      throw new Error('GitHub token not configured');
    }

    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      if (!Array.isArray(response.data)) {
        throw new Error('Path is not a directory');
      }

      return response.data.map((item) => ({
        name: item.name,
        path: item.path,
        type: item.type === 'dir' ? 'dir' : 'file',
        size: item.size || 0,
        sha: item.sha,
        url: item.html_url,
      }));
    } catch (error: any) {
      if (error.status === 404) {
        throw new Error(`Directory not found: ${path}`);
      }
      console.error('Error listing directory:', error);
      throw error;
    }
  }

  /**
   * Get status.md content and parse it
   */
  async getStatusMd(owner: string, repo: string): Promise<StatusData> {
    try {
      const content = await this.getFileContent(owner, repo, '.ai/status.md');
      return this.parseStatusMd(content);
    } catch (error) {
      console.error('Error getting status.md:', error);
      throw error;
    }
  }

  /**
   * Parse status.md markdown content
   */
  private parseStatusMd(content: string): StatusData {
    const lines = content.split('\n');
    let currentFocus = '';
    const activeSprint: StatusData['activeSprint'] = [];
    const backlog: StatusData['backlog'] = [];
    const recentlyCompleted: StatusData['recentlyCompleted'] = [];

    let inActiveSprint = false;
    let inBacklog = false;
    let inRecentlyCompleted = false;

    for (const line of lines) {
      // Extract current focus
      if (line.startsWith('## Current Focus')) {
        const nextLine = lines[lines.indexOf(line) + 1];
        if (nextLine) {
          currentFocus = nextLine.trim();
        }
      }

      // Parse Active Sprint table
      if (line.includes('## Active Sprint') || line.includes('| ID |')) {
        inActiveSprint = true;
        continue;
      }

      if (inActiveSprint && line.startsWith('|') && !line.includes('---')) {
        const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
        if (cells.length >= 3 && cells[0] !== 'ID') {
          activeSprint.push({
            id: cells[0],
            title: cells[1] || '',
            status: cells[2] || 'PENDING',
            assigned: cells[3],
            notes: cells[4],
          });
        }
      }

      if (inActiveSprint && line.startsWith('##')) {
        inActiveSprint = false;
      }

      // Parse Backlog table
      if (line.includes('## Backlog') || (line.includes('| ID |') && !inActiveSprint)) {
        inBacklog = true;
        continue;
      }

      if (inBacklog && line.startsWith('|') && !line.includes('---')) {
        const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
        if (cells.length >= 3 && cells[0] !== 'ID') {
          backlog.push({
            id: cells[0],
            title: cells[1] || '',
            priority: cells[2] || 'P3',
          });
        }
      }

      if (inBacklog && line.startsWith('## Recently Completed')) {
        inBacklog = false;
        inRecentlyCompleted = true;
        continue;
      }

      // Parse Recently Completed table
      if (inRecentlyCompleted && line.startsWith('|') && !line.includes('---')) {
        const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
        if (cells.length >= 3 && cells[0] !== 'ID') {
          recentlyCompleted.push({
            id: cells[0],
            title: cells[1] || '',
            date: cells[2] || '',
          });
        }
      }
    }

    return {
      currentFocus,
      activeSprint,
      backlog,
      recentlyCompleted,
    };
  }

  /**
   * List all tasks from .ai/tasks/ directory
   */
  async listTasks(owner: string, repo: string): Promise<TaskBrief[]> {
    try {
      const files = await this.listDirectory(owner, repo, '.ai/tasks');
      const taskFiles = files.filter((f) => f.type === 'file' && f.name.endsWith('.md'));

      const tasks: TaskBrief[] = [];
      for (const file of taskFiles) {
        try {
          const task = await this.getTask(owner, repo, file.name.replace('.md', ''));
          tasks.push(task);
        } catch (error) {
          console.warn(`Error parsing task ${file.name}:`, error);
        }
      }

      return tasks;
    } catch (error) {
      console.error('Error listing tasks:', error);
      throw error;
    }
  }

  /**
   * Get a single task brief
   */
  async getTask(owner: string, repo: string, taskId: string): Promise<TaskBrief> {
    try {
      const content = await this.getFileContent(owner, repo, `.ai/tasks/${taskId}.md`);
      return this.parseTaskBrief(content, taskId);
    } catch (error) {
      console.error(`Error getting task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Parse task brief markdown content
   */
  private parseTaskBrief(content: string, taskId: string): TaskBrief {
    const lines = content.split('\n');
    let title = '';
    let status = 'PENDING';
    let assigned = '';
    let priority = 'P3';
    let type = '';
    const dependsOn: string[] = [];
    const blocks: string[] = [];
    let objective = '';
    let specifications = '';
    const acceptanceCriteria: string[] = [];
    const doNot: string[] = [];
    let handoffNotes = '';

    let inObjective = false;
    let inSpecifications = false;
    let inAcceptanceCriteria = false;
    let inDoNot = false;
    let inHandoffNotes = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Parse frontmatter/metadata
      if (line.startsWith('##')) {
        title = line.replace(/^##\s*/, '').trim();
      }

      if (line.includes('**Status**:')) {
        status = line.split('**Status**:')[1]?.trim() || 'PENDING';
      }

      if (line.includes('**Assigned**:')) {
        assigned = line.split('**Assigned**:')[1]?.trim() || '';
      }

      if (line.includes('**Priority**:')) {
        priority = line.split('**Priority**:')[1]?.trim() || 'P3';
      }

      if (line.includes('**Type**:')) {
        type = line.split('**Type**:')[1]?.trim() || '';
      }

      if (line.includes('**Depends on**:')) {
        const deps = line.split('**Depends on**:')[1]?.trim() || '';
        if (deps && deps !== 'none') {
          dependsOn.push(...deps.split(',').map((d) => d.trim()));
        }
      }

      if (line.includes('**Blocks**:')) {
        const blks = line.split('**Blocks**:')[1]?.trim() || '';
        if (blks && blks !== 'none') {
          blocks.push(...blks.split(',').map((b) => b.trim()));
        }
      }

      // Parse sections
      if (line.includes('### Objective')) {
        inObjective = true;
        inSpecifications = false;
        inAcceptanceCriteria = false;
        inDoNot = false;
        inHandoffNotes = false;
        continue;
      }

      if (line.includes('### Specifications')) {
        inObjective = false;
        inSpecifications = true;
        inAcceptanceCriteria = false;
        inDoNot = false;
        inHandoffNotes = false;
        continue;
      }

      if (line.includes('### Acceptance Criteria')) {
        inObjective = false;
        inSpecifications = false;
        inAcceptanceCriteria = true;
        inDoNot = false;
        inHandoffNotes = false;
        continue;
      }

      if (line.includes('### Do NOT')) {
        inObjective = false;
        inSpecifications = false;
        inAcceptanceCriteria = false;
        inDoNot = true;
        inHandoffNotes = false;
        continue;
      }

      if (line.includes('### Handoff Notes')) {
        inObjective = false;
        inSpecifications = false;
        inAcceptanceCriteria = false;
        inDoNot = false;
        inHandoffNotes = true;
        continue;
      }

      // Collect content
      if (inObjective && line.trim()) {
        objective += line + '\n';
      }

      if (inSpecifications && line.trim()) {
        specifications += line + '\n';
      }

      if (inAcceptanceCriteria && line.trim()) {
        if (line.includes('- [ ]') || line.includes('- [x]')) {
          acceptanceCriteria.push(line.replace(/^-\s*\[[x\s]\]\s*/, '').trim());
        }
      }

      if (inDoNot && line.trim()) {
        if (line.startsWith('-')) {
          doNot.push(line.replace(/^-\s*/, '').trim());
        }
      }

      if (inHandoffNotes && line.trim()) {
        handoffNotes += line + '\n';
      }
    }

    return {
      id: taskId,
      title: title || taskId,
      status: status.trim(),
      assigned: assigned.trim(),
      priority: priority.trim(),
      type: type.trim(),
      dependsOn: dependsOn.filter(Boolean),
      blocks: blocks.filter(Boolean),
      objective: objective.trim(),
      specifications: specifications.trim(),
      acceptanceCriteria: acceptanceCriteria.filter(Boolean),
      doNot: doNot.filter(Boolean),
      handoffNotes: handoffNotes.trim() || undefined,
    };
  }

  /**
   * List reviews from .ai/reviews/ directory
   */
  async listReviews(owner: string, repo: string): Promise<Review[]> {
    try {
      const files = await this.listDirectory(owner, repo, '.ai/reviews');
      const reviewFiles = files.filter((f) => f.type === 'file' && f.name.endsWith('.md'));

      const reviews: Review[] = [];
      for (const file of reviewFiles) {
        try {
          const content = await this.getFileContent(owner, repo, file.path);
          const review = this.parseReview(content, file.name);
          reviews.push(review);
        } catch (error) {
          console.warn(`Error parsing review ${file.name}:`, error);
        }
      }

      return reviews;
    } catch (error) {
      console.error('Error listing reviews:', error);
      throw error;
    }
  }

  /**
   * Parse review markdown content
   */
  private parseReview(content: string, filename: string): Review {
    const lines = content.split('\n');
    let taskId = '';
    let reviewer = '';
    let verdict: 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED' = 'CHANGES_REQUESTED';
    let feedback = '';
    let date = '';

    for (const line of lines) {
      if (line.includes('**Task**:')) {
        taskId = line.split('**Task**:')[1]?.trim() || '';
      }

      if (line.includes('**Reviewer**:')) {
        reviewer = line.split('**Reviewer**:')[1]?.trim() || '';
      }

      if (line.includes('**Verdict**:')) {
        const v = line.split('**Verdict**:')[1]?.trim().toUpperCase() || '';
        if (v === 'APPROVED') verdict = 'APPROVED';
        else if (v === 'REJECTED') verdict = 'REJECTED';
        else verdict = 'CHANGES_REQUESTED';
      }

      if (line.includes('**Date**:')) {
        date = line.split('**Date**:')[1]?.trim() || '';
      }

      if (line.includes('## Feedback')) {
        const feedbackStart = lines.indexOf(line);
        feedback = lines.slice(feedbackStart + 1).join('\n').trim();
      }
    }

    return {
      id: filename.replace('.md', ''),
      taskId: taskId || filename.replace('-review.md', ''),
      reviewer,
      verdict,
      feedback,
      date,
    };
  }

  /**
   * List reports from .ai/reports/ directory
   */
  async listReports(owner: string, repo: string): Promise<Report[]> {
    try {
      const files = await this.listDirectory(owner, repo, '.ai/reports');
      const reportFiles = files.filter((f) => f.type === 'file' && f.name.endsWith('.md'));

      const reports: Report[] = [];
      for (const file of reportFiles) {
        try {
          const content = await this.getFileContent(owner, repo, file.path);
          const report = this.parseReport(content, file.name);
          reports.push(report);
        } catch (error) {
          console.warn(`Error parsing report ${file.name}:`, error);
        }
      }

      return reports;
    } catch (error) {
      console.error('Error listing reports:', error);
      throw error;
    }
  }

  /**
   * Parse report markdown content
   */
  private parseReport(content: string, filename: string): Report {
    const lines = content.split('\n');
    let title = filename.replace('.md', '');
    let date = '';
    let summary = '';

    for (const line of lines) {
      if (line.startsWith('#')) {
        title = line.replace(/^#+\s*/, '').trim();
      }

      if (line.includes('**Date**:') || line.includes('Date:')) {
        date = line.split(/Date:?\s*/)[1]?.trim() || '';
      }

      if (line.includes('## Summary') || line.includes('## Executive Summary')) {
        const summaryStart = lines.indexOf(line);
        summary = lines.slice(summaryStart + 1, summaryStart + 5).join('\n').trim();
      }
    }

    return {
      id: filename.replace('.md', ''),
      title,
      date,
      summary,
    };
  }
}

// Export singleton instance
export const githubService = new GitHubService();

