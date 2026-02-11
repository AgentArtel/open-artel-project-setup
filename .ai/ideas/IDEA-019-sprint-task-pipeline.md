## IDEA-019: Sprint-based task pipeline

- **Category**: Project Management
- **Origin**: Cursor analysis (Feature 6)
- **Status**: researched
- **Feasibility**: Feasible
- **Roadmap Phase**: Phase 2 (Agent Skills)

### The Idea

Organize work into sprints with defined goals. The overseer breaks sprints into tasks, assigns them to agents, and tracks completion through the pipeline until the sprint is done. A lifecycle engine on top of the branch workflow.

### Why It Matters

Without a sprint structure, branch workflow and commit routing are just plumbing. Sprint pipeline gives the system a heartbeat — plan, execute, review, ship, repeat.

### Design (from Cursor analysis)

**Sprint definition** (`.ai/sprints/current.yaml`):
```yaml
sprint: 3
goal: "Add user authentication system"
status: active
tasks:
  - id: 42
    title: "JWT middleware + user model"
    agent: coder
    branch: coder/task-42
    status: in_progress
    depends_on: []
  - id: 43
    title: "Login/register UI components"
    agent: coder
    branch: coder/task-43
    status: pending
    depends_on: [42]
  - id: 44
    title: "Integration tests for auth flow"
    agent: coder
    branch: coder/task-44
    status: pending
    depends_on: [42, 43]
```

**Task lifecycle**: `pending` → `assigned` → `in_progress` → `review` → `complete`

**Sprint lifecycle**: Overseer creates sprint → assigns tasks → monitors progress → detects completion → merges to main → creates next sprint.

**Kimi integration**: Kimi's `SetTodoList` tool natively tracks items with `pending`, `in_progress`, `done` statuses — maps directly to sprint task tracking.

**Dependency management**: Tasks declare `depends_on` array. Overseer only assigns tasks whose dependencies are `complete`.

### How It Differs from Existing Ideas

- IDEA-001 (branch workflow) defines *where* work happens
- IDEA-002 (commit routing) defines *how* work moves
- **This idea** defines *what* work gets done and *in what order*

### Open Questions

- Sprint duration: fixed timeboxes or flow-based (sprint ends when all tasks complete)?
- How does the overseer handle tasks that are larger than expected?
- Integration with IDEA-013 metrics: auto-generate sprint retrospective?

### Cross-reference: Cursor Features

- Cursor F6 (sprint-based task pipeline) — primary source

### Related Ideas

- IDEA-001 (branch workflow), IDEA-002 (commit routing), IDEA-005 (overseer manages sprints)
- IDEA-013 (evaluation tracks sprint-level metrics)
- IDEA-020 (.ai/ folder stores sprint definitions)
