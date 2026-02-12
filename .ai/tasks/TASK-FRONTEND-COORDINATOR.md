## TASK-FRONTEND-COORDINATOR: Create Frontend Coordination Subagent

- **Status**: PENDING
- **Assigned**: claude-code
- **Priority**: P1-High
- **Type**: Create
- **Depends on**: none
- **Blocks**: none

### Context

The project needs a specialized subagent to coordinate frontend development work across multiple agents and tools:

- **User** (Human PM) — provides requirements and design direction
- **External Website Agent** — [SPECIFY: e.g., v0.dev, Cursor Composer, etc.] — generates UI components and designs
- **Cursor** (Implementation Specialist) — implements frontend code, integrates components
- **Kimi Overseer** — project coordinator, manages sprints and task assignments
- **Agent Swarms** — dynamic subagents created for specialized tasks (debugger, performance, docs, etc.)

Currently, frontend work can become fragmented when multiple agents touch UI components simultaneously, or when external tools generate code that needs integration. There is no single coordination point to:
- Track which agent is working on which UI component
- Ensure design consistency across external tool outputs and internal implementations
- Coordinate API integration between frontend and backend
- Manage frontend task dependencies and sequencing
- Review frontend changes for consistency and quality

### Objective

Create a predefined subagent (`.agents/frontend-coordinator-sub.yaml`) that:

1. **Coordinates frontend work** across all agents and external tools
2. **Tracks UI component ownership** — who is working on what, when
3. **Ensures design consistency** — validates external tool outputs match project standards
4. **Manages frontend dependencies** — sequences tasks to avoid conflicts
5. **Reviews frontend changes** — checks for integration issues, API contract compliance, accessibility
6. **Facilitates handoffs** — smooth transitions between external tools → Cursor → review → merge

The subagent should be dispatchable by the Kimi Overseer via the `Task` tool, similar to how `reviewer` and `researcher` subagents work.

### Specifications

#### 1. Create Subagent Definition

**File**: `.agents/frontend-coordinator-sub.yaml`

**Structure** (follow `reviewer-sub.yaml` pattern):
- Standalone subagent (no `extend` to avoid circular references)
- Uses `system_prompt_path: ./prompts/overseer.md` with `ROLE_ADDITIONAL` for frontend-specific instructions
- Tools needed:
  - File operations: `ReadFile`, `WriteFile`, `StrReplaceFile`, `Glob`, `Grep`
  - Shell: `Shell` (for git, npm, build commands)
  - Web: `FetchURL` (to check external tool outputs, API endpoints)
  - Research: `SearchWeb` (for component libraries, best practices)
  - Communication: `SendDMail` (for async coordination checkpoints)
  - Planning: `Think`, `SetTodoList`

#### 2. System Prompt Content

**ROLE_ADDITIONAL section should define**:

- **Mission**: Coordinate frontend development across multiple agents and external tools
- **Key Responsibilities**:
  - Track UI component ownership and work-in-progress status
  - Validate external tool outputs (design consistency, code quality, project standards)
  - Coordinate API integration (ensure frontend calls match backend contracts)
  - Sequence frontend tasks to prevent conflicts
  - Review frontend changes for accessibility, performance, consistency
  - Facilitate handoffs between agents (external tool → Cursor → review → merge)
- **Coordination Workflow**:
  1. When external tool generates UI → validate against project standards → assign to Cursor for integration
  2. When Cursor implements frontend → check API contracts → verify accessibility → coordinate with backend
  3. When multiple agents touch same component → detect conflicts → sequence work → prevent overwrites
  4. When frontend task completes → review integration → check for regressions → approve for merge
- **Output Format**: Use structured reports in `.ai/reports/frontend-coordination-<date>.md`

#### 3. Integration Points

- **Kimi Overseer**: Add `frontend-coordinator` to `subagents:` section in `.agents/kimi-overseer.yaml`
- **Skills**: Reference existing skills (`boundary-enforcement`, `code-review`) and document when to use frontend-coordinator vs reviewer
- **Documentation**: Update `docs/cursor-kimi-integration.md` with frontend coordination workflow

#### 4. External Agent Integration

**Define how to interact with external website agent**:
- [SPECIFY: How does the external agent communicate? (API, file outputs, chat, etc.)]
- [SPECIFY: What format does it produce? (React components, HTML/CSS, design specs, etc.)]
- [SPECIFY: What validation is needed? (design system compliance, accessibility, code quality, etc.)]

**Example patterns** (to be customized):
- If external agent produces React components → validate props, check for project conventions, ensure TypeScript types match
- If external agent produces design specs → validate against project design system, check accessibility requirements
- If external agent produces HTML/CSS → validate semantic HTML, check CSS naming conventions, ensure responsive design

#### 5. Coordination Value

**Primary goals** (to be specified by user):
- [SPECIFY: What specific value should this coordination provide?]
  - Example: "Ensure UI components from external tool match our design system and integrate seamlessly with existing codebase"
  - Example: "Prevent conflicts when multiple agents modify the same component simultaneously"
  - Example: "Coordinate API integration so frontend calls match backend contracts before merge"

### Acceptance Criteria

- [ ] `.agents/frontend-coordinator-sub.yaml` created with correct structure (no circular extends)
- [ ] Subagent has appropriate tools for frontend coordination (file ops, shell, web, communication)
- [ ] System prompt defines clear mission, responsibilities, and coordination workflow
- [ ] Subagent added to `.agents/kimi-overseer.yaml` `subagents:` section
- [ ] Documentation updated (`docs/cursor-kimi-integration.md` or new `docs/frontend-coordination.md`)
- [ ] Test: Kimi Overseer can dispatch frontend-coordinator via `Task` tool
- [ ] Test: Frontend-coordinator can read task briefs, track component ownership, produce coordination reports
- [ ] External agent integration patterns documented (even if placeholder for now)
- [ ] No regressions: existing subagents (reviewer, researcher) still work

### Do NOT

- Do not create a new main agent role (this is a subagent, not a peer to Claude Code/Cursor/Lovable)
- Do not modify existing subagents (reviewer, researcher) — this is additive
- Do not hardcode external agent specifics — use configurable patterns that can be customized
- Do not create circular dependencies (do not extend `kimi-overseer.yaml`)

### Handoff Notes

[To be filled by assigned agent]

### Notes for Implementation

1. **Follow existing patterns**: Study `reviewer-sub.yaml` and `researcher-sub.yaml` for structure
2. **Standalone design**: Like reviewer/researcher, this subagent should NOT extend `kimi-overseer.yaml` to avoid circular references
3. **Skills integration**: Reference existing skills (e.g., `/skill:code-review` for review aspects, `/skill:boundary-enforcement` for file ownership)
4. **Coordination vs Review**: Frontend-coordinator focuses on *coordination* (sequencing, handoffs, integration) while reviewer focuses on *code quality* (boundaries, acceptance criteria). They complement each other.
5. **External agent placeholder**: The brief includes `[SPECIFY]` placeholders for external agent details. These should be filled based on user's actual external tool, or left as configurable patterns if multiple tools are used.
