
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import EnvironmentManager from '@/lib/environment-config';
import SecurityManager from '@/lib/security';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { toast } from 'sonner';

const SecurityConfig = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [tlsStatus, setTlsStatus] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const environmentManager = EnvironmentManager.getInstance();
  const securityManager = SecurityManager.getInstance();
  const { logSecurityEvent } = useAuditLogger();

  useEffect(() => {
    const config = environmentManager.getConfig();
    setTlsStatus(securityManager.validateTLSConfig());
    setEncryptionEnabled(config.features.encryption);
  }, []);

  const handleApiKeyUpdate = (keyName: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [keyName]: value
    }));
  };

  const saveApiKey = async (keyName: string) => {
    const key = apiKeys[keyName];
    if (!key) {
      toast.error('API key cannot be empty');
      return;
    }

    try {
      environmentManager.setSecureApiKey(keyName, key);
      await logSecurityEvent('current-user', 'api_key_updated', { keyName });
      toast.success(`${keyName} API key saved securely`);
      
      // Clear the input after saving
      setApiKeys(prev => ({
        ...prev,
        [keyName]: ''
      }));
    } catch (error) {
      toast.error('Failed to save API key');
      console.error('Error saving API key:', error);
    }
  };

  const toggleKeyVisibility = (keyName: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyName]: !prev[keyName]
    }));
  };

  const testTlsConnection = async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast.success('TLS connection successful');
        await logSecurityEvent('current-user', 'tls_test_success');
      } else {
        toast.error('TLS connection failed');
        await logSecurityEvent('current-user', 'tls_test_failed');
      }
    } catch (error) {
      toast.error('TLS connection test failed');
      await logSecurityEvent('current-user', 'tls_test_error', { error: error.message });
    }
  };

  const apiKeyConfigs = [
    { name: 'twilio_api_key', label: 'Twilio API Key', description: 'For SMS services' },
    { name: 'sendgrid_api_key', label: 'SendGrid API Key', description: 'For email services' },
    { name: 'stripe_api_key', label: 'Stripe API Key', description: 'For payment processing' },
    { name: 'aws_access_key', label: 'AWS Access Key', description: 'For cloud services' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Security Configuration</h2>
      </div>

      {/* TLS Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            TLS Configuration
          </CardTitle>
          <CardDescription>
            Transport Layer Security status and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>TLS Status</Label>
              <p className="text-sm text-gray-600">
                Current TLS configuration status
              </p>
            </div>
            <Badge variant={tlsStatus ? "default" : "destructive"}>
              {tlsStatus ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Encryption at Rest</Label>
              <p className="text-sm text-gray-600">
                API keys and sensitive data encryption
              </p>
            </div>
            <Badge variant={encryptionEnabled ? "default" : "secondary"}>
              {encryptionEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          <Button onClick={testTlsConnection} variant="outline">
            Test TLS Connection
          </Button>
        </CardContent>
      </Card>

      {/* API Key Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Management
          </CardTitle>
          <CardDescription>
            Securely store and manage API keys with encryption at rest
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {apiKeyConfigs.map((config) => (
            <div key={config.name} className="space-y-2">
              <Label htmlFor={config.name}>{config.label}</Label>
              <p className="text-sm text-gray-600 mb-2">{config.description}</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id={config.name}
                    type={showKeys[config.name] ? "text" : "password"}
                    value={apiKeys[config.name] || ''}
                    onChange={(e) => handleApiKeyUpdate(config.name, e.target.value)}
                    placeholder="Enter API key..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleKeyVisibility(config.name)}
                  >
                    {showKeys[config.name] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={() => saveApiKey(config.name)}
                  disabled={!apiKeys[config.name]}
                >
                  Save
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              API keys are encrypted at rest using AES encryption. Never share these keys or commit them to version control.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>Security Features</CardTitle>
          <CardDescription>
            Configure additional security features and policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Audit Logging</Label>
              <p className="text-sm text-gray-600">
                Track all user actions and security events
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600">
                Require 2FA for all admin accounts
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Session Timeout</Label>
              <p className="text-sm text-gray-600">
                Automatic logout after inactivity
              </p>
            </div>
            <Switch checked={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityConfig;
