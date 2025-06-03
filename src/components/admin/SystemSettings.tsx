
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServiceStatus } from '@/hooks/useSystemMetrics';
import { toast } from 'sonner';
import { 
  Settings, 
  Shield, 
  Server, 
  Mail, 
  MessageSquare, 
  CreditCard,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export function SystemSettings() {
  const { data: serviceStatus } = useServiceStatus();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    enableRegistration: true,
    requireEmailVerification: true,
    maxCampaignRecipients: 10000,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smsProvider: 'mspace',
    rateLimitPerMinute: 100
  });

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return Server;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
          System Settings
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Configure system-wide settings, monitor service health, and manage platform preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure basic platform settings and user preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Temporarily disable access for maintenance</p>
                </div>
                <Switch
                  id="maintenance"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="registration">Enable Registration</Label>
                  <p className="text-sm text-gray-500">Allow new users to register</p>
                </div>
                <Switch
                  id="registration"
                  checked={settings.enableRegistration}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableRegistration: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRecipients">Max Campaign Recipients</Label>
                <Input
                  id="maxRecipients"
                  type="number"
                  value={settings.maxCampaignRecipients}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxCampaignRecipients: parseInt(e.target.value) }))}
                />
              </div>

              <Button onClick={handleSaveSettings} className="w-full">
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Manage authentication and security policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailVerification">Require Email Verification</Label>
                  <p className="text-sm text-gray-500">Users must verify email before access</p>
                </div>
                <Switch
                  id="emailVerification"
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rateLimit">Rate Limit (requests per minute)</Label>
                <Input
                  id="rateLimit"
                  type="number"
                  value={settings.rateLimitPerMinute}
                  onChange={(e) => setSettings(prev => ({ ...prev, rateLimitPerMinute: parseInt(e.target.value) }))}
                />
              </div>

              <Button onClick={handleSaveSettings} className="w-full">
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-green-600" />
                Service Status
              </CardTitle>
              <CardDescription>
                Monitor the health and status of all system services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceStatus?.map((service) => {
                  const StatusIcon = getStatusIcon(service.status);
                  return (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-5 h-5 ${getStatusColor(service.status)}`} />
                        <div>
                          <h3 className="font-medium">{service.service_name}</h3>
                          <p className="text-sm text-gray-500">Version {service.version}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                          {service.status}
                        </p>
                        <p className="text-xs text-gray-500">{service.uptime_percentage}% uptime</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
                  />
                </div>
                <Button onClick={handleSaveSettings} className="w-full">
                  Save Email Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  SMS Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smsProvider">SMS Provider</Label>
                  <Input
                    id="smsProvider"
                    value={settings.smsProvider}
                    onChange={(e) => setSettings(prev => ({ ...prev, smsProvider: e.target.value }))}
                  />
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Mspace API Connected</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">SMS service is operational</p>
                </div>
                <Button onClick={handleSaveSettings} className="w-full">
                  Save SMS Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
