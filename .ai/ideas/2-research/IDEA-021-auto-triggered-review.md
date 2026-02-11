## IDEA-021: Auto-triggered review pipeline

- **Category**: Automation
- **Origin**: Cursor analysis (Feature 3)
- **Status**: researched
- **Feasibility**: Feasible
- **Roadmap Phase**: Phase 3 (Flow Skills)

### The Idea

When an agent commits work, a review process is automatically triggered — no human has to remember to request it. The `post-commit` hook detects review-request headers and dispatches a reviewer agent.

### Why It Matters

Manual review requests are the biggest bottleneck in multi-agent workflows. Auto-triggering turns the pipeline from "human pushes each step" to "agents pull the next agent forward."

### Design (from Cursor analysis)

**Trigger flow**:
1. `post-commit` hook detects `[ACTION:submit]` or `[TO:reviewer]` header
2. Hook writes a review task file to `.ai/channels/submissions/`
3. Hook invokes the reviewer agent (Kimi Code or Claude Code in `--print` mode)
4. Reviewer reads the diff (`git diff main..coder/task-42`), writes review to channel
5. Reviewer commits review with `[TO:coder][ACTION:feedback]` or `[TO:overseer][ACTION:approve]`

**Invocation** (Kimi Print Mode):
```bash
kimi --print -p "Review the diff in this branch against main. Write your review to .ai/channels/reviews/"
```

**Review package** (auto-generated on submit):
- Diff summary (files changed, insertions, deletions)
- Test results (from pre-commit or CI)
- Task requirements (copied from assignment in `.ai/channels/instructions/`)
- Self-assessment from the coder agent

**Loop handling**: If review rejects, reviewer commits feedback with `[TO:coder]`. Coder picks up, fixes, re-submits. Loop continues until approval or escalation.

### Dependencies

- IDEA-002 (commit routing provides the header format)
- IDEA-004 (channels provide the file-based communication)
- IDEA-010 (Print Mode enables non-interactive invocation)

### Open Questions

- What prevents infinite review loops? (Max iterations before escalation?)
- Should the hook block until review completes, or fire-and-forget?
- How to handle reviews that need human judgment (security, architecture)?

### Cross-reference: Cursor Features

- Cursor F3 (auto-triggered review on commit) — primary source
- Cursor F12 (structured review submission) — folded into IDEA-004

### Related Ideas

- IDEA-002 (commit routing), IDEA-004 (channels), IDEA-010 (Print Mode)
- IDEA-018 (approval workflow for human-required reviews)
- IDEA-019 (sprint pipeline integrates review as a task lifecycle stage)
