## TASK-D1-3: GitHub API Integration

- **Status**: PENDING
- **Assigned**: cursor
- **Priority**: P1-High
- **Type**: Create
- **Depends on**: TASK-D1-2
- **Blocks**: TASK-D1-4, TASK-D1-6

### Context

The dashboard needs to read data from GitHub repositories — specifically Open Artel projects. This includes reading `.ai/` files, commit history, and parsing commit messages for routing headers.

### Objective

Implement GitHub API integration using Octokit. Create services to fetch repos, commits, files, and parse `.ai/` directory contents. Parse commit messages for Open Artel routing headers.

### Specifications

**GitHub API Services**:

```typescript
// src/services/github.ts

interface GitHubService {
  // Repository
  listRepositories(org?: string): Promise<Repository[]>;
  getRepository(owner: string, repo: string): Promise<Repository>;
  
  // Commits
  listCommits(owner: string, repo: string, branch?: string): Promise<Commit[]>;
  getCommit(owner: string, repo: string, sha: string): Promise<Commit>;
  parseCommitMessage(message: string): ParsedCommit;
  
  // Files
  getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<string>;
  listDirectory(owner: string, repo: string, path: string): Promise<FileItem[]>;
  
  // .ai/ directory parsing
  getStatusMd(owner: string, repo: string): Promise<StatusData>;
  listTasks(owner: string, repo: string): Promise<TaskBrief[]>;
  getTask(owner: string, repo: string, taskId: string): Promise<TaskBrief>;
  listReviews(owner: string, repo: string): Promise<Review[]>;
  listReports(owner: string, repo: string): Promise<Report[]>;
}
```

**Commit Message Parsing**:

Parse Open Artel routing headers:
```typescript
interface ParsedCommit {
  raw: string;
  agent?: string;           // From [AGENT:x]
  action?: string;          // From [ACTION:y]
  task?: string;            // From [TASK:z]
  description: string;      // Remaining text
  isRoutingHeader: boolean; // Has at least one header
}

// Examples:
// "[AGENT:cursor] [ACTION:submit] [TASK:TASK-001] Implement feature"
// Parsed: { agent: 'cursor', action: 'submit', task: 'TASK-001', ... }
```

**Status.md Parsing**:

Parse the markdown table from `.ai/status.md`:
```typescript
interface StatusData {
  currentFocus: string;
  activeSprint: SprintTask[];
  backlog: BacklogItem[];
  recentlyCompleted: CompletedItem[];
}

interface SprintTask {
  id: string;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'BLOCKED';
  assigned?: string;
  notes?: string;
}
```

**Task Brief Parsing**:

Parse `.ai/tasks/*.md` files:
```typescript
interface TaskBrief {
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
```

**Error Handling**:
- Handle 404s gracefully (file not found)
- Handle rate limits (return 429 with retry-after)
- Handle auth errors (401/403)
- Cache responses when appropriate

### Acceptance Criteria

- [ ] Octokit client configured with auth token
- [ ] All GitHub service methods implemented
- [ ] Commit message parser extracts routing headers correctly
- [ ] Status.md parser extracts sprint table data
- [ ] Task brief parser extracts all task fields
- [ ] File reading handles binary vs text correctly
- [ ] Error handling for all GitHub API errors
- [ ] Caching layer for frequently accessed files
- [ ] Unit tests for parsers
- [ ] Integration with D1-2 API endpoints

### Do NOT

- Skip error handling
- Hardcode repository names
- Skip caching (will hit rate limits)
- Parse markdown manually (use a library)

### Handoff Notes

When complete, commit with: `[AGENT:cursor] [ACTION:submit] [TASK:D1-3] GitHub integration complete`

Next tasks waiting: D1-4 (Task Lifecycle), D1-6 (Configuration)
