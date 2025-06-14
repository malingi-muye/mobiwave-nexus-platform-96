
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface MpesaConfigurationFormProps {
  configuration: any;
  onConfigurationChange: (field: string, value: any) => void;
}

export function MpesaConfigurationForm({ 
  configuration, 
  onConfigurationChange 
}: MpesaConfigurationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>M-Pesa Integration Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="paybill-number">Paybill Number</Label>
            <Input
              id="paybill-number"
              placeholder="123456"
              value={configuration.paybillNumber || ''}
              onChange={(e) => onConfigurationChange('paybillNumber', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="till-number">Till Number (Optional)</Label>
            <Input
              id="till-number"
              placeholder="123456"
              value={configuration.tillNumber || ''}
              onChange={(e) => onConfigurationChange('tillNumber', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="callback-url">Callback URL</Label>
          <Input
            id="callback-url"
            placeholder="https://your-domain.com/mpesa/callback"
            value={configuration.callbackUrl || ''}
            onChange={(e) => onConfigurationChange('callbackUrl', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="response-type">Callback Response Type</Label>
          <Select
            value={configuration.responseType || 'json'}
            onValueChange={(value) => onConfigurationChange('responseType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select response type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="xml">XML</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="auto-reconciliation"
            checked={configuration.autoReconciliation || false}
            onCheckedChange={(checked) => onConfigurationChange('autoReconciliation', checked)}
          />
          <Label htmlFor="auto-reconciliation">Enable Auto Reconciliation</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="real-time-notifications"
            checked={configuration.realTimeNotifications || false}
            onCheckedChange={(checked) => onConfigurationChange('realTimeNotifications', checked)}
          />
          <Label htmlFor="real-time-notifications">Real-time Notifications</Label>
        </div>

        {configuration.realTimeNotifications && (
          <div>
            <Label htmlFor="notification-url">Notification URL</Label>
            <Input
              id="notification-url"
              placeholder="https://your-domain.com/mpesa/notifications"
              value={configuration.notificationUrl || ''}
              onChange={(e) => onConfigurationChange('notificationUrl', e.target.value)}
            />
          </div>
        )}

        <div>
          <Label htmlFor="minimum-amount">Minimum Transaction Amount</Label>
          <Input
            id="minimum-amount"
            type="number"
            placeholder="1"
            value={configuration.minimumAmount || ''}
            onChange={(e) => onConfigurationChange('minimumAmount', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <Label htmlFor="maximum-amount">Maximum Transaction Amount</Label>
          <Input
            id="maximum-amount"
            type="number"
            placeholder="150000"
            value={configuration.maximumAmount || ''}
            onChange={(e) => onConfigurationChange('maximumAmount', parseFloat(e.target.value) || 0)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
