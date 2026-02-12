## TASK-D1-3-GITHUB-INTEGRATION: GitHub API Integration

- **Status**: PENDING
- **Assigned**: cursor
- **Priority**: P2-High
- **Type**: Create
- **Depends on**: TASK-D1-1, TASK-D1-2
- **Blocks**: TASK-D1-4, TASK-D1-6

### Context

The dashboard needs to fetch data from GitHub repositories, including repository info, commits, branches, and the contents of `.ai/` files. This can be implemented in the frontend (using GitHub API directly) or backend (recommended for security).

### Objective

Implement GitHub API integration for fetching repository data and parsing Open Artel specific files.

### Specifications

**GitHub API Client Features**:
- Authentication via Personal Access Token (PAT) or OAuth
- List repositories (filter by topic or name pattern)
- Get repository details (name, description, default branch, last updated)
- List commits with pagination
- Get commit details (message, author, date, files changed)
- Read file contents via Contents API
- Parse commit messages for routing headers (`[AGENT:x] [ACTION:y] [TASK:z]`)

**Data Parsing**:
1. **`.ai/status.md` Parser**:
   - Extract sprint name/status
   - Parse Active Sprint table (Task ID, Title, Status, Assigned, Priority)
   - Parse Backlog table
   - Parse Blocked Tasks table
   - Parse Completed table

2. **`.ai/tasks/*.md` Parser**:
   - Parse task ID, status, assigned, priority
   - Extract objective, specifications
   - Parse acceptance criteria (checkbox items)
   - Extract "Do NOT" section
   - Parse "Depends on" and "Blocks"

3. **`.ai/reviews/*.md` Parser**:
   - Parse review verdict (APPROVED/CHANGES_REQUESTED/REJECTED)
   - Extract review comments
   - Link to original task

4. **`.ai/reports/*.md` Parser**:
   - Parse sprint summary reports
   - Extract metrics and completion data

5. **Commit Parser**:
   - Extract routing headers: `[AGENT:x]`, `[ACTION:y]`, `[TASK:z]`
   - Parse commit message body
   - Extract changed files

**Caching Strategy**:
- Cache GitHub API responses (ETag-based if possible)
- Refresh interval: 30 seconds for active projects
- Implement stale-while-revalidate pattern

### Acceptance Criteria

- [ ] GitHub API client implemented (frontend service OR backend service)
- [ ] Authentication flow working (token or OAuth)
- [ ] List repositories endpoint/page working
- [ ] Get commit history with pagination
- [ ] Parse commit messages for routing headers (`[AGENT:x] [ACTION:y] [TASK:z]`)
- [ ] Read `.ai/status.md` and parse sprint tables
- [ ] Read `.ai/tasks/*.md` and parse task briefs
- [ ] Read `.ai/reviews/*.md` and parse reviews
- [ ] Read `.ai/reports/*.md` and parse reports
- [ ] Error handling for rate limits, 404s, auth failures
- [ ] Loading states implemented
- [ ] Type definitions for all GitHub/data types

### Do NOT

- Hardcode GitHub tokens in code
- Skip error handling for API failures
- Ignore GitHub rate limits (implement backoff)
- Skip loading states (users need feedback)

### Handoff Notes

This task is critical for the Project Dashboard and Task Pipeline views. Ensure the parsers are robust against varying markdown formats.
