// ============================================================================
// Settings Page - Application Configuration UI
// ============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, 
  Server, 
  Wifi, 
  Key, 
  Palette, 
   
  Settings,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  RotateCcw,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettingsStore } from '@/stores/settingsStore';
import { healthApi } from '@/lib/api';
import { getSocket, initializeSocket, closeSocket, subscribeToConnectionState } from '@/lib/websocket';
import { toast } from 'sonner';
import { useUiStyle } from '@/hooks/useUiStyle';
import { cn } from '@/lib/utils';
export function SettingsPage() {
  const settings = useSettingsStore();
  const { isClawLens } = useUiStyle();
  const sw = isClawLens ? 1.5 : 2;
  const [isTestingBackend, setIsTestingBackend] = useState(false);
  const [isTestingWebSocket, setIsTestingWebSocket] = useState(false);

  // Local state for form values
  const [apiBaseUrl, setApiBaseUrl] = useState(settings.apiBaseUrl);
  const [wsUrl, setWsUrl] = useState(settings.wsUrl);
  const [refreshInterval, setRefreshInterval] = useState(settings.defaultRefreshInterval);
  const [defaultView, setDefaultView] = useState(settings.defaultView);
  const [notifications, setNotifications] = useState(settings.notifications);

  // Test backend connection
  const testBackendConnection = async () => {
    setIsTestingBackend(true);
    try {
      const health = await healthApi.check();
      settings.updateBackendHealth({
        status: 'healthy',
        timestamp: health.timestamp,
        uptime: health.uptime,
      });
      toast.success('Backend connection successful', {
        description: `Uptime: ${Math.floor(health.uptime / 60)}m ${Math.floor(health.uptime % 60)}s`,
      });
    } catch (error) {
      settings.updateBackendHealth({
        status: 'unhealthy',
      });
      toast.error('Backend connection failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsTestingBackend(false);
    }
  };

  // Test WebSocket connection (wait for connect or connect_error, max 5s)
  const testWebSocketConnection = () => {
    setIsTestingWebSocket(true);
    const current = getSocket();
    if (current?.connected) {
      toast.success('WebSocket connected', { description: `Socket ID: ${current.id}` });
      setIsTestingWebSocket(false);
      return;
    }
    initializeSocket();
    const timeout = setTimeout(() => {
      unsubscribe();
      const updated = getSocket();
      if (updated?.connected) {
        toast.success('WebSocket connected', { description: `Socket ID: ${updated.id}` });
      } else {
        toast.error('WebSocket connection failed', {
          description: 'Could not establish connection within 5s',
        });
      }
      setIsTestingWebSocket(false);
    }, 5000);
    const unsubscribe = subscribeToConnectionState((state) => {
      if (state.connected) {
        clearTimeout(timeout);
        unsubscribe();
        const s = getSocket();
        toast.success('WebSocket connected', { description: s ? `Socket ID: ${s.id}` : undefined });
        setIsTestingWebSocket(false);
      } else if (state.error) {
        clearTimeout(timeout);
        unsubscribe();
        toast.error('WebSocket connection failed', { description: state.error });
        setIsTestingWebSocket(false);
      }
    });
  };

  // Save connection settings
  const saveConnectionSettings = () => {
    settings.updateApiBaseUrl(apiBaseUrl);
    settings.updateWsUrl(wsUrl);
    
    // Reinitialize WebSocket with new URL
    closeSocket();
    setTimeout(() => initializeSocket(), 100);
    
    toast.success('Connection settings saved', {
      description: 'Changes will take effect immediately',
    });
  };

  // Save project defaults
  const saveProjectDefaults = () => {
    settings.updateSettings({
      defaultRefreshInterval: refreshInterval,
      defaultView,
      notifications,
    });
    toast.success('Project defaults saved');
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      settings.resetToDefaults();
      setApiBaseUrl(settings.apiBaseUrl);
      setWsUrl(settings.wsUrl);
      setRefreshInterval(30);
      setDefaultView('tasks');
      setNotifications(true);
      toast.success('Settings reset to defaults');
    }
  };

  // Get health status badge
  const getHealthBadge = () => {
    switch (settings.backendHealth.status) {
      case 'healthy':
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Healthy
          </Badge>
        );
      case 'unhealthy':
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Unhealthy
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={sw} />Back
            </Link>
          </Button>
          <div>
            <h1 className={cn("text-3xl font-bold tracking-tight", isClawLens && "section-title tracking-wider")}>Settings</h1>
            {isClawLens && <p className="text-[9px] text-muted-foreground tracking-widest mt-1">設定 // SETTINGS</p>}
            <p className="text-muted-foreground">Configure application preferences and connections</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" strokeWidth={sw} />Reset to Defaults
        </Button>
      </div>

      <Tabs defaultValue="connections" className="w-full">
        <TabsList className={cn(
          "grid w-full grid-cols-4 lg:w-[400px]",
          isClawLens && "[&_[data-state=active]]:bg-primary [&_[data-state=active]]:text-primary-foreground"
        )}>
          <TabsTrigger value="connections"><Server className="h-4 w-4 mr-2" strokeWidth={sw} />Connections</TabsTrigger>
          <TabsTrigger value="apikeys"><Key className="h-4 w-4 mr-2" strokeWidth={sw} />API Keys</TabsTrigger>
          <TabsTrigger value="defaults"><Settings className="h-4 w-4 mr-2" strokeWidth={sw} />Defaults</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="h-4 w-4 mr-2" strokeWidth={sw} />Appearance</TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          <Card className={cn(isClawLens && "hud-card")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Backend Connection
              </CardTitle>
              <CardDescription>
                Configure the backend API server connection.
                <span className="block mt-1 text-xs">
                  💡 Deploy your backend to Railway, then paste the URL here to connect.
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">API Base URL</Label>
                <Input
                  id="api-url"
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                  placeholder="https://your-backend.railway.app"
                />
                <p className="text-sm text-muted-foreground">
                  The base URL for the Open Artel Dashboard backend API. Use your Railway deployment URL.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getHealthBadge()}
                </div>
                {settings.backendHealth.lastChecked && (
                  <span className="text-sm text-muted-foreground">
                    Last checked: {settings.backendHealth.lastChecked.toLocaleTimeString()}
                  </span>
                )}
              </div>

              <Button 
                onClick={testBackendConnection} 
                disabled={isTestingBackend}
                variant="outline"
              >
                {isTestingBackend && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isTestingBackend && <RefreshCw className="mr-2 h-4 w-4" />}
                Test Connection
              </Button>
            </CardContent>
          </Card>

          <Card className={cn(isClawLens && "hud-card")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                WebSocket Connection
              </CardTitle>
              <CardDescription>
                Configure the WebSocket server for real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ws-url">WebSocket URL</Label>
                <Input
                  id="ws-url"
                  value={wsUrl}
                  onChange={(e) => setWsUrl(e.target.value)}
                  placeholder="ws://localhost:3001"
                />
                <p className="text-sm text-muted-foreground">
                  The WebSocket URL for real-time updates (usually same as API)
                </p>
              </div>

              <Button 
                onClick={testWebSocketConnection} 
                disabled={isTestingWebSocket}
                variant="outline"
              >
                {isTestingWebSocket && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isTestingWebSocket && <RefreshCw className="mr-2 h-4 w-4" />}
                Test WebSocket
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveConnectionSettings} className={cn(isClawLens && "btn-cyan")}>
              <Save className="mr-2 h-4 w-4" strokeWidth={sw} />Save Connection Settings
            </Button>
          </div>
        </TabsContent>

        {/* API Keys Tab - Keys are configured in backend .env */}
        <TabsContent value="apikeys" className="space-y-4">
          <Card className={cn(isClawLens && "hud-card")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys (Backend)
              </CardTitle>
              <CardDescription>
                GitHub and Kimi API keys are configured on the backend server, not in the browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Add the following to <code className="rounded bg-muted px-1 py-0.5">dashboard-backend/.env</code>:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li><code className="rounded bg-muted px-1 py-0.5">GITHUB_TOKEN</code> — for repo listing, tasks, commits, and file access</li>
                <li><code className="rounded bg-muted px-1 py-0.5">KIMI_API_KEY</code> — for the Kimi chat assistant</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                See the backend <code className="rounded bg-muted px-1 py-0.5">README.md</code> for setup and links to create tokens.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Defaults Tab */}
        <TabsContent value="defaults" className="space-y-4">
          <Card className={cn(isClawLens && "hud-card")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Project Defaults
              </CardTitle>
              <CardDescription>
                Default settings for new projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="refresh-interval">
                    Default Refresh Interval: {refreshInterval}s
                  </Label>
                </div>
                <Slider
                  id="refresh-interval"
                  value={[refreshInterval]}
                  onValueChange={(value) => setRefreshInterval(value[0])}
                  min={5}
                  max={300}
                  step={5}
                />
                <p className="text-sm text-muted-foreground">
                  How often to refresh project data (in seconds)
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="default-view">Default View</Label>
                <Select value={defaultView} onValueChange={(v) => setDefaultView(v as typeof defaultView)}>
                  <SelectTrigger id="default-view">
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="tasks">Tasks</SelectItem>
                    <SelectItem value="agents">Agents</SelectItem>
                    <SelectItem value="commits">Commits</SelectItem>
                    <SelectItem value="files">Files</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  The default view when opening a project
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable toast notifications for updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveProjectDefaults} className={cn(isClawLens && "btn-cyan")}>
              <Save className="mr-2 h-4 w-4" strokeWidth={sw} />Save Defaults
            </Button>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          {/* UI Style Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                UI Style
              </CardTitle>
              <CardDescription>
                Choose between the classic look or the ClawLens HUD aesthetic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Classic */}
                <button
                  type="button"
                  onClick={() => settings.updateUiStyle('classic')}
                  className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                    settings.uiStyle === 'classic'
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-gray-900" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Classic</p>
                      <p className="text-xs text-muted-foreground">Clean, neutral design</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-white border border-gray-200" />
                    <div className="h-3 w-3 rounded-full bg-gray-100" />
                    <div className="h-3 w-3 rounded-full bg-gray-900" />
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                  </div>
                </button>

                {/* ClawLens HUD */}
                <button
                  type="button"
                  onClick={() => settings.updateUiStyle('clawlens')}
                  className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                    settings.uiStyle === 'clawlens'
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-sm flex items-center justify-center" style={{ background: '#12141A', border: '1px solid #2A2E3D' }}>
                      <div className="h-4 w-4 rounded-sm" style={{ background: '#00D4AA' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">ClawLens HUD</p>
                      <p className="text-xs text-muted-foreground">Cyber-tactical interface</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-sm" style={{ background: '#12141A', border: '1px solid #2A2E3D' }} />
                    <div className="h-3 w-3 rounded-sm" style={{ background: '#1A1D26' }} />
                    <div className="h-3 w-3 rounded-sm" style={{ background: '#00D4AA' }} />
                    <div className="h-3 w-3 rounded-sm" style={{ background: '#D64545' }} />
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Theme (light/dark/system) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme
              </CardTitle>
              <CardDescription>
                Choose your preferred color theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={settings.theme === 'light' ? 'default' : 'outline'}
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => settings.updateTheme('light')}
                >
                  <div className="h-8 w-8 rounded-full bg-white border-2 border-gray-200" />
                  <span>Light</span>
                </Button>
                <Button
                  variant={settings.theme === 'dark' ? 'default' : 'outline'}
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => settings.updateTheme('dark')}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-900 border-2 border-gray-700" />
                  <span>Dark</span>
                </Button>
                <Button
                  variant={settings.theme === 'system' ? 'default' : 'outline'}
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => settings.updateTheme('system')}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white to-gray-900 border-2 border-gray-400" />
                  <span>System</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
