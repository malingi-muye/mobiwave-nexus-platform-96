
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Key, Activity, Settings, Copy, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useApiKeys, useApiUsage } from '@/hooks/useApiKeys';
import { toast } from 'sonner';

export function ApiManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyData, setNewKeyData] = useState({
    key_name: '',
    permissions: [] as string[],
    rate_limit: 1000,
    expires_at: ''
  });

  const { apiKeys, createApiKey, updateApiKey, deleteApiKey, isCreating } = useApiKeys();
  const { usage, isLoading: usageLoading } = useApiUsage(selectedApiKey);

  const availablePermissions = [
    'sms:send',
    'whatsapp:send',
    'ussd:create',
    'mpesa:initiate',
    'surveys:create',
    'surveys:read',
    'analytics:read',
    'users:read'
  ];

  const handleCreateApiKey = async () => {
    if (!newKeyData.key_name) {
      toast.error('Please enter a key name');
      return;
    }

    try {
      await createApiKey({
        key_name: newKeyData.key_name,
        permissions: newKeyData.permissions,
        rate_limit: newKeyData.rate_limit,
        is_active: true,
        expires_at: newKeyData.expires_at || undefined
      });
      
      setShowCreateDialog(false);
      setNewKeyData({
        key_name: '',
        permissions: [],
        rate_limit: 1000,
        expires_at: ''
      });
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard');
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const maskApiKey = (key: string) => {
    return key.slice(0, 8) + '...' + key.slice(-4);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API Management</h2>
          <p className="text-gray-600">Manage API keys, rate limits, and usage analytics</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key with specific permissions and rate limits
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key_name">Key Name</Label>
                <Input
                  id="key_name"
                  value={newKeyData.key_name}
                  onChange={(e) => setNewKeyData(prev => ({ ...prev, key_name: e.target.value }))}
                  placeholder="My API Key"
                />
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={permission}
                        checked={newKeyData.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewKeyData(prev => ({
                              ...prev,
                              permissions: [...prev.permissions, permission]
                            }));
                          } else {
                            setNewKeyData(prev => ({
                              ...prev,
                              permissions: prev.permissions.filter(p => p !== permission)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={permission} className="text-sm">{permission}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate_limit">Rate Limit (requests/hour)</Label>
                <Select 
                  value={newKeyData.rate_limit.toString()} 
                  onValueChange={(value) => setNewKeyData(prev => ({ ...prev, rate_limit: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                    <SelectItem value="1000">1,000</SelectItem>
                    <SelectItem value="5000">5,000</SelectItem>
                    <SelectItem value="10000">10,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={newKeyData.expires_at}
                  onChange={(e) => setNewKeyData(prev => ({ ...prev, expires_at: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateApiKey} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create API Key'}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No API keys created yet</p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First API Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{apiKey.key_name}</h3>
                          <Badge className={apiKey.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {apiKey.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedApiKey(apiKey.id)}
                          >
                            <Activity className="w-4 h-4 mr-1" />
                            Usage
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteApiKey(apiKey.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">API Key:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {visibleKeys.has(apiKey.id) ? apiKey.api_key : maskApiKey(apiKey.api_key)}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(apiKey.api_key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Rate Limit: {apiKey.rate_limit}/hour</span>
                          <span>Permissions: {apiKey.permissions.length}</span>
                          {apiKey.last_used_at && (
                            <span>Last Used: {new Date(apiKey.last_used_at).toLocaleDateString()}</span>
                          )}
                          {apiKey.expires_at && (
                            <span>Expires: {new Date(apiKey.expires_at).toLocaleDateString()}</span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {apiKey.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Analytics</CardTitle>
              <CardDescription>
                {selectedApiKey ? 'Usage statistics for selected API key' : 'Select an API key to view usage statistics'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedApiKey ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select an API key from the Keys tab to view usage analytics</p>
                </div>
              ) : usageLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{usage.length}</div>
                      <div className="text-sm text-gray-600">Total Requests</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold">
                        {usage.length > 0 ? Math.round(usage.reduce((sum, u) => sum + (u.response_time_ms || 0), 0) / usage.length) : 0}ms
                      </div>
                      <div className="text-sm text-gray-600">Avg Response Time</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {usage.length > 0 ? Math.round((usage.filter(u => u.status_code < 400).length / usage.length) * 100) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </div>

                  {usage.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Recent Requests</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {usage.slice(0, 20).map((request) => (
                          <div key={request.id} className="flex items-center justify-between p-2 border rounded text-sm">
                            <div className="flex items-center gap-3">
                              <Badge variant={request.status_code < 400 ? "default" : "destructive"}>
                                {request.method}
                              </Badge>
                              <span>{request.endpoint}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                              <span>{request.status_code}</span>
                              <span>{request.response_time_ms}ms</span>
                              <span>{new Date(request.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Learn how to integrate with our APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Authentication</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm mb-2">Include your API key in the Authorization header:</p>
                  <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Base URL</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <code className="text-sm">https://api.mobiwave.com/v1</code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Available Endpoints</h3>
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge>POST</Badge>
                      <code className="text-sm">/sms/send</code>
                    </div>
                    <p className="text-sm text-gray-600">Send SMS messages</p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge>POST</Badge>
                      <code className="text-sm">/whatsapp/send</code>
                    </div>
                    <p className="text-sm text-gray-600">Send WhatsApp messages</p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge>GET</Badge>
                      <code className="text-sm">/analytics/campaigns</code>
                    </div>
                    <p className="text-sm text-gray-600">Get campaign analytics</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Rate Limits</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Rate limits are enforced per API key. When you exceed your limit, you'll receive a 429 status code.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Tip:</strong> Use exponential backoff when handling rate limit errors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
