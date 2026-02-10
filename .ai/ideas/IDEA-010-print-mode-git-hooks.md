## IDEA-010: Print Mode for Git hooks automation

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Feasible
- **Roadmap Phase**: Phase 5 (Git Automation)

### The Idea

Use Kimi Code CLI's Print Mode (`--print`) in Git hooks to automate review triggers, routing decisions, and status updates.

### Why It Matters

AI-powered automation in Git workflows without manual intervention.

### Research Findings

**Post-commit hook designed** (TASK-002-research.md, Section 8):

```bash
#!/bin/bash
# .git/hooks/post-commit — parse header, route by action
COMMIT_MSG=$(git log -1 --pretty=%B)
AGENT=$(echo "$COMMIT_MSG" | grep -oP '\[AGENT:\K\w+')
ACTION=$(echo "$COMMIT_MSG" | grep -oP '\[ACTION:\K\w+')
TASK=$(echo "$COMMIT_MSG" | grep -oP '\[TASK:\K[\w-]+')

case "$ACTION" in
  submit) kimi --print -p "Review commit from $AGENT for $TASK..." ;;
  approve) kimi --print -p "Merge $AGENT/$TASK into pre-mortal..." ;;
  report) kimi --print -p "Append summary to .ai/reports/..." ;;
esac
```

**CI/CD**: GitHub Actions triggered on pushes to agent branches. Same `kimi --print` invocation.

**Quiet mode**: `kimi --quiet` for one-shot operations (commit messages, status checks).

**Print Mode**: Non-interactive, implicit `--yolo` (auto-approve all), text to stdout. Supports `--output-format=stream-json` for programmatic use. K2 at 60-100 tokens/s — review calls take seconds.

### Answers to Open Questions

- **Which hooks**: `post-commit` (primary). Also `post-merge` for status updates.
- **Automated tasks**: Review on submit, merge on approve, status update, report generation.
- **Error handling**: Hook catches exit codes. Failed calls logged; workflow continues.
- **Performance**: Seconds per call. Non-blocking for post-commit.

### Related Ideas

- IDEA-002 (routing), IDEA-003 (workflow), IDEA-011 (Wire Mode alternative)
