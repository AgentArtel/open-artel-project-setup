# Functionality Audit Report

## Summary of Issues Found

### 🔴 CRITICAL ISSUES (Must Fix)

#### 1. Theme Changer Does NOT Work
**Location:** `src/pages/SettingsPage.tsx` (Appearance tab)

**Problem:** The theme selector in Settings only updates the settings store (`settings.updateTheme()`), but doesn't actually apply the theme to the application. The actual theme is controlled by `next-themes` via `useTheme()`, which is not being used in the SettingsPage.

**Current Behavior:** Clicking Light/Dark/System in Settings updates the store but doesn't change the UI theme.

**Fix Required:** Sync the settings store theme with `next-themes` using `useTheme()` hook.

---

#### 2. API Keys Never Sent to Backend
**Location:** `src/stores/settingsStore.ts`, `src/lib/api.ts`

**Problem:** GitHub Token and Kimi API Key are stored in localStorage but are NEVER sent to the backend API. The backend needs these tokens to make authenticated requests to GitHub/Kimi APIs.

**Current Behavior:** Keys are saved locally but API requests are made without authentication headers.

**Fix Required:** Add API keys to request headers or send them in the request body where needed.

---

#### 3. WebSocket URL Change Doesn't Reconnect
**Location:** `src/pages/SettingsPage.tsx` (saveConnectionSettings)

**Problem:** When the WebSocket URL is changed and saved, the socket doesn't reconnect to the new URL. The `saveConnectionSettings` function closes and reopens the socket, but the socket is initialized before the new settings are saved.

**Current Behavior:** URL changes but connection stays on old URL until page refresh.

**Fix Required:** Save settings first, then reinitialize WebSocket with new URL.

---

### 🟡 HIGH PRIORITY ISSUES

#### 4. Project Creation Form Incomplete
**Location:** `src/pages/Dashboard.tsx`

**Problem:** The "Add Project" form only collects `owner` and `repo`, but the backend supports:
- `url` - Custom repository URL
- `isLocal` - Flag for local repositories
- `localPath` - Path to local repository
- `settings` - Project settings (refresh interval, default view, notifications)

**Current Behavior:** All projects are created with default settings only.

**Fix Required:** Expand the form to include all supported fields.

---

#### 5. Settings Form Values Not Synced on Mount
**Location:** `src/pages/SettingsPage.tsx`

**Problem:** The form uses local state initialized from settings store. If settings are changed elsewhere (or in another tab), the form shows stale values when reopened.

**Current Behavior:** Form shows values from when component first mounted.

**Fix Required:** Sync form values with store whenever the settings tab becomes active.

---

#### 6. Health Check Status Not Persisted
**Location:** `src/App.tsx`

**Problem:** The health check runs on mount and every 30 seconds, but if the backend is down on initial load, the user sees no indication until the check completes.

**Current Behavior:** "Unknown" status shown initially even if backend was previously known to be down.

**Fix Required:** Consider showing a loading state or last known status.

---

### 🟢 MEDIUM PRIORITY ISSUES

#### 7. No Loading State for Settings Save
**Location:** `src/pages/SettingsPage.tsx`

**Problem:** When saving settings (especially API keys), there's no visual feedback that the save is in progress.

**Fix Required:** Add loading states to save buttons.

---

#### 8. Theme Not Synced Between Header and Settings
**Location:** `src/components/layout/Header.tsx`, `src/pages/SettingsPage.tsx`

**Problem:** The Header uses `useTheme()` from next-themes, while Settings uses the settings store. They can get out of sync.

**Fix Required:** Both should use the same source of truth.

---

#### 9. Project Settings Not Applied on Navigation
**Location:** `src/pages/ProjectDetail.tsx`

**Problem:** When a project's default view is changed, navigating to that project doesn't respect the new default.

**Fix Required:** Read project settings and navigate to default view on project load.

---

## Implementation Priority

1. **Theme Changer Fix** - Most visible user-facing issue
2. **API Keys to Backend** - Required for authenticated API access
3. **WebSocket Reconnect** - Required for dynamic URL changes
4. **Project Creation Form** - Enhances user experience
5. **Settings Sync** - Prevents confusion with stale values

## Files Requiring Changes

- `src/pages/SettingsPage.tsx` - Theme sync, API key headers, WebSocket reconnect
- `src/stores/settingsStore.ts` - Add API key to header helper
- `src/lib/api.ts` - Add authentication headers
- `src/pages/Dashboard.tsx` - Expand project creation form
- `src/App.tsx` - Theme provider integration with settings store
