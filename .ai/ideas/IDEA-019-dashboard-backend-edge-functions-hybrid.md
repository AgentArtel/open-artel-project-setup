## IDEA-019: Dashboard backend — edge functions vs Node/Express vs hybrid

- **Category**: Templates / Integration
- **Origin**: session note (dashboard handoff to Lovable)
- **Status**: raw
- **Feasibility**: Needs Research
- **Owner for research**: Claude Code (when the time comes)

### Context (facts only)

- The Open Artel Dashboard has a **Node/Express/TypeScript backend** that provides:
  - REST API: projects, tasks, agents, commits, files, GitHub repos, reviews, reports, Kimi chat proxy
  - WebSocket server (Socket.io): real-time task/commit/agent updates and Kimi streaming
  - Integration with GitHub API and Moonshot/Kimi API
- The backend code lives in **open-artel-project-setup** (`dashboard-backend/`) and has been copied into the **Lovable dashboard repo** (https://github.com/AgentArtel/open-artel-dashboad) as a `backend/` folder so Lovable and the team have it as reference when wiring the frontend to data and APIs.
- In the Lovable repo, **`.lovable/plan.md`** states:
  - "Any Node.js backend code won't run in Lovable — we'll handle backend logic through Supabase or edge functions"
  - "Based on the code review, we'll decide together whether to migrate to Supabase, keep the Node backend, or use a hybrid approach"
  - Next steps include mapping current backend API calls and deciding backend strategy (Supabase, keep Node, or hybrid).

No decision has been made yet on whether the Node server will be run by Lovable, replaced by Supabase/edge functions, or used in a hybrid way.

### The Idea

When the team is ready to decide how the dashboard gets its data and real-time behavior, **research whether to**:

1. **Replace** the Node/Express backend with Supabase and/or edge functions (e.g. Supabase Edge Functions, or another provider).
2. **Keep** the Node backend for local development and/or deployment outside Lovable.
3. **Use a hybrid**: e.g. Supabase (or edge functions) for some concerns (auth, DB, real-time) and the existing Node API for others (GitHub API, Kimi proxy, custom logic), with clear boundaries and wiring.

That research should be done by **Claude Code** (deep research, no assumptions) and should inform a joint decision with the human PM and Lovable workflow.

### Why It Matters

- The frontend in the Lovable repo expects a backend (REST + WebSocket). How that backend is implemented affects deployment, secrets, and what Lovable can run natively.
- Lovable’s plan explicitly leaves the choice open (Supabase vs keep Node vs hybrid). The codebase now has the Node backend as reference; the question is whether and how to use it, or to replace/partially replace it with edge functions or Supabase.

### Open Questions (for Claude Code when the time comes)

- What does “edge functions” mean in the Lovable/Supabase context (e.g. Supabase Edge Functions, Vercel, other), and what are the constraints (runtime, cold starts, secrets, WebSocket support)?
- Can the current backend’s responsibilities be mapped 1:1 or in parts to Supabase (DB, Auth, Realtime) and edge functions (GitHub proxy, Kimi proxy, custom routes)? What would break or need rework?
- For a hybrid: which responsibilities are better in Node (e.g. long-lived WebSocket, Kimi streaming) vs Supabase/edge (e.g. CRUD, auth)? How would the frontend be configured to talk to both?
- What are the deployment and operational implications of each option (hosting Node elsewhere vs full Supabase/edge vs hybrid)?
- What does Lovable actually support today (deploy Node? only Supabase/edge? multiple backends?) — to be confirmed from Lovable docs or support, not assumed.

### What Not to Assume

- Do not assume Lovable will or will not run the Node server.
- Do not assume edge functions can or cannot replace the full Node API (e.g. WebSocket and streaming behavior need to be checked).
- Do not assume a hybrid is or isn’t feasible without mapping current endpoints and events to candidate services.
- Research should be grounded in current Lovable capabilities, Supabase/edge docs, and the existing backend’s API and WebSocket surface.

### Related

- Dashboard handoff: `docs/dashboard-development-handoff.md`
- Backend reference in Lovable repo: `backend/` in https://github.com/AgentArtel/open-artel-dashboad
- Lovable plan in that repo: `.lovable/plan.md`
