## TASK-D2-4: Game Agent Integration — Open-RPG Agent Management

- **Status**: PENDING
- **Assigned**: cursor
- **Priority**: P3-Low
- **Type**: Create
- **Depends on**: TASK-D2-1 (data source abstraction)
- **Blocks**: TASK-D2-5 (frontend project types — partial)

### Context

[Open-RPG](https://github.com/AgentArtel/Open-RPG) is an AI-integrated RPG game built with RPGJS. It has its own `.agents/` and `.ai/` directories, meaning it uses the Open Artel multi-agent workflow for development AND has in-game AI agents (NPCs, AI characters, quest systems).

The dashboard should eventually manage both:
1. **Dev agents** for Open-RPG (Claude, Cursor, etc.) — already works via GitHub source
2. **Game agents** (NPCs, AI characters) — needs a game server connection

**Current state of Open-RPG:**
- RPGJS game running on port 3000
- Has `.ai/` and `.agents/` directories (dev workflow)
- No known public API for game agent management yet

This task is **lower priority** because it depends on Open-RPG exposing an API for game agent data. The task brief defines what that API should look like so both sides can build toward it.

### Objective

1. Define the expected API contract between Open-RPG and the dashboard
2. Create a `GameAgentDataSource` stub that implements `ProjectDataSource`
3. Add game-agent-specific endpoint stubs that return "not yet connected" until Open-RPG implements its side

### Specifications

**1. Define the expected Game Server API contract:**

The Open-RPG game server should expose (via REST or WebSocket):

| Endpoint | Method | Response | Purpose |
|----------|--------|----------|---------|
| `/api/agents` | GET | `[{ name, type, status, location, ... }]` | List all game agents (NPCs, AI characters) |
| `/api/agents/:id` | GET | `{ name, type, status, location, personality, skills, ... }` | Single agent detail |
| `/api/agents/:id/chat` | POST | `{ response }` | Chat with a game agent |
| `/api/world/state` | GET | `{ players, npcs, quests, ... }` | Current world state |
| `/api/quests` | GET | `[{ id, name, status, assignedTo, ... }]` | Quest list |
| `/api/health` | GET | `{ status, players, uptime }` | Server health |

Document this contract in a markdown file so the Open-RPG team can implement it.

**2. Create `GameAgentDataSource`** (`src/services/game-datasource.ts`):

Stub implementation of `ProjectDataSource`:

```typescript
export class GameAgentDataSource implements ProjectDataSource {
  // For now, all methods return empty arrays or "not connected" errors
  // When Open-RPG implements the API, this fills in
}
```

**3. Add game-specific endpoint stubs:**

- `GET /api/projects/:projectId/game/agents` — Returns empty + status message
- `GET /api/projects/:projectId/game/world` — Returns empty + status message
- `GET /api/projects/:projectId/game/quests` — Returns empty + status message
- `GET /api/projects/:projectId/game/health` — Tries to reach game server health endpoint

**4. Register in DataSourceRegistry:**

```typescript
registry.register('game', new GameAgentDataSource());
```

**5. Create API contract doc** at `docs/game-agent-api-contract.md`:

Document what Open-RPG should expose so both teams can build toward the integration point.

### Acceptance Criteria

- [ ] `GameAgentDataSource` class implements `ProjectDataSource` (stub)
- [ ] Can create a project with `source: 'game'` and `sourceConfig.gameServerUrl`
- [ ] Game-specific endpoints exist and return appropriate "not yet connected" responses
- [ ] `docs/game-agent-api-contract.md` defines the expected API
- [ ] `GET /api/projects/:id/game/health` attempts to reach the game server
- [ ] `npm run build` succeeds with no type errors

### Do NOT

- Do NOT build the Open-RPG side of this integration (that's Open-RPG's responsibility)
- Do NOT add game logic or RPGJS dependencies to the dashboard
- Do NOT modify existing data sources
- Do NOT modify the frontend (TASK-D2-5)
- Do NOT block on Open-RPG implementing the API — build the stubs so the dashboard is ready

### Handoff Notes

[Updated by cursor when status changes]
