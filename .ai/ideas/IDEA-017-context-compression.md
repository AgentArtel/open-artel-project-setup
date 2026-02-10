## IDEA-017: Context compression for long histories

- **Category**: Kimi Integration
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Use Kimi Code's context compression and summarization features to maintain long project histories without token bloat. The persistent overseer can compress old conversations while preserving key information.

### Why It Matters

Enables long-running project oversight without hitting token limits. The overseer can remember project history across months or years while staying within budget.

### Open Questions

- What compression strategy? (automatic? manual `/compact` command?)
- What information should be preserved? (key decisions? task outcomes? errors?)
- How do we handle compression loss? (can we recover details if needed?)
- What's the performance impact? (compression time? token savings?)

### Related Ideas

- IDEA-005 (overseer needs long history)
- IDEA-006 (terminal connection benefits from compression)

