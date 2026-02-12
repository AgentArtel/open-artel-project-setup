---
name: Frontend Phase 1.1 Setup
overview: Initialize the dashboard-frontend project with Vite + React + TypeScript, configure Tailwind CSS, set up environment variables, and create the complete directory structure as outlined in the development plan.
todos:
  - id: create-project-dir
    content: Create dashboard-frontend directory and initialize Vite + React + TypeScript project
    status: pending
  - id: install-dependencies
    content: Install all required dependencies (react-router-dom, socket.io-client, zustand, lucide-react, react-markdown, tailwindcss)
    status: pending
    dependencies:
      - create-project-dir
  - id: configure-typescript
    content: Configure tsconfig.json with path aliases, strict mode, and React types
    status: pending
    dependencies:
      - create-project-dir
  - id: configure-vite
    content: Configure vite.config.ts with path aliases and React plugin
    status: pending
    dependencies:
      - create-project-dir
  - id: configure-tailwind
    content: Initialize and configure Tailwind CSS with dark mode support and custom theme colors
    status: pending
    dependencies:
      - install-dependencies
  - id: create-env-template
    content: Create .env.example with VITE_API_BASE_URL and VITE_WS_URL
    status: pending
    dependencies:
      - create-project-dir
  - id: create-directory-structure
    content: Create complete directory structure (components/, pages/, lib/, types/, contexts/, hooks/)
    status: pending
    dependencies:
      - create-project-dir
  - id: setup-app-structure
    content: Update App.tsx with basic routing structure and create type definitions placeholder
    status: pending
    dependencies:
      - create-directory-structure
  - id: validate-setup
    content: Verify dev server starts, TypeScript compiles, Tailwind works, and environment variables are accessible
    status: pending
    dependencies:
      - configure-typescript
      - configure-vite
      - configure-tailwind
      - create-env-template
isProject: false
---

# Phase

1.1: Project Setup - Implementation Plan

## Objective

Create the foundation for the Open Artel Dashboard frontend by initializing a Vite + React + TypeScript project with all necessary configuration files and directory structure.

## Steps

### 1. Create Project Directory and Initialize Vite

**Location**: Project root (`/Users/satorisan/Desktop/github/open-artel-project-setup/`)

1. Create `dashboard-frontend/` directory
2. Initialize Vite project with React + TypeScript template:
  ```bash
               cd dashboard-frontend
               npm create vite@latest . -- --template react-ts
  ```

This creates the base Vite configuration and React setup.

### 2. Install Dependencies

Install all required dependencies:

- **Core**: `react-router-dom`, `socket.io-client`, `zustand`
- **UI**: `lucide-react`, `react-markdown`
- **Styling**: `tailwindcss`, `postcss`, `autoprefixer` (dev dependencies)

```bash
npm install react-router-dom socket.io-client zustand lucide-react react-markdown
npm install -D tailwindcss postcss autoprefixer
```

### 3. Configure TypeScript

**File**: `dashboard-frontend/tsconfig.json`Update the generated `tsconfig.json` to match backend standards and Vite requirements:

- Target: ES2020 (matching backend)
- Module: ESNext (for Vite)
- Module Resolution: `bundler` (required for Vite)
- Strict mode enabled
- JSX: `react-jsx`
- Path aliases for cleaner imports (`@/` for `src/`)
- Base URL: `.` (for path resolution)

Example configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 4. Configure Vite

**File**: `dashboard-frontend/vite.config.ts`Configure Vite with:

- Path alias resolution (`@/` → `src/`)
- React plugin configuration
- Development server settings (port 5173)
- Proxy configuration for API requests (to avoid CORS issues in development)

Example configuration:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

### 5. Configure Tailwind CSS

**Files**:

- `dashboard-frontend/tailwind.config.js`
- `dashboard-frontend/postcss.config.js`

1. Initialize Tailwind: `npx tailwindcss init -p`
2. Configure `tailwind.config.js`:

- Content paths: `["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`
- Dark mode: `class` strategy
- Custom theme colors for status indicators (task status, agent status, priority)

1. Create `postcss.config.js` with Tailwind and Autoprefixer

### 6. Update CSS Entry Point

