## Instruction: D1-3 GitHub API Integration

**Agent**: Cursor  
**Task**: TASK-D1-3-GITHUB-INTEGRATION  
**Priority**: P1-High  
**Type**: Create  
**Depends on**: TASK-D1-2 (Backend API must be set up first)

### Objective

Implement GitHub API integration using Octokit. Create services to fetch repositories, commits, files, and parse `.ai/` directory contents. Parse commit messages for Open Artel routing headers.

### Task Reference

Full specifications: `.ai/tasks/dashboard-subtasks/TASK-D1-3-GITHUB-INTEGRATION.md`

### Step-by-Step Instructions

1. **Install Octokit**
   ```bash
   cd backend
   npm install @octokit/rest
   npm install -D @types/node
   ```

2. **Create GitHub Service** (`src/services/github.ts`)
   - Initialize Octokit client with authentication token
   - Implement repository methods:
     - `listRepositories(org?: string): Promise<Repository[]>`
     - `getRepository(owner: string, repo: string): Promise<Repository>`
   - Implement commit methods:
     - `listCommits(owner, repo, branch?): Promise<Commit[]>`
     - `getCommit(owner, repo, sha): Promise<Commit>`
     - `parseCommitMessage(message: string): ParsedCommit`
   - Implement file methods:
     - `getFileContent(owner, repo, path, ref?): Promise<string>`
     - `listDirectory(owner, repo, path): Promise<FileItem[]>`
   - Implement `.ai/` parsing methods:
     - `getStatusMd(owner, repo): Promise<StatusData>`
     - `listTasks(owner, repo): Promise<TaskBrief[]>`
     - `getTask(owner, repo, taskId): Promise<TaskBrief>`
     - `listReviews(owner, repo): Promise<Review[]>`
     - `listReports(owner, repo): Promise<Report[]>`

3. **Implement Commit Message Parser**
   - Parse Open Artel routing headers: `[AGENT:x] [ACTION:y] [TASK:z]`
   - Extract agent, action, task, and description
   - Return `ParsedCommit` interface

4. **Implement Status.md Parser**
   - Parse markdown table from `.ai/status.md`
   - Extract current focus, active sprint, backlog, recently completed
   - Return `StatusData` interface

5. **Implement Task Brief Parser**
   - Parse `.ai/tasks/*.md` files
   - Extract all task fields (id, title, status, assigned, priority, etc.)
   - Return `TaskBrief` interface

6. **Error Handling**
   - Handle 404s gracefully (file not found)
   - Handle rate limits (return 429 with retry-after)
   - Handle auth errors (401/403)
   - Implement caching layer for frequently accessed files

7. **Integration with D1-2 API Endpoints**
   - Connect GitHub service to API routes
   - Add endpoints:
     - `GET /api/projects/:owner/:repo/tasks`
     - `GET /api/projects/:owner/:repo/tasks/:taskId`
     - `GET /api/projects/:owner/:repo/tasks/:taskId/lifecycle`
     - `GET /api/projects/:owner/:repo/commits`
     - `GET /api/projects/:owner/:repo/files/:path*`

8. **Unit Tests**
   - Test commit message parser with various formats
   - Test status.md parser with sample data
   - Test task brief parser with sample files
   - Test error handling

### Acceptance Criteria (Must Verify)

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
- Parse markdown manually (use a library like `marked` or `remark`)

### Commit Format

When submitting work:
```
[AGENT:cursor] [ACTION:submit] [TASK:D1-3] GitHub integration complete
```

### Handoff Notes

After completion:
1. Backend API (D1-2) must be functional
2. Frontend team (Lovable) will use these endpoints for D1-4 and D1-6
3. Ensure rate limiting is handled properly
4. Cache responses to avoid hitting GitHub API limits

