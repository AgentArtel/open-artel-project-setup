## IDEA-023: Cross-agent API bridge (Kimi API inside Claude Code)

- **Category**: Agent System
- **Origin**: Cursor analysis (Feature 18)
- **Status**: researched
- **Feasibility**: Feasible
- **Roadmap Phase**: Phase 5 (Print Mode Automation)

### The Idea

Use the Moonshot/Kimi API directly from within Claude Code sessions, giving Claude access to Kimi's capabilities. A lightweight bridge script enables one agent to query another's underlying model for a different perspective.

### Why It Matters

Different models have different strengths. Claude excels at careful reasoning and code quality. K2/K2.5 excels at massive tool-call chains and cheap bulk processing. A bridge lets each agent tap the other's strengths without breaking the Git-based communication model.

### Design (from Cursor analysis)

**Bridge script** (`.ai/tools/kimi-query.sh`):
```bash
#!/bin/bash
curl -s https://api.moonshot.ai/v1/chat/completions \
  -H "Authorization: Bearer $MOONSHOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"kimi-k2-0905-chat\",\"messages\":[{\"role\":\"user\",\"content\":\"$1\"}]}"
```

**Usage from Claude Code**: Claude's Shell tool calls the bridge when it needs Kimi's perspective:
```bash
# Claude Code is implementing, gets stuck, queries K2 for alternative approach
.ai/tools/kimi-query.sh "Given this React component structure, suggest a different state management approach..."
```

**Moonshot API compatibility**: OpenAI-compatible at `https://api.moonshot.ai/v1`. Any HTTP client works. K2 at $0.60/M input tokens makes queries cheap.

### Use Cases

1. **Second opinion**: Claude Code queries K2 when uncertain about architecture decisions
2. **Bulk analysis**: Claude delegates large-scale code scanning to K2 (cheaper for high-volume)
3. **Tool-call chains**: K2 handles 200-300 sequential tool calls — useful for complex refactoring
4. **K2.5 Agent Swarm**: Dispatch 100 parallel sub-agents for massive codebase analysis

### Security Considerations

- API key stored in environment variable, not in committed files
- Bridge script should validate/sanitize input to prevent injection
- Rate limiting to prevent runaway costs
- Response validation before Claude acts on Kimi's suggestions

### Open Questions

- Latency: is synchronous API call acceptable, or should this be async?
- Should the bridge be bidirectional (Kimi can also query Claude API)?
- Cost governance: who approves expensive K2.5 Agent Swarm calls?

### Cross-reference: Cursor Features

- Cursor F18 (Kimi Code API inside Claude Code) — primary source

### Related Ideas

- IDEA-022 (agent tool integrations), IDEA-024 (K2/K2.5 exploitation)
- IDEA-005 (Kimi overseer could use bridge to query Claude's reasoning)
