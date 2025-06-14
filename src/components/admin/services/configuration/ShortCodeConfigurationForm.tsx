
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface ShortCodeConfigurationFormProps {
  configuration: any;
  onConfigurationChange: (field: string, value: any) => void;
}

export function ShortCodeConfigurationForm({ 
  configuration, 
  onConfigurationChange 
}: ShortCodeConfigurationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Short Code Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="short-code">Short Code</Label>
            <Input
              id="short-code"
              placeholder="21234"
              value={configuration.shortCode || ''}
              onChange={(e) => onConfigurationChange('shortCode', e.target.value)}
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
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="service-type">Service Type</Label>
          <Select
            value={configuration.serviceType || ''}
            onValueChange={(value) => onConfigurationChange('serviceType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shared">Shared Short Code</SelectItem>
              <SelectItem value="dedicated">Dedicated Short Code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="keywords">Keywords (comma-separated)</Label>
          <Input
            id="keywords"
            placeholder="START, STOP, HELP"
            value={configuration.keywords || ''}
            onChange={(e) => onConfigurationChange('keywords', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="callback-url">Callback URL</Label>
          <Input
            id="callback-url"
            placeholder="https://your-domain.com/sms/callback"
            value={configuration.callbackUrl || ''}
            onChange={(e) => onConfigurationChange('callbackUrl', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="auto-response">Auto Response Message</Label>
          <Textarea
            id="auto-response"
            placeholder="Thank you for your message. We will respond shortly."
            value={configuration.autoResponse || ''}
            onChange={(e) => onConfigurationChange('autoResponse', e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="enable-delivery-reports"
            checked={configuration.enableDeliveryReports || false}
            onCheckedChange={(checked) => onConfigurationChange('enableDeliveryReports', checked)}
          />
          <Label htmlFor="enable-delivery-reports">Enable Delivery Reports</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="enable-mo-forwarding"
            checked={configuration.enableMoForwarding || false}
            onCheckedChange={(checked) => onConfigurationChange('enableMoForwarding', checked)}
          />
          <Label htmlFor="enable-mo-forwarding">Enable MO Forwarding</Label>
        </div>

        {configuration.enableMoForwarding && (
          <div>
            <Label htmlFor="forwarding-url">MO Forwarding URL</Label>
            <Input
              id="forwarding-url"
              placeholder="https://your-domain.com/sms/mo"
              value={configuration.forwardingUrl || ''}
              onChange={(e) => onConfigurationChange('forwardingUrl', e.target.value)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
