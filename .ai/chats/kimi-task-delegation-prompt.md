# Kimi Task Delegation Prompt

**Date**: 2026-02-10
**Task**: TASK-CONCEPT-1-DASHBOARD

## Instructions for Kimi Overseer

You have been assigned **TASK-CONCEPT-1-DASHBOARD: Open Artel Dashboard — Central Hub**.

### What to Do

1. **Read the task brief**: `.ai/tasks/TASK-CONCEPT-1-DASHBOARD.md`
2. **Read the instruction**: `.ai/instructions/TASK-CONCEPT-1-DASHBOARD-delegate.md`
3. **Read the plan**: `.cursor/plans/concept_1_open_artel_dashboard_ebdb6620.plan.md`

### Your Mission

1. **Decompose the task**: Break this large project into smaller, manageable sub-tasks following the task decomposition pattern
2. **Use Agent Swarm**: Create specialized subagents for parallel development:
   - Frontend team (React/TypeScript/Vite/Tailwind)
   - Backend team (Node.js/Express/WebSocket)
   - Testing team (test automation)
   - Documentation team (setup/usage guides)
3. **Coordinate with Cursor**: Work with Cursor agent for implementation
4. **Test incrementally**: Test each feature as it's built
5. **Deploy swarm**: Use the Agent Swarm pattern to parallelize work

### Expected Workflow

1. Create sub-tasks in `.ai/tasks/` for each major component
2. Create subagents using `CreateSubagent` tool for parallel work
3. Coordinate with Cursor via commits and instructions
4. Test as you build
5. Document decisions and patterns

### Success Criteria

All acceptance criteria in the task brief must be met. The project should be deployable and fully functional.

**Begin work immediately.** Use your tools to read the files, decompose the task, and start coordinating with Cursor.

