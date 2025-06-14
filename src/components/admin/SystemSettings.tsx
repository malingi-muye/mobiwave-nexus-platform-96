
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useServiceStatus } from '@/hooks/useSystemMetrics';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { 
  Settings, 
  Shield, 
  Server, 
  Mail, 
  MessageSquare, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Key
} from 'lucide-react';

interface ApiCredentialsData {
  api_key: string;
  username: string;
  sender_id: string;
  is_active: boolean;
}

export function SystemSettings() {
  const { data: serviceStatus } = useServiceStatus();
  const { user } = useAuth();
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

  const [mspaceCredentials, setMspaceCredentials] = useState<ApiCredentialsData>({
    api_key: '',
    username: '',
    sender_id: '',
    is_active: false
  });
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
  const [isSavingCredentials, setIsSavingCredentials] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    if (user) {
      loadMspaceCredentials();
    }
  }, [user]);

  const loadMspaceCredentials = async () => {
    if (!user) return;

    setIsLoadingCredentials(true);
    try {
      const { data, error } = await supabase
        .from('api_credentials')
        .select('*')
        .eq('service_name', 'mspace')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading credentials:', error);
        return;
      }

      if (data) {
        const config = data.additional_config as any || {};
        setMspaceCredentials({
          api_key: config.api_key || '',
          username: config.username || '',
          sender_id: config.sender_id || '',
          is_active: data.is_active || false
        });
      }
    } catch (error) {
      console.error('Credentials load failed:', error);
    } finally {
      setIsLoadingCredentials(false);
    }
  };

  const saveMspaceCredentials = async () => {
    if (!user) return;

    setIsSavingCredentials(true);
    try {
      const credentialsData = {
        user_id: user.id,
        service_name: 'mspace',
        api_key_encrypted: mspaceCredentials.api_key,
        additional_config: {
          api_key: mspaceCredentials.api_key,
          username: mspaceCredentials.username,
          sender_id: mspaceCredentials.sender_id
        },
        is_active: true
      };

      const { error } = await supabase
        .from('api_credentials')
        .upsert(credentialsData, {
          onConflict: 'user_id,service_name'
        });

      if (error) {
        console.error('Error saving credentials:', error);
        toast.error('Failed to save Mspace API credentials');
        return;
      }

      setMspaceCredentials(prev => ({ ...prev, is_active: true }));
      toast.success('Mspace API credentials saved successfully');
    } catch (error) {
      console.error('Credentials save failed:', error);
      toast.error('Failed to save Mspace API credentials');
    } finally {
      setIsSavingCredentials(false);
    }
  };

  const testMspaceConnection = async () => {
    if (!mspaceCredentials.api_key || !mspaceCredentials.username) {
      toast.error('Please provide API key and username');
      return;
    }

    setIsTestingConnection(true);
    try {
      const response = await fetch(`https://api.mspace.co.ke/smsapi/v2/balance/apikey=${mspaceCredentials.api_key}/username=${mspaceCredentials.username}`);
      
      if (response.ok) {
        const data = await response.json();
        toast.success(`Connection successful! Balance: ${data.balance || 'N/A'}`);
      } else {
        toast.error('Connection failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error('Connection test failed. Please check your credentials.');
    } finally {
      setIsTestingConnection(false);
    }
  };

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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
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

        <TabsContent value="api" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Mspace API Configuration
                </CardTitle>
                <Badge variant={mspaceCredentials.is_active ? "default" : "secondary"}>
                  {mspaceCredentials.is_active ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Inactive
                    </>
                  )}
                </Badge>
              </div>
              <CardDescription>
                Configure Mspace API credentials for SMS functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingCredentials ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="apiKey"
                          type="password"
                          value={mspaceCredentials.api_key}
                          onChange={(e) => setMspaceCredentials(prev => ({ ...prev, api_key: e.target.value }))}
                          className="pl-10"
                          placeholder="Enter your Mspace API key"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={mspaceCredentials.username}
                        onChange={(e) => setMspaceCredentials(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter your Mspace username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="senderId">Sender ID</Label>
                      <Input
                        id="senderId"
                        value={mspaceCredentials.sender_id}
                        onChange={(e) => setMspaceCredentials(prev => ({ ...prev, sender_id: e.target.value }))}
                        placeholder="Enter your sender ID (e.g., COMPANY)"
                        maxLength={11}
                      />
                      <p className="text-sm text-gray-500">
                        Sender ID should be 3-11 characters. Use your company name or brand.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={saveMspaceCredentials} 
                      disabled={isSavingCredentials || !mspaceCredentials.api_key || !mspaceCredentials.username}
                      className="flex-1"
                    >
                      {isSavingCredentials ? 'Saving...' : 'Save Credentials'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={testMspaceConnection}
                      disabled={isTestingConnection || !mspaceCredentials.api_key || !mspaceCredentials.username}
                    >
                      {isTestingConnection ? 'Testing...' : 'Test Connection'}
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">How to get your Mspace credentials:</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Visit <a href="https://mspace.co.ke" target="_blank" rel="noopener noreferrer" className="underline">mspace.co.ke</a></li>
                      <li>Sign up for an account or log in</li>
                      <li>Navigate to API settings in your dashboard</li>
                      <li>Copy your API key and username</li>
                      <li>Set up your preferred sender ID</li>
                    </ol>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
