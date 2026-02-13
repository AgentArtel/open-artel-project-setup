# Dashboard: Separate Repo for Lovable

The Open Artel dashboard (frontend + backend) lives in this repo on the branch **cursor/concept-1-dashboard-test**. It was **not** merged to `main`. To have Lovable manage the app, create the database, and deploy, the dashboard should live in **its own GitHub repo** that you connect to Lovable.

## Current state

- **main** (and **origin/main**): Does **not** contain the dashboard. No change needed there.
- **cursor/concept-1-dashboard-test**: Contains `dashboard-frontend/`, `dashboard-backend/`, and `dashboard-frontend-external/` (reference).

## Goal

- One **new GitHub repo** (e.g. `open-artel-dashboard` or your chosen name).
- That repo is **managed by Lovable** so Lovable can:
  - Create the database (e.g. Supabase)
  - Deploy the app (e.g. Vercel / Lovable deploy)
  - Own UI/UX and iterations

## Steps

### 1. Create the new repo on GitHub

- In GitHub: **New repository** (e.g. `open-artel-dashboard`).
- Do **not** initialize with README (we’ll push existing content).

### 2. Export the dashboard into a standalone folder

From this repo root, run:

```bash
./scripts/export-dashboard-for-lovable.sh
```

This creates a sibling directory (e.g. `../open-artel-dashboard/`) with:

- `frontend/` — copy of `dashboard-frontend/` (Vite + React + TypeScript)
- `backend/` — copy of `dashboard-backend/` (Node/Express API)
- Root `README.md` and `.gitignore` so the folder is ready to be its own repo.

You can pass a custom output path, e.g.:

```bash
./scripts/export-dashboard-for-lovable.sh /path/to/open-artel-dashboard
```

### 3. Push the export to the new GitHub repo

```bash
cd /path/to/open-artel-dashboard   # or the path the script printed
git init
git add .
git commit -m "Initial dashboard: frontend + backend from open-artel-project-setup"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/open-artel-dashboard.git
git push -u origin main
```

Replace `YOUR_ORG` and repo name with your new repo URL.

### 4. Connect the new repo to Lovable

- In Lovable: create or open a project and **connect the GitHub repo** you just pushed.
- Lovable can then create the database (e.g. Supabase), configure deploy, and own the UI and deployment.

## Notes

- **Backend**: The current backend is Node/Express. Lovable often uses Supabase for DB + backend. You may later replace or adapt the Express API to Supabase (Edge Functions / REST) and point the frontend to that.
- **Which frontend**: The export uses **dashboard-frontend** (internal implementation). If you prefer the external implementation, copy `dashboard-frontend-external/app/` instead of `dashboard-frontend/` when customizing the script or manually.
- **Secrets**: After pushing, add any API keys and env vars in the new repo’s settings (or in Lovable’s env config), not in the code.
