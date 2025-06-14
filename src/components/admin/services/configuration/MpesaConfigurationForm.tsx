
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Shield } from 'lucide-react';

interface MpesaConfigurationFormProps {
  configuration: any;
  onConfigurationChange: (field: string, value: any) => void;
}

export function MpesaConfigurationForm({
  configuration,
  onConfigurationChange
}: MpesaConfigurationFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            M-Pesa Integration Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paybill-number">Paybill Number</Label>
              <Input
                id="paybill-number"
                placeholder="Enter paybill number"
                value={configuration.paybillNumber || ''}
                onChange={(e) => onConfigurationChange('paybillNumber', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="till-number">Till Number (Optional)</Label>
              <Input
                id="till-number"
                placeholder="Enter till number"
                value={configuration.tillNumber || ''}
                onChange={(e) => onConfigurationChange('tillNumber', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="callback-url">Callback URL</Label>
            <Input
              id="callback-url"
              placeholder="https://yourdomain.com/mpesa/callback"
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min-amount">Minimum Amount (KES)</Label>
              <Input
                id="min-amount"
                type="number"
                value={configuration.minimumAmount || 10}
                onChange={(e) => onConfigurationChange('minimumAmount', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="max-amount">Maximum Amount (KES)</Label>
              <Input
                id="max-amount"
                type="number"
                value={configuration.maximumAmount || 70000}
                onChange={(e) => onConfigurationChange('maximumAmount', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-reconcile">Auto Reconciliation</Label>
                <p className="text-sm text-gray-600">Automatically reconcile transactions</p>
              </div>
              <Switch
                id="auto-reconcile"
                checked={configuration.autoReconciliation || false}
                onCheckedChange={(checked) => onConfigurationChange('autoReconciliation', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="real-time-notifications">Real-time Notifications</Label>
                <p className="text-sm text-gray-600">Send instant payment notifications</p>
              </div>
              <Switch
                id="real-time-notifications"
                checked={configuration.realTimeNotifications || true}
                onCheckedChange={(checked) => onConfigurationChange('realTimeNotifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="encryption-level">Encryption Level</Label>
            <Select
              value={configuration.encryptionLevel || 'standard'}
              onValueChange={(value) => onConfigurationChange('encryptionLevel', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="enhanced">Enhanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="fraud-detection">Fraud Detection</Label>
              <p className="text-sm text-gray-600">Enable fraud detection algorithms</p>
            </div>
            <Switch
              id="fraud-detection"
              checked={configuration.fraudDetection || true}
              onCheckedChange={(checked) => onConfigurationChange('fraudDetection', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
