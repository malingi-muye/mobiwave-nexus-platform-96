
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Globe, Bell, Shield, Database, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'MobiWave Communications',
    siteDescription: 'Professional SMS and Email Marketing Platform',
    allowRegistration: true,
    requireEmailVerification: true,
    maxMessageLength: 160,
    defaultCredits: 1000,
    enableAnalytics: true,
    enableNotifications: true,
    maintenanceMode: false,
    rateLimitPerHour: 1000,
    maxCampaignSize: 10000,
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    enableSSL: true
  });

  const handleSave = () => {
    // In a real implementation, this would save to database
    toast.success('System settings saved successfully');
  };

  const handleReset = () => {
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 bg-clip-text text-transparent">
          System Settings
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Configure platform-wide settings, limits, and integrations.
        </p>
      </div>

      {/* General Settings */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            General Settings
          </CardTitle>
          <CardDescription>
            Basic platform configuration and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultCredits">Default Credits for New Users</Label>
              <Input
                id="defaultCredits"
                type="number"
                value={settings.defaultCredits}
                onChange={(e) => setSettings({...settings, defaultCredits: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow User Registration</Label>
                <p className="text-sm text-gray-500">Allow new users to create accounts</p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Email Verification</Label>
                <p className="text-sm text-gray-500">Users must verify email before login</p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Limits */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Platform Limits
          </CardTitle>
          <CardDescription>
            Configure rate limits and usage restrictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maxMessageLength">Max Message Length</Label>
              <Input
                id="maxMessageLength"
                type="number"
                value={settings.maxMessageLength}
                onChange={(e) => setSettings({...settings, maxMessageLength: parseInt(e.target.value)})}
              />
              <p className="text-xs text-gray-500">Characters per SMS message</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rateLimitPerHour">Rate Limit (per hour)</Label>
              <Input
                id="rateLimitPerHour"
                type="number"
                value={settings.rateLimitPerHour}
                onChange={(e) => setSettings({...settings, rateLimitPerHour: parseInt(e.target.value)})}
              />
              <p className="text-xs text-gray-500">Max API requests per user</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxCampaignSize">Max Campaign Size</Label>
              <Input
                id="maxCampaignSize"
                type="number"
                value={settings.maxCampaignSize}
                onChange={(e) => setSettings({...settings, maxCampaignSize: parseInt(e.target.value)})}
              />
              <p className="text-xs text-gray-500">Max recipients per campaign</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Email Configuration
          </CardTitle>
          <CardDescription>
            SMTP settings for outbound email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={settings.smtpHost}
                onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                placeholder="smtp.example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                value={settings.smtpPort}
                onChange={(e) => setSettings({...settings, smtpPort: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="smtpUsername">SMTP Username</Label>
              <Input
                id="smtpUsername"
                value={settings.smtpUsername}
                onChange={(e) => setSettings({...settings, smtpUsername: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable SSL/TLS</Label>
              <p className="text-sm text-gray-500">Use secure connection for SMTP</p>
            </div>
            <Switch
              checked={settings.enableSSL}
              onCheckedChange={(checked) => setSettings({...settings, enableSSL: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system status and feature toggles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics Tracking</Label>
                <p className="text-sm text-gray-500">Enable user analytics and tracking</p>
              </div>
              <Switch
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => setSettings({...settings, enableAnalytics: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-500">Enable system notifications</p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-gray-600">Temporarily disable user access</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={settings.maintenanceMode ? "destructive" : "default"}>
                {settings.maintenanceMode ? "Active" : "Inactive"}
              </Badge>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
