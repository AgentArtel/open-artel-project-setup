# Open Artel Dashboard — AI Agent Hub

The primary frontend for the Open Artel Dashboard. This is the **production codebase** (9/10 audit score), built with React + TypeScript + Vite + Tailwind + shadcn/ui.

## Ecosystem Context

This dashboard is **1 of 5 projects** in a unified agent ecosystem:

| # | Project | Role | Dashboard relationship |
|---|---------|------|----------------------|
| 1 | **open-artel-project-setup** | .ai system dev + backend | Backend lives here; dashboard reads `.ai/` data via GitHub API |
| 2 | **Even-Openclaw** | Agent communication | Dashboard will connect to OpenClaw Gateway (WS :18789) for agent CRUD, chat, skills |
| 3 | **Open-RPG** | AI-integrated RPG game | Dashboard will manage game agents; game exposes its own API |
| 4 | **open-artel-dashboad** | This dashboard (frontend) | Central hub for all agent systems |
| 5 | **artelio** | Player-facing game portal | Separate from dashboard; embeds Open-RPG for players |

See `.ai/ideas/IDEA-020-unified-ecosystem-hub.md` for the full vision, data flow map, and input/output contracts per project.

## Current Status

- **Phase 1 (D1)**: Backend API complete, frontend built, GitHub integration working, Kimi chat streaming
- **Phase 2 (D2)**: Multi-source hub — backend data source abstraction, OpenClaw/NHA/Game integrations (PENDING)
- See `.ai/status.md` for detailed task tracking

## Location

**Copy all files from the external agent's workspace into this directory:**

```
/Users/satorisan/Desktop/github/open-artel-project-setup/dashboard-frontend-external/
```

## Structure After Copying

After copying the external agent's files, this directory should contain:

```
dashboard-frontend-external/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   ├── stores/
│   ├── hooks/
│   ├── contexts/
│   ├── types/
│   └── ...
├── .env.example (or .env)
└── ...
```

## Testing Instructions

1. **Install dependencies:**
   ```bash
   cd dashboard-frontend-external
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   VITE_API_BASE_URL=http://localhost:3001
   VITE_WS_URL=ws://localhost:3001
   ```

3. **Ensure backend is running:**
   ```bash
   cd ../dashboard-backend
   npm run dev
   ```

4. **Start frontend:**
   ```bash
   cd ../dashboard-frontend-external
   npm run dev
   ```

5. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Comparison Notes

Compare this implementation with `dashboard-frontend/` to identify:
- Differences in structure
- Additional features implemented
- Code quality and patterns
- Missing dependencies or configurations
- Integration with backend API
