
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface USSDConfigurationFormProps {
  configuration: any;
  onConfigurationChange: (field: string, value: any) => void;
}

export function USSDConfigurationForm({ 
  configuration, 
  onConfigurationChange 
}: USSDConfigurationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>USSD Service Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="service-code">Service Code</Label>
            <Input
              id="service-code"
              placeholder="*123#"
              value={configuration.serviceCode || ''}
              onChange={(e) => onConfigurationChange('serviceCode', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="network">Network</Label>
            <Select
              value={configuration.network || ''}
              onValueChange={(value) => onConfigurationChange('network', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="safaricom">Safaricom</SelectItem>
                <SelectItem value="airtel">Airtel</SelectItem>
                <SelectItem value="telkom">Telkom</SelectItem>
                <SelectItem value="all">All Networks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="callback-url">Callback URL</Label>
          <Input
            id="callback-url"
            placeholder="https://your-domain.com/ussd/callback"
            value={configuration.callbackUrl || ''}
            onChange={(e) => onConfigurationChange('callbackUrl', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="welcome-message">Welcome Message</Label>
          <Textarea
            id="welcome-message"
            placeholder="Welcome to our USSD service..."
            value={configuration.welcomeMessage || ''}
            onChange={(e) => onConfigurationChange('welcomeMessage', e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <Label>Menu Structure</Label>
          <Textarea
            placeholder="Enter menu structure in JSON format..."
            value={JSON.stringify(configuration.menuStructure || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onConfigurationChange('menuStructure', parsed);
              } catch {
                // Invalid JSON, ignore
              }
            }}
            rows={8}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="session-timeout"
            checked={configuration.enableSessionTimeout || false}
            onCheckedChange={(checked) => onConfigurationChange('enableSessionTimeout', checked)}
          />
          <Label htmlFor="session-timeout">Enable Session Timeout</Label>
        </div>

        {configuration.enableSessionTimeout && (
          <div>
            <Label htmlFor="timeout-duration">Timeout Duration (seconds)</Label>
            <Input
              id="timeout-duration"
              type="number"
              placeholder="180"
              value={configuration.timeoutDuration || ''}
              onChange={(e) => onConfigurationChange('timeoutDuration', parseInt(e.target.value) || 0)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
