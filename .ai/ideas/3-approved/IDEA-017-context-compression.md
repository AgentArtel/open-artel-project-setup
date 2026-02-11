## IDEA-017: Context compression for long histories

- **Category**: Kimi Integration
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Ready
- **Roadmap Phase**: Phase 4 (Kimi Overseer Agent)

### The Idea

Use Kimi Code's context compression for long-running project oversight without token bloat.

### Why It Matters

Oversight across months/years within token and cost budgets.

### Research Findings

**Built-in features**:
- **Auto-compression**: Kimi CLI compresses automatically when context grows too long.
- **`/compact`**: Manual summarization — preserves key info, reduces tokens.
- **`/clear`**: Full reset.
- **Session persistence**: Auto-save to disk. `--continue` / `--session <id>` to resume.

**API Context Caching**: Cached tokens at $0.15/1M (75% cheaper). Up to 90% savings. 256K context window.

**Overseer strategy**:
1. `/compact` between sprints (summarize previous sprint)
2. Key decisions preserved in summary
3. Detailed history in Git (`.ai/reports/`, `.ai/reviews/`) — always retrievable
4. Context caching for repeated file reads
5. Periodic session rotation for very long projects

**Budget**: 5-hour window handles 300-1,200 API calls. Sprint of 10-20 tasks well within budget.

### Answers to Open Questions

- **Strategy**: Auto-compression + manual `/compact` between sprints.
- **Preserve**: Decisions, outcomes, current state. Detail in Git.
- **Recovery**: Full detail in Git history. Nothing truly lost.
- **Performance**: Minimal. Compression once. Caching automatic, 75% savings.

### Related Ideas

- IDEA-005 (overseer needs history), IDEA-006 (benefits from compression)
