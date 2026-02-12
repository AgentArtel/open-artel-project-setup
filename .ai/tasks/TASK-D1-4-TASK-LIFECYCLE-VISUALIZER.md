## TASK-D1-4-TASK-LIFECYCLE-VISUALIZER: Task Lifecycle Visualizer

- **Status**: PENDING
- **Assigned**: cursor
- **Priority**: P2-High
- **Type**: Create
- **Depends on**: TASK-D1-1, TASK-D1-3
- **Blocks**: none

### Context

This is the signature feature of the dashboard — a real-time, streaming visualization showing the complete lifecycle of a task from creation through completion.

### Objective

Build a task lifecycle visualizer with timeline view, streaming updates, and rich event details.

### Specifications

**Data Sources**:
- Task creation: `.ai/tasks/TASK-XXX.md` creation
- Assignment: `.ai/instructions/*.md` creation
- Commits: Git history with routing headers
- Reviews: `.ai/reviews/*.md`
- Status changes: `.ai/status.md` changes
- Conversations: `.ai/chats/*.md`

**Timeline Milestones**:
1. **Created** — Task brief created
2. **Assigned** — Agent assigned via instruction
3. **Started** — First commit with `[TASK:xxx]`
4. **In Progress** — Multiple commits, status = IN_PROGRESS
5. **Submitted** — Commit with `[ACTION:submit]`
6. **In Review** — Review file created
7. **Changes Requested** — Review with verdict
8. **Approved** — Review with APPROVED verdict
9. **Merged** — Commit to pre-mortal/main
10. **Done** — Status = DONE

**Visualization Components**:

1. **Timeline View** (horizontal scrollable):
   - Time axis with date markers
   - Milestone nodes (clickable)
   - Connection lines between milestones
   - Agent avatars at each milestone

2. **Event Cards**:
   - Commit cards: show message, files changed, routing headers
   - Review cards: verdict, comments, reviewer
   - Chat cards: agent conversation snippets
   - Status change cards: old → new status

3. **Streaming Updates**:
   - WebSocket connection for real-time events
   - Smooth animations for new events
   - Auto-scroll option to follow latest
   - Pause/resume streaming button

4. **Detail View**:
   - Expandable event details
   - Git diff preview for commits
   - Full review content
   - Related task links

**Tech Requirements**:
- Use Recharts or custom D3.js for timeline
- Framer Motion for animations
- Virtual scrolling for long timelines
- Zoom in/out on timeline

### Acceptance Criteria

- [ ] Timeline component displays task milestones horizontally
- [ ] Milestone nodes are clickable and show details
- [ ] Agent avatars displayed at each milestone
- [ ] Commit events show routing headers parsed
- [ ] Review events show verdict and feedback
- [ ] WebSocket streaming updates working (new events appear in real-time)
- [ ] Smooth animations for new events
- [ ] Detail panel shows expanded event information
- [ ] Git diff preview for commit events
- [ ] Zoom/pan controls on timeline
- [ ] Responsive design (mobile-friendly)
- [ ] Loading and empty states handled

### Do NOT

- Skip WebSocket integration (streaming is core feature)
- Use static data only (must connect to real data)
- Skip error handling for missing data
- Create performance issues (use virtualization for long timelines)

### Handoff Notes

This is the showcase feature. Focus on smooth animations and real-time updates. Test with actual task data from this repo.
