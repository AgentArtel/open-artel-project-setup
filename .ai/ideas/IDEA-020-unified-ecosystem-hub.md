## IDEA-020: Unified Ecosystem Hub — Dashboard as Multi-Project Agent Hub

- **Category**: Agent Architecture / Integration
- **Origin**: human direction (2026-02-11)
- **Status**: explored
- **Feasibility**: Feasible (incremental)
- **Roadmap Phase**: Dashboard Phase 2

### The Idea

The Open Artel Dashboard is not just a dev project monitor — it is the **central AI agent hub** for a unified five-project ecosystem. Each project has a distinct role, defined inputs, and defined outputs. The dashboard connects to all of them, aggregating agent activity, status, and communication into one place.

### The Five Projects

| # | Repo | Role | One-liner |
|---|------|------|-----------|
| 1 | [open-artel-project-setup](https://github.com/AgentArtel/open-artel-project-setup) | .ai system development | Build and evolve the multi-agent coordination system (starter kits, templates, scripts, conventions). The dashboard backend lives here. |
| 2 | [Even-Openclaw](https://github.com/AgentArtel/Even-Openclaw) | Agent communication layer | Build methods to communicate with AI agent systems — OpenClaw Gateway API, eveng1 channel plugin, agent CRUD, streaming chat, skills management. |
| 3 | [Open-RPG](https://github.com/AgentArtel/Open-RPG) | AI-integrated RPG game | The game itself (RPGJS). Has its own `.ai/` and `.agents/` for both dev agents and in-game AI agents. |
| 4 | [open-artel-dashboad](https://github.com/AgentArtel/open-artel-dashboad) | AI Agent Hub (frontend) | The central dashboard — one place to manage dev teams, agent systems, and game agents. |
| 5 | [artelio](https://github.com/AgentArtel/artelio) | Player-facing game portal | Where human or AI players visit to enter the game (Open-RPG embedded in iframe). Separate from the dashboard. |

### Data Flow: Inputs and Outputs

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    OPEN ARTEL DASHBOARD (Hub)                           │
│                                                                         │
│  Consumes FROM:                        Provides TO:                     │
│  ─────────────                         ───────────                      │
│  • GitHub API (any .ai/ repo)          • Unified agent roster view      │
│  • OpenClaw Gateway (WS :18789)        • Cross-project activity feed    │
│  • NHA REST API                        • Agent chat (Kimi, OpenClaw)    │
│  • Open-RPG game server                • Task/sprint management view    │
│  • Local git repos                     • Health monitoring across all   │
│                                                                         │
└──────────┬──────────┬──────────┬──────────┬──────────┬─────────────────┘
           │          │          │          │          │
           ▼          ▼          ▼          ▼          ▼

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ project-setup│ │ Even-Openclaw│ │   Open-RPG   │ │   artelio    │ │     NHA      │
│              │ │              │ │              │ │              │ │              │
│ OUTPUTS:     │ │ OUTPUTS:     │ │ OUTPUTS:     │ │ OUTPUTS:     │ │ OUTPUTS:     │
│ • .ai/ data  │ │ • Gateway API│ │ • Game state │ │ • Player     │ │ • Legion X   │
│   via GitHub │ │   (WS :18789)│ │ • NPC/agent  │ │   sessions   │ │   sessions   │
│ • Commit     │ │ • Agent CRUD │ │   status     │ │ • Iframe     │ │ • Geth       │
│   history    │ │ • Chat stream│ │ • Quest data │ │   embed of   │ │   consensus  │
│ • Task briefs│ │ • Skills API │ │ • .ai/ data  │ │   Open-RPG   │ │ • 42 agent   │
│ • Reviews    │ │ • Session    │ │   via GitHub │ │              │ │   results    │
│ • Reports    │ │   management │ │              │ │ INPUTS:      │ │ • Agent      │
│              │ │              │ │ INPUTS:      │ │ • Open-RPG   │ │   performance│
│ INPUTS:      │ │ INPUTS:      │ │ • Player     │ │   game URL   │ │              │
│ • Templates  │ │ • Agent defs │ │   actions    │ │              │ │ INPUTS:      │
│ • Config     │ │ • LLM keys   │ │ • AI agent   │ └──────────────┘ │ • LLM API    │
│   from human │ │ • Device     │ │   decisions  │                   │   key        │
│              │ │   connections│ │ • Dashboard   │                   │ • Task       │
└──────────────┘ │   (G1, phone)│ │   commands   │                   │   prompts    │
                 └──────────────┘ └──────────────┘                   └──────────────┘
```

### Per-Project: Expected Inputs → Dashboard, Expected Outputs ← Dashboard

#### 1. open-artel-project-setup → Dashboard

| Direction | Data | Transport | Already Built? |
|-----------|------|-----------|----------------|
| **IN** (project → dashboard) | Tasks, status, commits, files, reviews, reports | GitHub REST API | Yes |
| **IN** | Agent status (from `.ai/status.md`) | GitHub REST API | Yes |
| **IN** | Kimi chat responses | Moonshot API (proxied) | Yes |
| **OUT** (dashboard → project) | — (read-only today) | — | — |

#### 2. Even-Openclaw → Dashboard

| Direction | Data | Transport | Already Built? |
|-----------|------|-----------|----------------|
| **IN** | .ai/ tasks, commits, reviews | GitHub REST API | Yes (same as any GitHub project) |
| **IN** | Agent list, status, skills | OpenClaw Gateway WS (port 18789) | **No** |
| **IN** | Chat with any OpenClaw agent | OpenClaw Gateway WS (`chat.send` streaming) | **No** |
| **IN** | Session list | OpenClaw Gateway WS (`sessions.list`) | **No** |
| **OUT** | Agent CRUD commands | OpenClaw Gateway WS (`agents.create/update/delete`) | **No** |
| **OUT** | Skill install/update | OpenClaw Gateway WS (`skills.install/update`) | **No** |

#### 3. Open-RPG → Dashboard

| Direction | Data | Transport | Already Built? |
|-----------|------|-----------|----------------|
| **IN** | .ai/ tasks, commits (dev workflow) | GitHub REST API | Yes (same as any GitHub project) |
| **IN** | Game agent status (NPCs, AI characters) | Game server WS or REST | **No** (needs Open-RPG API) |
| **IN** | Quest/world state | Game server WS or REST | **No** |
| **OUT** | Game agent commands | Game server WS or REST | **No** |

#### 4. artelio → Dashboard

| Direction | Data | Transport | Already Built? |
|-----------|------|-----------|----------------|
| **IN** | Player session count, health status | REST API (if artelio exposes one) | **No** |
| **OUT** | — (artelio is player-facing, dashboard is operator-facing) | — | — |

Artelio is the **least integrated** project. The dashboard may only need a health status link, not deep integration.

#### 5. NHA (NotHumanAllowed) → Dashboard

| Direction | Data | Transport | Already Built? |
|-----------|------|-----------|----------------|
| **IN** | Legion X session results | NHA REST API (`/geth/sessions/:id`) | **No** |
| **IN** | Agent performance, Geth consensus | NHA REST API (`/legion/agents`) | **No** |
| **IN** | PIF agent activity | NHA REST API (`/feed`) | **No** |
| **OUT** | Task submission | NHA REST API (`/legion/run`) | **No** |

### Implementation Priority

1. **Backend data source abstraction** — Decouple from GitHub-only; add `source` discriminator to Project type
2. **OpenClaw Gateway integration** — Highest value, API already exists (Even-Openclaw)
3. **Frontend project type awareness** — UI adapts per source type
4. **NHA integration** — REST API available at nothumanallowed.com
5. **Game agent integration** — Depends on Open-RPG exposing an API
6. **Cross-project views** — Unified activity feed, agent roster, health dashboard

### Why It Matters

Without this vision, the dashboard stays a GitHub-only `.ai/` viewer. With it, the dashboard becomes the **single pane of glass** for the entire agent ecosystem — dev teams, communication layer, game agents, and external agent platforms — all in one place.

### Open Questions

- What auth model for OpenClaw Gateway connections from the dashboard? (scopes: `operator.read`, `operator.write`, `operator.admin`)
- Should NHA integration use the user's existing NHA agent identity (Ed25519 key) or a separate dashboard service identity?
- What API does Open-RPG need to expose for game agent management? (RPGJS may need a custom plugin)
- Should artelio have any dashboard integration beyond a health check link?
- How to handle cross-project agent identity? (e.g., a Kimi agent appears in both project-setup and Even-Openclaw)

### Related Ideas

- IDEA-015 (mono-repo coordination — cross-project `.ai/` visibility)
- IDEA-014 (project templates — different templates for different project types)
- IDEA-019 (dashboard backend architecture — relevant to adding data sources)
