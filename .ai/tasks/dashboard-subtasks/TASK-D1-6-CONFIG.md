## TASK-CONCEPT-1-DASHBOARD-D1-6-CONFIG: Project Configuration & Auth

- **Status**: PENDING
- **Assigned**: (to be assigned)
- **Priority**: P1-High
- **Type**: Create
- **Depends on**: TASK-CONCEPT-1-DASHBOARD-D1-1-SETUP
- **Blocks**: TASK-CONCEPT-1-DASHBOARD-D1-3-GITHUB

### Context

Part of the Open Artel Dashboard project. This task handles project configuration, authentication, and settings management.

### Objective

Implement project configuration and authentication system:
1. Project selection and management
2. GitHub OAuth authentication
3. API key management (secure)
4. Settings persistence
5. Local project support

### Specifications

**Frontend Components**:
- `pages/Settings.tsx` - Settings page
- `components/config/ProjectSelector.tsx` - Project dropdown/selector
- `components/config/AuthButton.tsx` - GitHub auth button
- `components/config/ApiKeyInput.tsx` - Secure API key input
- `components/config/ConfigPanel.tsx` - Configuration panel

**Hooks**:
- `hooks/useAuth.ts` - Authentication state
- `hooks/useConfig.ts` - Configuration management
- `hooks/useLocalStorage.ts` - Local storage hook

**Services**:
- `services/auth.ts` - Authentication service
- `services/config.ts` - Configuration service

**Stores**:
- `stores/projectStore.ts` - Project state
- `stores/authStore.ts` - Auth state

**Backend** (if using):
- GitHub OAuth flow
- API key storage (encrypted)
- Session management

**Features**:
- **Project Selection**:
  - List GitHub repos (manually configured or auto-discovered)
  - Filter by Open Artel projects
  - Add/remove projects
  - Local project support (file system access)
  
- **Authentication**:
  - GitHub OAuth for API access
  - Token storage (secure)
  - Session management
  
- **API Key Management**:
  - Kimi API key (stored in backend only)
  - GitHub token management
  - Secure storage (never exposed to frontend)
  
- **Settings**:
  - Theme preferences
  - Notification settings
  - Default views
  - Data refresh intervals

**Data Models**:
```typescript
interface Project {
  id: string;
  name: string;
  fullName: string; // owner/repo
  url: string;
  isLocal: boolean;
  localPath?: string;
  settings: ProjectSettings;
}

interface ProjectSettings {
  refreshInterval: number;
  defaultView: string;
  notifications: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  token: string | null;
}
```

### Acceptance Criteria

- [ ] Project selector UI implemented
- [ ] GitHub OAuth flow working
- [ ] Authenticated user can access GitHub API
- [ ] API keys stored securely (backend only)
- [ ] Settings persist across sessions
- [ ] Local project support (file picker)
- [ ] Projects can be added/removed
- [ ] Settings page with all options
- [ ] Logout functionality
- [ ] Error handling for auth failures

### Do NOT

- Store API keys in frontend code
- Send API keys over unencrypted connections
- Store sensitive tokens in localStorage (use httpOnly cookies)

### Handoff Notes

- GitHub OAuth requires registered app
- Backend should handle token refresh
- Consider multi-user scenarios
