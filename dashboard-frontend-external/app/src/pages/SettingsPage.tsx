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
  Bell, 
  Settings,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
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
import { getSocket, initializeSocket, closeSocket } from '@/lib/websocket';
import { toast } from 'sonner';

export function SettingsPage() {
  const settings = useSettingsStore();
  const [isTestingBackend, setIsTestingBackend] = useState(false);
  const [isTestingWebSocket, setIsTestingWebSocket] = useState(false);
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [showKimiKey, setShowKimiKey] = useState(false);

  // Local state for form values
  const [apiBaseUrl, setApiBaseUrl] = useState(settings.apiBaseUrl);
  const [wsUrl, setWsUrl] = useState(settings.wsUrl);
  const [githubToken, setGithubToken] = useState(settings.githubToken);
  const [kimiApiKey, setKimiApiKey] = useState(settings.kimiApiKey);
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

  // Test WebSocket connection
  const testWebSocketConnection = () => {
    setIsTestingWebSocket(true);
    const socket = getSocket();
    
    if (socket.connected) {
      toast.success('WebSocket connected', {
        description: `Socket ID: ${socket.id}`,
      });
      setIsTestingWebSocket(false);
      return;
    }

    // Try to connect
    initializeSocket();
    
    setTimeout(() => {
      const updatedSocket = getSocket();
      if (updatedSocket.connected) {
        toast.success('WebSocket connected', {
          description: `Socket ID: ${updatedSocket.id}`,
        });
      } else {
        toast.error('WebSocket connection failed', {
          description: 'Could not establish connection',
        });
      }
      setIsTestingWebSocket(false);
    }, 2000);
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

  // Save API keys
  const saveApiKeys = () => {
    settings.updateGithubToken(githubToken);
    settings.updateKimiApiKey(kimiApiKey);
    toast.success('API keys saved', {
      description: 'Keys are stored locally in your browser',
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
      setGithubToken('');
      setKimiApiKey('');
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
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure application preferences and connections
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>

      <Tabs defaultValue="connections" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="connections">
            <Server className="h-4 w-4 mr-2" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="apikeys">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="defaults">
            <Settings className="h-4 w-4 mr-2" />
            Defaults
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Backend Connection
              </CardTitle>
              <CardDescription>
                Configure the backend API server connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">API Base URL</Label>
                <Input
                  id="api-url"
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                  placeholder="http://localhost:3001"
                />
                <p className="text-sm text-muted-foreground">
                  The base URL for the Open Artel Dashboard backend API
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

          <Card>
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
            <Button onClick={saveConnectionSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Connection Settings
            </Button>
          </div>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="apikeys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                GitHub Token
              </CardTitle>
              <CardDescription>
                Personal access token for GitHub API access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github-token">GitHub Personal Access Token</Label>
                <div className="relative">
                  <Input
                    id="github-token"
                    type={showGithubToken ? 'text' : 'password'}
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowGithubToken(!showGithubToken)}
                  >
                    {showGithubToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Required for accessing private repositories. 
                  <a 
                    href="https://github.com/settings/tokens" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-1"
                  >
                    Create token on GitHub
                  </a>
                </p>
              </div>

              {settings.hasGithubToken() && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Token configured (masked for security)
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Kimi API Key
              </CardTitle>
              <CardDescription>
                API key for Kimi chat functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kimi-key">Kimi API Key</Label>
                <div className="relative">
                  <Input
                    id="kimi-key"
                    type={showKimiKey ? 'text' : 'password'}
                    value={kimiApiKey}
                    onChange={(e) => setKimiApiKey(e.target.value)}
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowKimiKey(!showKimiKey)}
                  >
                    {showKimiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Required for Kimi chat functionality.
                  <a 
                    href="https://platform.moonshot.cn/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-1"
                  >
                    Get API key from Moonshot
                  </a>
                </p>
              </div>

              {settings.hasKimiApiKey() && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  API key configured (masked for security)
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveApiKeys}>
              <Save className="mr-2 h-4 w-4" />
              Save API Keys
            </Button>
          </div>
        </TabsContent>

        {/* Defaults Tab */}
        <TabsContent value="defaults" className="space-y-4">
          <Card>
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
            <Button onClick={saveProjectDefaults}>
              <Save className="mr-2 h-4 w-4" />
              Save Defaults
            </Button>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
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