**File**: `dashboard-frontend/src/index.css`Replace default CSS with Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 7. Create Environment Variables Template

**File**: `dashboard-frontend/.env.example`Create environment variables template:

```javascript
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001
```

Note: Vite requires `VITE_` prefix for environment variables to be exposed to client code.

### 8. Update package.json Scripts

**File**: `dashboard-frontend/package.json`Ensure scripts are configured:

- `dev`: Start development server (`vite`)
- `build`: Build for production (`tsc && vite build`)
- `preview`: Preview production build (`vite preview`)
- `lint`: ESLint (if configured)

Example scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

### 9. Create Directory Structure

Create the complete directory structure from the development plan:

```javascript
dashboard-frontend/src/
├── components/
│   ├── layout/          # Header, Sidebar, Layout
│   ├── common/          # LoadingSpinner, ErrorMessage, EmptyState, Button, Card
│   ├── projects/        # Project components
│   ├── tasks/           # Task components
│   ├── agents/          # Agent components
│   ├── commits/         # Commit components
│   ├── files/           # File browser components
│   ├── kimi/            # Kimi chat components
│   └── notifications/   # Toast notifications
├── pages/               # All page components
├── lib/                 # API client, WebSocket client
├── types/               # TypeScript type definitions
├── contexts/            # React contexts (WebSocket, Theme, Notifications)
├── hooks/               # Custom React hooks
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

### 10. Create Initial Type Definitions Placeholder

**File**: `dashboard-frontend/src/types/index.ts`Create placeholder file with comment indicating types will be copied from backend in Phase 1.2:

```typescript
// Types will be copied from dashboard-backend/src/types/index.ts in Phase 1.2
export {};
```

### 11. Update App.tsx Structure

**File**: `dashboard-frontend/src/App.tsx`Create basic app structure with routing placeholder:

- Basic layout structure
- Router setup (routes will be added in Phase 3)
- Placeholder for main content area

### 12. Create .gitignore

**File**: `dashboard-frontend/.gitignore`Ensure `.gitignore` includes:

- `node_modules/`
- `.env` (but not `.env.example`)
- `dist/`
- IDE files

## Files to Create/Modify

### New Files

1. `dashboard-frontend/.env.example` - Environment variables template
2. `dashboard-frontend/src/types/index.ts` - Type definitions placeholder
3. All directory structure folders (empty initially)

### Modified Files

1. `dashboard-frontend/package.json` - Add dependencies and scripts
2. `dashboard-frontend/tsconfig.json` - Configure TypeScript
3. `dashboard-frontend/vite.config.ts` - Configure Vite with path aliases
4. `dashboard-frontend/tailwind.config.js` - Configure Tailwind
5. `dashboard-frontend/postcss.config.js` - Configure PostCSS
6. `dashboard-frontend/src/index.css` - Add Tailwind directives
7. `dashboard-frontend/src/App.tsx` - Basic app structure

## Validation Steps

After setup, verify:

1. `npm run dev` starts development server successfully
2. TypeScript compilation works (`npm run build`)
3. Tailwind CSS is working (test with a simple component)
4. Environment variables are accessible (test `import.meta.env.VITE_API_BASE_URL`)
5. Path aliases work (test `import` from `@/`)

## Dependencies Reference

**Runtime Dependencies**:

- `react` ^18.x
- `react-dom` ^18.x
- `react-router-dom` ^6.x
- `socket.io-client` ^4.x
- `zustand` ^4.x (optional, for state management)
- `lucide-react` ^latest (icons)
- `react-markdown` ^latest (markdown rendering)

**Dev Dependencies**:

- `vite` ^5.x
- `@vitejs/plugin-react` ^4.x
- `typescript` ^5.x
- `tailwindcss` ^3.x
- `postcss` ^8.x
- `autoprefixer` ^10.x

## Notes

- Vite uses `import.meta.env` instead of `process.env` for environment variables
- All environment variables must be prefixed with `VITE_` to be exposed to client
- Backend runs on port 3001, frontend on 5173 (Vite default)
- TypeScript config should match backend standards for consistency
- Directory structure matches the development plan exactly

## Next Phase

