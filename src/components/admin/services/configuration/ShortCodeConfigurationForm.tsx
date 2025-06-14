
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users } from 'lucide-react';

interface ShortCodeConfigurationFormProps {
  configuration: any;
  onConfigurationChange: (field: string, value: any) => void;
}

export function ShortCodeConfigurationForm({
  configuration,
  onConfigurationChange
}: ShortCodeConfigurationFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Short Code Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="short-code">Short Code</Label>
              <Input
                id="short-code"
                placeholder="22122"
                value={configuration.shortCode || ''}
                onChange={(e) => onConfigurationChange('shortCode', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="code-type">Code Type</Label>
              <Select
                value={configuration.codeType || 'shared'}
                onValueChange={(value) => onConfigurationChange('codeType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dedicated">Dedicated</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="keyword">Keyword</Label>
              <Input
                id="keyword"
                placeholder="INFO"
                value={configuration.keyword || ''}
                onChange={(e) => onConfigurationChange('keyword', e.target.value.toUpperCase())}
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
            <Label htmlFor="auto-response">Auto Response Message</Label>
            <Textarea
              id="auto-response"
              placeholder="Thank you for your message. We will get back to you shortly."
              value={configuration.autoResponse || ''}
              onChange={(e) => onConfigurationChange('autoResponse', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rate-limit">Rate Limit (per minute)</Label>
              <Input
                id="rate-limit"
                type="number"
                value={configuration.rateLimit || 60}
                onChange={(e) => onConfigurationChange('rateLimit', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="message-length">Max Message Length</Label>
              <Input
                id="message-length"
                type="number"
                value={configuration.maxMessageLength || 160}
                onChange={(e) => onConfigurationChange('maxMessageLength', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-keywords">Enable Keyword Filtering</Label>
                <p className="text-sm text-gray-600">Filter messages by keywords</p>
              </div>
              <Switch
                id="enable-keywords"
                checked={configuration.enableKeywords || false}
                onCheckedChange={(checked) => onConfigurationChange('enableKeywords', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="delivery-reports">Delivery Reports</Label>
                <p className="text-sm text-gray-600">Receive delivery confirmation</p>
              </div>
              <Switch
                id="delivery-reports"
                checked={configuration.deliveryReports || true}
                onCheckedChange={(checked) => onConfigurationChange('deliveryReports', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-600" />
            Campaign Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opt-in-keyword">Opt-in Keyword</Label>
              <Input
                id="opt-in-keyword"
                placeholder="JOIN"
                value={configuration.optInKeyword || ''}
                onChange={(e) => onConfigurationChange('optInKeyword', e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <Label htmlFor="opt-out-keyword">Opt-out Keyword</Label>
              <Input
                id="opt-out-keyword"
                placeholder="STOP"
                value={configuration.optOutKeyword || 'STOP'}
                onChange={(e) => onConfigurationChange('optOutKeyword', e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-opt-management">Automatic Opt Management</Label>
              <p className="text-sm text-gray-600">Handle opt-ins/opt-outs automatically</p>
            </div>
            <Switch
              id="auto-opt-management"
              checked={configuration.autoOptManagement || true}
              onCheckedChange={(checked) => onConfigurationChange('autoOptManagement', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
