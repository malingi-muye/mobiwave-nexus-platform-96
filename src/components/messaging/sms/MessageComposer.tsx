
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Eye, Settings } from 'lucide-react';
import { PersonalizationPanel } from './PersonalizationPanel';

interface MessageComposerProps {
  onCampaignUpdate?: (campaign: any) => void;
  campaign?: any;
}

export function MessageComposer({ onCampaignUpdate, campaign }: MessageComposerProps) {
  const [message, setMessage] = useState(campaign?.message || '');
  const [senderId, setSenderId] = useState(campaign?.senderId || '');
  const [campaignName, setCampaignName] = useState(campaign?.name || '');
  const [characterCount, setCharacterCount] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);

  const maxCharacters = 160;
  const smsCount = Math.ceil(characterCount / maxCharacters);

  const handleMessageChange = (value: string) => {
    setMessage(value);
    setCharacterCount(value.length);
    
    if (onCampaignUpdate) {
      onCampaignUpdate({
        ...campaign,
        message: value,
        characterCount: value.length,
        smsCount: Math.ceil(value.length / maxCharacters)
      });
    }
  };

  const insertPersonalization = (key: string) => {
    const newMessage = message + key;
    handleMessageChange(newMessage);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Message Composer
                </CardTitle>
                <CardDescription>
                  Create your SMS message with personalization options
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                placeholder="Enter campaign name..."
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderId">Sender ID</Label>
              <Select value={senderId} onValueChange={setSenderId}>
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Select sender ID" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMPANY">COMPANY</SelectItem>
                  <SelectItem value="PROMO">PROMO</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="+1234567890">+1234567890</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="message">Message Content</Label>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className={characterCount > maxCharacters ? 'text-red-500' : ''}>
                    {characterCount}/{maxCharacters}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {smsCount} SMS
                  </Badge>
                </div>
              </div>
              
              {previewMode ? (
                <div className="min-h-[120px] p-3 border rounded-lg bg-gray-50 border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Preview:</div>
                  <div className="whitespace-pre-wrap">
                    {message.replace(/{firstName}/g, 'John')
                            .replace(/{lastName}/g, 'Doe')
                            .replace(/{company}/g, 'Acme Corp')
                            .replace(/{phone}/g, '+1234567890')
                            .replace(/{customField1}/g, 'Custom Value')}
                  </div>
                </div>
              ) : (
                <Textarea
                  id="message"
                  placeholder="Type your message here... Use {firstName}, {lastName}, etc. for personalization"
                  value={message}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  className="min-h-[120px] border-gray-200 resize-none"
                  maxLength={500}
                />
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
              <Button variant="outline" size="sm">
                Save Draft
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Options
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <PersonalizationPanel
          characterCount={characterCount}
          smsCount={smsCount}
          onInsertPersonalization={insertPersonalization}
        />
      </div>
    </div>
  );
}
