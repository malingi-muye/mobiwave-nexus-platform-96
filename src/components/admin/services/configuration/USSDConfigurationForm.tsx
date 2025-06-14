
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare } from 'lucide-react';

interface USSDConfigurationFormProps {
  configuration: any;
  onConfigurationChange: (field: string, value: any) => void;
}

export function USSDConfigurationForm({
  configuration,
  onConfigurationChange
}: USSDConfigurationFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            USSD Service Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="welcome-message">Welcome Message</Label>
            <Textarea
              id="welcome-message"
              placeholder="Enter welcome message for users"
              value={configuration.welcomeMessage || ''}
              onChange={(e) => onConfigurationChange('welcomeMessage', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Menu Structure</Label>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(configuration.menuStructure || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center gap-3 p-2 bg-white rounded border">
                    <Badge variant="outline">{key}</Badge>
                    <span className="flex-1">{value.text}</span>
                    <Badge variant="secondary">{value.action}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="session-timeout">Session Timeout (seconds)</Label>
              <Input
                id="session-timeout"
                type="number"
                className="w-24"
                value={configuration.sessionTimeout || 60}
                onChange={(e) => onConfigurationChange('sessionTimeout', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="max-menu-depth">Max Menu Depth</Label>
              <Input
                id="max-menu-depth"
                type="number"
                className="w-24"
                value={configuration.maxMenuDepth || 5}
                onChange={(e) => onConfigurationChange('maxMenuDepth', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-terminate">Auto-terminate inactive sessions</Label>
              <p className="text-sm text-gray-600">Automatically end sessions after timeout</p>
            </div>
            <Switch
              id="auto-terminate"
              checked={configuration.autoTerminate || false}
              onCheckedChange={(checked) => onConfigurationChange('autoTerminate', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
