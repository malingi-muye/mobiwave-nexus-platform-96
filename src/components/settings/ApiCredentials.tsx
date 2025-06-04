
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff, Key, Settings } from 'lucide-react';

interface ApiCredential {
  id: string;
  provider: string;
  api_key: string;
  username: string;
  sender_id: string;
  is_active: boolean;
}

export const ApiCredentials: React.FC = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    api_key: '',
    username: '',
    sender_id: ''
  });
  
  const queryClient = useQueryClient();

  const { data: credentials, isLoading } = useQuery({
    queryKey: ['api-credentials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_credentials')
        .select('*')
        .eq('provider', 'mspace')
        .maybeSingle();

      if (error) throw error;
      return data as ApiCredential | null;
    }
  });

  useEffect(() => {
    if (credentials) {
      setFormData({
        api_key: credentials.api_key || '',
        username: credentials.username || '',
        sender_id: credentials.sender_id || ''
      });
    }
  }, [credentials]);

  const saveCredentials = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('api_credentials')
        .upsert({
          provider: 'mspace',
          api_key: data.api_key,
          username: data.username,
          sender_id: data.sender_id,
          is_active: true
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-credentials'] });
      toast.success('API credentials saved successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to save credentials: ${error.message}`);
    }
  });

  const toggleActiveStatus = useMutation({
    mutationFn: async (isActive: boolean) => {
      if (!credentials) return;
      
      const { error } = await supabase
        .from('api_credentials')
        .update({ is_active: isActive })
        .eq('id', credentials.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-credentials'] });
      toast.success('API credentials status updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.api_key || !formData.username || !formData.sender_id) {
      toast.error('Please fill in all required fields');
      return;
    }
    saveCredentials.mutate(formData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-600" />
          Mspace API Configuration
        </CardTitle>
        <CardDescription>
          Configure your Mspace SMS API credentials to enable SMS functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api_key">API Key *</Label>
            <div className="relative">
              <Input
                id="api_key"
                type={showApiKey ? "text" : "password"}
                value={formData.api_key}
                onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                placeholder="Enter your Mspace API key"
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter your Mspace username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender_id">Sender ID *</Label>
            <Input
              id="sender_id"
              type="text"
              value={formData.sender_id}
              onChange={(e) => setFormData(prev => ({ ...prev, sender_id: e.target.value }))}
              placeholder="Enter your sender ID (e.g., COMPANY)"
              required
            />
          </div>

          {credentials && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-gray-600" />
                <Label htmlFor="active-status">API Active</Label>
              </div>
              <Switch
                id="active-status"
                checked={credentials.is_active}
                onCheckedChange={(checked) => toggleActiveStatus.mutate(checked)}
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={saveCredentials.isPending}
              className="flex-1"
            >
              {saveCredentials.isPending ? 'Saving...' : 'Save Credentials'}
            </Button>
          </div>
        </form>

        {credentials && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">
                API credentials configured and {credentials.is_active ? 'active' : 'inactive'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
