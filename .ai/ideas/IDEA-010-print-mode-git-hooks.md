## IDEA-010: Print Mode for Git hooks automation

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Use Kimi Code CLI's Print Mode (`--print` flag) in Git hooks to automate commit message generation, routing decisions, and other coordination tasks. Print Mode runs non-interactively with auto-approval.

### Why It Matters

Enables AI-powered automation in Git workflows without manual intervention. Git hooks can call Kimi Code CLI to generate commit messages, analyze changes, or make routing decisions.

### Open Questions

- Which Git hooks? (pre-commit? post-commit? post-merge?)
- What tasks should be automated? (commit message generation? routing? review?)
- How do we handle Print Mode errors in hooks?
- What's the performance impact? (hook timeouts?)

### Related Ideas

- IDEA-002 (routing decisions)
- IDEA-003 (workflow automation)
- IDEA-011 (Wire Mode alternative)

