
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Key, Activity, Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
import { useApiKeys, useApiUsage } from '@/hooks/useApiKeys';
import { toast } from 'sonner';

export function ApiManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string>('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyData, setNewKeyData] = useState({
    key_name: '',
    permissions: [] as string[],
    rate_limit: 1000,
    expires_at: ''
  });

  const { apiKeys, isLoading, createApiKey, updateApiKey, deleteApiKey } = useApiKeys();
  const { usage } = useApiUsage(selectedKeyId);

  const handleCreateKey = async () => {
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
      setShowCreateForm(false);
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

  const handleDeleteKey = async (keyId: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      try {
        await deleteApiKey(keyId);
      } catch (error) {
        console.error('Failed to delete API key:', error);
      }
    }
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 8) + '...' + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API Management</h2>
          <p className="text-gray-600">Manage API keys and monitor usage</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create API Key
        </Button>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New API Key</CardTitle>
                <CardDescription>Generate a new API key for external integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      placeholder="e.g., Production API Key"
                      value={newKeyData.key_name}
                      onChange={(e) => setNewKeyData(prev => ({ ...prev, key_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rateLimit">Rate Limit (per hour)</Label>
                    <Input
                      id="rateLimit"
                      type="number"
                      value={newKeyData.rate_limit}
                      onChange={(e) => setNewKeyData(prev => ({ ...prev, rate_limit: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expiry Date (Optional)</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={newKeyData.expires_at}
                    onChange={(e) => setNewKeyData(prev => ({ ...prev, expires_at: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateKey}>Create API Key</Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 mb-4">No API keys created yet</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First API Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{key.key_name}</h3>
                          <Badge variant={key.is_active ? 'default' : 'secondary'}>
                            {key.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedKeyId(key.id)}
                          >
                            <Activity className="w-4 h-4 mr-1" />
                            Usage
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteKey(key.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">API Key:</span>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {visibleKeys.has(key.id) ? key.api_key : maskApiKey(key.api_key)}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleKeyVisibility(key.id)}
                          >
                            {visibleKeys.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(key.api_key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Rate Limit:</span>
                            <p className="font-medium">{key.rate_limit}/hour</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Created:</span>
                            <p className="font-medium">{new Date(key.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Used:</span>
                            <p className="font-medium">
                              {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Expires:</span>
                            <p className="font-medium">
                              {key.expires_at ? new Date(key.expires_at).toLocaleDateString() : 'Never'}
                            </p>
                          </div>
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
              <CardDescription>Monitor API key usage and performance</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedKeyId ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label>Select API Key:</Label>
                    <Select value={selectedKeyId} onValueChange={setSelectedKeyId}>
                      <SelectTrigger className="w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {apiKeys.map((key) => (
                          <SelectItem key={key.id} value={key.id}>
                            {key.key_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {usage.length === 0 ? (
                    <p className="text-gray-500 py-8 text-center">No usage data available for this API key</p>
                  ) : (
                    <div className="space-y-4">
                      {usage.slice(0, 10).map((record) => (
                        <div key={record.id} className="border rounded p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Badge variant={record.status_code >= 200 && record.status_code < 300 ? 'default' : 'destructive'}>
                                {record.status_code}
                              </Badge>
                              <span className="font-mono text-sm">{record.method}</span>
                              <span className="text-sm">{record.endpoint}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.response_time_ms}ms • {new Date(record.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 py-8 text-center">Select an API key to view usage analytics</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
