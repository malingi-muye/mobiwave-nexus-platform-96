
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Key, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface ApiCredentialsData {
  api_key: string;
  username: string;
  sender_id: string;
  is_active: boolean;
}

export function ApiCredentials() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<ApiCredentialsData>({
    api_key: '',
    username: '',
    sender_id: '',
    is_active: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    if (user) {
      loadCredentials();
    }
  }, [user]);

  const loadCredentials = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_credentials')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'mspace')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading credentials:', error);
        toast.error('Failed to load API credentials');
        return;
      }

      if (data) {
        setCredentials({
          api_key: data.api_key || '',
          username: data.username || '',
          sender_id: data.sender_id || '',
          is_active: data.is_active || false
        });
      }
    } catch (error) {
      console.error('Credentials load failed:', error);
      toast.error('Failed to load API credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const saveCredentials = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const credentialsData = {
        user_id: user.id,
        provider: 'mspace',
        api_key: credentials.api_key,
        username: credentials.username,
        sender_id: credentials.sender_id,
        is_active: true
      };

      const { error } = await supabase
        .from('api_credentials')
        .upsert(credentialsData, {
          onConflict: 'user_id,provider'
        });

      if (error) {
        console.error('Error saving credentials:', error);
        toast.error('Failed to save API credentials');
        return;
      }

      setCredentials(prev => ({ ...prev, is_active: true }));
      toast.success('API credentials saved successfully');
    } catch (error) {
      console.error('Credentials save failed:', error);
      toast.error('Failed to save API credentials');
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    if (!credentials.api_key || !credentials.username) {
      toast.error('Please provide API key and username');
      return;
    }

    setIsTestingConnection(true);
    try {
      const response = await fetch(`https://api.mspace.co.ke/smsapi/v2/balance/apikey=${credentials.api_key}/username=${credentials.username}`);
      
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Mspace API Configuration
          </CardTitle>
          <Badge variant={credentials.is_active ? "default" : "secondary"}>
            {credentials.is_active ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Active
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-1" />
                Inactive
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="apiKey"
                type="password"
                value={credentials.api_key}
                onChange={(e) => setCredentials(prev => ({ ...prev, api_key: e.target.value }))}
                className="pl-10"
                placeholder="Enter your Mspace API key"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter your Mspace username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderId">Sender ID</Label>
            <Input
              id="senderId"
              value={credentials.sender_id}
              onChange={(e) => setCredentials(prev => ({ ...prev, sender_id: e.target.value }))}
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
            onClick={saveCredentials} 
            disabled={isSaving || !credentials.api_key || !credentials.username}
            className="flex-1"
          >
            {isSaving ? 'Saving...' : 'Save Credentials'}
          </Button>
          <Button 
            variant="outline" 
            onClick={testConnection}
            disabled={isTestingConnection || !credentials.api_key || !credentials.username}
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
      </CardContent>
    </Card>
  );
}
