// ============================================================================
// Project Settings Dialog - Edit Project Configuration
// ============================================================================

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Loader2, 
  Bell,
  Clock,
  Layout,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { projectsApi } from '@/lib/api';
import { useProjectStore } from '@/stores/projectStore';
import type { ProjectSettings } from '@/types';
import { toast } from 'sonner';

interface ProjectSettingsDialogProps {
  owner: string;
  repo: string;
  currentSettings: ProjectSettings;
}

export function ProjectSettingsDialog({ 
  owner, 
  repo, 
  currentSettings 
}: ProjectSettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state for form values
  const [refreshInterval, setRefreshInterval] = useState(currentSettings.refreshInterval);
  const [defaultView, setDefaultView] = useState(currentSettings.defaultView);
  const [notifications, setNotifications] = useState(currentSettings.notifications);

  // Update local state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setRefreshInterval(currentSettings.refreshInterval);
      setDefaultView(currentSettings.defaultView);
      setNotifications(currentSettings.notifications);
    }
  }, [isOpen, currentSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedProject = await projectsApi.updateSettings(owner, repo, {
        refreshInterval,
        defaultView,
        notifications,
      });
      
      // Update the project in the store
      useProjectStore.getState().setCurrentProject(updatedProject);
      
      toast.success('Project settings saved');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to save settings', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setRefreshInterval(currentSettings.refreshInterval);
    setDefaultView(currentSettings.defaultView);
    setNotifications(currentSettings.notifications);
    toast.info('Settings reset to current values');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Project Settings
          </DialogTitle>
          <DialogDescription>
            Configure settings for {owner}/{repo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Refresh Interval */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="refresh-interval">
                Refresh Interval: {refreshInterval}s
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
              How often to refresh project data automatically
            </p>
          </div>

          <Separator />

          {/* Default View */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Layout className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="default-view">Default View</Label>
            </div>
            <Select value={defaultView} onValueChange={setDefaultView}>
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
              The default view when opening this project
            </p>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="notifications">Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Enable toast notifications for this project
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <Separator />

          {/* Current Values Summary */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Current Settings</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <RefreshCw className="h-3 w-3 mr-1" />
                {refreshInterval}s
              </Badge>
              <Badge variant="secondary">
                <Layout className="h-3 w-3 mr-1" />
                {defaultView}
              </Badge>
              <Badge variant={notifications ? 'default' : 'secondary'}>
                <Bell className="h-3 w-3 mr-1" />
                {notifications ? 'On' : 'Off'}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {!isSaving && <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
