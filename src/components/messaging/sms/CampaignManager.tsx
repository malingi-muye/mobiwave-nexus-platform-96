
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCampaign } from '@/hooks/useCampaigns';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useMspaceApi } from '@/hooks/useMspaceApi';
import { toast } from 'sonner';
import { Send, Save, AlertCircle, DollarSign } from 'lucide-react';

interface CampaignManagerProps {
  onSuccess?: () => void;
}

export function CampaignManager({ onSuccess }: CampaignManagerProps) {
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: 'sms' as 'sms' | 'email' | 'whatsapp',
    content: '',
    subject: '',
    recipients: [] as string[]
  });

  const createCampaign = useCreateCampaign();
  const { data: credits } = useUserCredits();
  const { sendSMS, checkBalance } = useMspaceApi();
  const [estimatedCost, setEstimatedCost] = useState(0);

  const handleRecipientsChange = (value: string) => {
    const recipients = value.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    setCampaignData(prev => ({ ...prev, recipients }));
    
    // Update cost estimation
    const smsCount = Math.ceil(campaignData.content.length / 160);
    const cost = recipients.length * smsCount * 0.05;
    setEstimatedCost(cost);
  };

  const handleSubmit = async (status: 'draft' | 'active') => {
    if (!campaignData.name || !campaignData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (status === 'active' && campaignData.recipients.length === 0) {
      toast.error('Please add recipients to send the campaign');
      return;
    }

    if (status === 'active' && credits && credits.credits_remaining < estimatedCost) {
      toast.error('Insufficient credits to send campaign');
      return;
    }

    try {
      // Create campaign first
      const campaign = await createCampaign.mutateAsync({
        ...campaignData,
        status,
      });

      if (status === 'active' && campaignData.recipients.length > 0) {
        // Send SMS immediately
        await sendSMS.mutateAsync({
          recipients: campaignData.recipients,
          message: campaignData.content,
          sender_id: 'MOBIWAVE',
          campaign_id: campaign.id
        });
      }

      toast.success(`Campaign ${status === 'draft' ? 'saved as draft' : 'created and sent'} successfully`);
      
      // Reset form
      setCampaignData({
        name: '',
        type: 'sms',
        content: '',
        subject: '',
        recipients: []
      });
      setEstimatedCost(0);

      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create campaign');
      console.error('Campaign creation error:', error);
    }
  };

  const characterCount = campaignData.content.length;
  const smsCount = Math.ceil(characterCount / 160);
  
  React.useEffect(() => {
    const cost = campaignData.recipients.length * smsCount * 0.05;
    setEstimatedCost(cost);
  }, [smsCount, campaignData.recipients.length]);

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" />
          Create New Campaign
        </CardTitle>
        <CardDescription>
          Design and launch your messaging campaign with Mspace integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              placeholder="Enter campaign name..."
              value={campaignData.name}
              onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Campaign Type</Label>
            <Select 
              value={campaignData.type} 
              onValueChange={(value: 'sms' | 'email' | 'whatsapp') => 
                setCampaignData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {campaignData.type === 'email' && (
          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject..."
              value={campaignData.subject}
              onChange={(e) => setCampaignData(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="content">Message Content *</Label>
            <div className="text-sm text-gray-500">
              {characterCount}/160 ({smsCount} SMS)
            </div>
          </div>
          <Textarea
            id="content"
            placeholder="Type your message here..."
            value={campaignData.content}
            onChange={(e) => setCampaignData(prev => ({ ...prev, content: e.target.value }))}
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipients">Recipients (one per line)</Label>
          <Textarea
            id="recipients"
            placeholder="Enter phone numbers, one per line (e.g., +254712345678)"
            onChange={(e) => handleRecipientsChange(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="text-sm text-gray-500">
            Recipients: {campaignData.recipients.length}
          </div>
        </div>

        {/* Balance & Cost Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">Your Credits</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              ${credits?.credits_remaining?.toFixed(2) || '0.00'}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Campaign Cost</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              ${estimatedCost.toFixed(2)}
            </div>
            <div className="text-xs text-blue-800">
              {campaignData.recipients.length} recipients × {smsCount} SMS
            </div>
          </div>
        </div>

        {/* Mspace Balance */}
        {checkBalance.data && (
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-900">Mspace Balance</span>
            </div>
            <div className="text-lg font-bold text-purple-600">
              {checkBalance.data.currency} {checkBalance.data.balance}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={() => handleSubmit('draft')}
            variant="outline"
            disabled={createCampaign.isPending}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit('active')}
            disabled={
              createCampaign.isPending || 
              sendSMS.isPending ||
              (credits && credits.credits_remaining < estimatedCost) ||
              campaignData.recipients.length === 0
            }
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
            {sendSMS.isPending ? 'Sending...' : 'Send Campaign'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
