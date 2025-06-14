
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from '@tanstack/react-query';
import { 
  Cloud, 
  Database, 
  Webhook, 
  Key, 
  Settings, 
  CheckCircle,
  AlertTriangle,
  Activity,
  Zap,
  Globe,
  Lock
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'error';
  icon: React.ComponentType<any>;
  endpoints?: string[];
  apiVersion?: string;
  lastSync?: string;
}

export function EnterpriseIntegrationHub() {
  const [activeIntegrations, setActiveIntegrations] = useState<Record<string, boolean>>({});

  const { data: integrations } = useQuery({
    queryKey: ['enterprise-integrations'],
    queryFn: async (): Promise<Integration[]> => {
      return [
        {
          id: 'salesforce',
          name: 'Salesforce CRM',
          description: 'Customer relationship management and sales automation',
          category: 'CRM',
          status: 'active',
          icon: Cloud,
          endpoints: ['/api/salesforce/contacts', '/api/salesforce/leads'],
          apiVersion: 'v54.0',
          lastSync: '2025-06-14T10:30:00Z'
        },
        {
          id: 'hubspot',
          name: 'HubSpot Marketing',
          description: 'Marketing automation and lead management',
          category: 'Marketing',
          status: 'active',
          icon: Zap,
          endpoints: ['/api/hubspot/contacts', '/api/hubspot/campaigns'],
          apiVersion: 'v3',
          lastSync: '2025-06-14T10:25:00Z'
        },
        {
          id: 'zapier',
          name: 'Zapier Automation',
          description: 'Workflow automation and app integration',
          category: 'Automation',
          status: 'inactive',
          icon: Settings,
          endpoints: ['/api/zapier/webhooks', '/api/zapier/triggers'],
          apiVersion: 'v1.0'
        },
        {
          id: 'aws-s3',
          name: 'AWS S3 Storage',
          description: 'Cloud storage for files and media',
          category: 'Storage',
          status: 'active',
          icon: Database,
          endpoints: ['/api/aws/upload', '/api/aws/download'],
          apiVersion: '2006-03-01',
          lastSync: '2025-06-14T10:35:00Z'
        },
        {
          id: 'microsoft-graph',
          name: 'Microsoft Graph',
          description: 'Office 365 and Teams integration',
          category: 'Productivity',
          status: 'error',
          icon: Globe,
          endpoints: ['/api/graph/users', '/api/graph/messages'],
          apiVersion: 'v1.0'
        }
      ];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive': return <Activity className="w-4 h-4 text-gray-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 bg-clip-text text-transparent">
          Enterprise Integration Hub
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Manage enterprise-grade integrations, API connections, and data synchronization across your business ecosystem.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api-management">API Management</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Integration Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                    <p className="text-3xl font-bold text-green-600">
                      {integrations?.filter(i => i.status === 'active').length || 0}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Endpoints</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {integrations?.reduce((acc, i) => acc + (i.endpoints?.length || 0), 0) || 0}
                    </p>
                  </div>
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Data Sync Rate</p>
                    <p className="text-3xl font-bold text-purple-600">98.5%</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">API Calls Today</p>
                    <p className="text-3xl font-bold text-orange-600">12.4K</p>
                  </div>
                  <Zap className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integrations List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations?.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <integration.icon className="w-8 h-8 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge className={getStatusColor(integration.status)}>
                          {getStatusIcon(integration.status)}
                          <span className="ml-1">{integration.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{integration.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">API Version:</span>
                      <span className="font-medium">{integration.apiVersion}</span>
                    </div>
                    {integration.lastSync && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Sync:</span>
                        <span className="font-medium">
                          {new Date(integration.lastSync).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-gray-600">Enable Integration</span>
                      <Switch
                        checked={activeIntegrations[integration.id] || integration.status === 'active'}
                        onCheckedChange={(checked) => 
                          setActiveIntegrations(prev => ({ ...prev, [integration.id]: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api-management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Key Management
              </CardTitle>
              <CardDescription>
                Manage API keys and authentication tokens for enterprise integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Salesforce', 'HubSpot', 'Microsoft Graph', 'AWS'].map((service) => (
                <div key={service} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{service} API Key</h3>
                    <p className="text-sm text-gray-600">Last updated: 2 days ago</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Rotate</Button>
                    <Button variant="outline" size="sm">Test</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="w-5 h-5" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>
                Configure webhook endpoints for real-time data synchronization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://api.yourcompany.com/webhooks"
                    defaultValue="https://xfwtjndfclckgvpvgiaj.supabase.co/functions/v1/enterprise-webhook"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <Input
                    id="webhook-secret"
                    type="password"
                    placeholder="Enter webhook secret"
                  />
                </div>
              </div>
              <Button className="w-full">Save Webhook Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Integration Security
              </CardTitle>
              <CardDescription>
                Security policies and compliance settings for enterprise integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">OAuth 2.0 Authentication</h3>
                    <p className="text-sm text-gray-600">Use OAuth for secure API access</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Rate Limiting</h3>
                    <p className="text-sm text-gray-600">Enforce API rate limits</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Request Encryption</h3>
                    <p className="text-sm text-gray-600">Encrypt all API requests</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Audit Logging</h3>
                    <p className="text-sm text-gray-600">Log all integration activities</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
