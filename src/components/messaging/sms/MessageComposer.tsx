
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, User, Calendar, Phone, Mail, Building } from 'lucide-react';

interface MessageComposerProps {
  onCampaignUpdate: (campaign: any) => void;
  campaign: any;
}

export function MessageComposer({ onCampaignUpdate, campaign }: MessageComposerProps) {
  const [message, setMessage] = useState(campaign?.message || '');
  const [campaignName, setCampaignName] = useState(campaign?.name || '');
  const [senderId, setSenderId] = useState(campaign?.senderId || 'YOURCOMPANY');
  const [showPreview, setShowPreview] = useState(false);

  const variables = [
    { key: '{firstName}', icon: User, description: 'Recipient first name' },
    { key: '{lastName}', icon: User, description: 'Recipient last name' },
    { key: '{email}', icon: Mail, description: 'Recipient email' },
    { key: '{phone}', icon: Phone, description: 'Recipient phone' },
    { key: '{company}', icon: Building, description: 'Company name' },
    { key: '{date}', icon: Calendar, description: 'Current date' },
  ];

  const senderIds = [
    'YOURCOMPANY',
    'MARKETING',
    'SUPPORT',
    'ALERTS',
    'PROMO'
  ];

  const characterCount = message.length;
  const smsCount = Math.ceil(characterCount / 160);

  useEffect(() => {
    onCampaignUpdate({
      ...campaign,
      message,
      name: campaignName,
      senderId,
      characterCount,
      smsCount
    });
  }, [message, campaignName, senderId, characterCount, smsCount]);

  const insertVariable = (variable: string) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.substring(0, start) + variable + message.substring(end);
      setMessage(newMessage);
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const previewMessage = message
    .replace(/{firstName}/g, 'John')
    .replace(/{lastName}/g, 'Doe')
    .replace(/{email}/g, 'john.doe@example.com')
    .replace(/{phone}/g, '+1234567890')
    .replace(/{company}/g, 'Acme Corp')
    .replace(/{date}/g, new Date().toLocaleDateString());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              Message Composer
            </CardTitle>
            <CardDescription>
              Create your SMS message with personalization variables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input
                  id="campaignName"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="senderId">Sender ID</Label>
                <Select value={senderId} onValueChange={setSenderId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select sender ID" />
                  </SelectTrigger>
                  <SelectContent>
                    {senderIds.map((id) => (
                      <SelectItem key={id} value={id}>{id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message Content</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here... Use variables like {firstName} for personalization."
                className="mt-1 min-h-[120px] resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>{characterCount}/1000 characters</span>
                <Badge variant={smsCount > 1 ? "destructive" : "secondary"}>
                  {smsCount} SMS{smsCount > 1 ? ' parts' : ''}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>

            {showPreview && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-sm">Message Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-2">From: {senderId}</div>
                    <div className="text-sm">{previewMessage}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Personalization Variables</CardTitle>
            <CardDescription>
              Click to insert variables into your message
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {variables.map((variable) => (
                <Button
                  key={variable.key}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all"
                  onClick={() => insertVariable(variable.key)}
                >
                  <variable.icon className="w-4 h-4 mr-3 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{variable.key}</div>
                    <div className="text-xs text-gray-500">{variable.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
