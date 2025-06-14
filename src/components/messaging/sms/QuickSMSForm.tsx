
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Save, MessageSquare, Users, DollarSign, Clock } from 'lucide-react';

interface CampaignData {
  name: string;
  type: 'sms';
  content: string;
  subject: string;
  recipients: string[];
}

interface QuickSMSFormProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
  onSubmit: (status: 'draft' | 'active') => void;
  isLoading: boolean;
  estimatedCost: number;
  characterCount: number;
  smsCount: number;
}

export function QuickSMSForm({
  campaignData,
  setCampaignData,
  onSubmit,
  isLoading,
  estimatedCost,
  characterCount,
  smsCount
}: QuickSMSFormProps) {
  const [recipientText, setRecipientText] = useState('');

  const handleRecipientsChange = (value: string) => {
    setRecipientText(value);
    const recipients = value.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.includes('+'));
    
    setCampaignData({ ...campaignData, recipients });
  };

  const maxCharacters = 160;
  const isLongMessage = smsCount > 1;
  const validRecipients = campaignData.recipients.length;
  const canSend = campaignData.name && campaignData.content && validRecipients > 0;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            Quick SMS Campaign
          </CardTitle>
          <CardDescription className="text-base">
            Send SMS messages instantly to your contacts with real-time delivery tracking
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Campaign Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Flash Sale Alert, Weekly Newsletter..."
              value={campaignData.name}
              onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
              className="h-11"
            />
          </div>

          {/* Message Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-sm font-medium">Message Content *</Label>
              <div className="flex items-center gap-3 text-sm">
                <div className={`flex items-center gap-1 ${characterCount > maxCharacters ? 'text-orange-600' : 'text-gray-500'}`}>
                  <span className="font-medium">{characterCount}</span>
                  <span>/</span>
                  <span>{maxCharacters}</span>
                </div>
                <Badge variant={isLongMessage ? "secondary" : "outline"} className="text-xs">
                  {smsCount} SMS{smsCount > 1 ? ' parts' : ''}
                </Badge>
              </div>
            </div>
            <Textarea
              id="content"
              placeholder="Type your SMS message here... Keep it clear and engaging!"
              value={campaignData.content}
              onChange={(e) => setCampaignData({ ...campaignData, content: e.target.value })}
              className="min-h-[120px] resize-none"
              maxLength={918}
            />
            {isLongMessage && (
              <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>Long messages are split into {smsCount} parts. Each part counts as 1 SMS credit.</span>
              </div>
            )}
          </div>

          {/* Recipients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="recipients" className="text-sm font-medium">Recipients</Label>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-blue-600">{validRecipients}</span>
                <span className="text-gray-500">recipients</span>
              </div>
            </div>
            <Textarea
              id="recipients"
              placeholder="Enter phone numbers (one per line):&#10;+254712345678&#10;+254798765432&#10;+1234567890"
              value={recipientText}
              onChange={(e) => handleRecipientsChange(e.target.value)}
              className="min-h-[100px] font-mono text-sm"
            />
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <div className="font-medium mb-1">Format requirements:</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Include country code (e.g., +254 for Kenya, +1 for US)</li>
                <li>One phone number per line</li>
                <li>Numbers will be validated automatically</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>Estimated Cost:</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                ${estimatedCost.toFixed(2)}
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>{validRecipients} recipients × {smsCount} SMS × $0.05 each</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => onSubmit('draft')}
              variant="outline"
              disabled={isLoading || !campaignData.name || !campaignData.content}
              className="flex items-center gap-2 px-6"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </Button>
            <Button
              onClick={() => onSubmit('active')}
              disabled={isLoading || !canSend}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8"
            >
              <Send className="w-4 h-4" />
              {isLoading ? 'Sending...' : 'Send SMS Campaign'}
            </Button>
          </div>

          {!canSend && campaignData.content && (
            <div className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              {!campaignData.name && "Please enter a campaign name. "}
              {!validRecipients && "Please add at least one valid recipient. "}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
