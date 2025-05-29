
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
import { Send, Save, AlertCircle, DollarSign, Wifi } from 'lucide-react';

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
      .filter(line => line.length > 0 && line.includes('+'));
    
    setCampaignData(prev => ({ ...prev, recipients }));
    
    // Update cost estimation (assuming $0.05 per SMS segment)
    const smsCount = Math.ceil(campaignData.content.length / 160);
    const cost = recipients.length * smsCount * 0.05;
    setEstimatedCost(cost);
  };

  const handleSubmit = async (status: 'draft' | 'active') => {
    if (!campaignData.name || !campaignData.content) {
      toast.error('Please fill in campaign name and message content');
      return;
    }

    if (status === 'active' && campaignData.recipients.length === 0) {
      toast.error('Please add recipients to send the campaign');
      return;
    }

    if (status === 'active' && credits && credits.credits_remaining < estimatedCost) {
      toast.error(`Insufficient credits. You need $${estimatedCost.toFixed(2)} but have $${credits.credits_remaining.toFixed(2)}`);
      return;
    }

    try {
      // Create campaign first
      const campaign = await createCampaign.mutateAsync({
        ...campaignData,
        status,
      });

      if (status === 'active' && campaignData.recipients.length > 0) {
        // Send SMS immediately via Mspace
        await sendSMS.mutateAsync({
          recipients: campaignData.recipients,
          message: campaignData.content,
          sender_id: 'MOBIWAVE',
          campaign_id: campaign.id
        });
        
        toast.success('Campaign sent successfully! Check the Live Tracking tab for real-time updates.');
      } else {
        toast.success(`Campaign ${status === 'draft' ? 'saved as draft' : 'created'} successfully`);
      }
      
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
    } catch (error: any) {
      toast.error(error.message || 'Failed to create campaign');
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
          Create New SMS Campaign
        </CardTitle>
        <CardDescription>
          Design and launch your SMS campaign with Mspace integration and real-time tracking
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="content">Message Content *</Label>
            <div className="text-sm text-gray-500">
              {characterCount}/160 ({smsCount} SMS{smsCount > 1 ? ' segments' : ''})
            </div>
          </div>
          <Textarea
            id="content"
            placeholder="Type your SMS message here..."
            value={campaignData.content}
            onChange={(e) => setCampaignData(prev => ({ ...prev, content: e.target.value }))}
            className="min-h-[120px]"
            maxLength={918} // SMS limit for 6 segments
          />
          <div className="text-xs text-gray-500">
            {smsCount > 1 && `Long messages will be split into ${smsCount} segments`}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipients">Recipients (one per line)</Label>
          <Textarea
            id="recipients"
            placeholder="Enter phone numbers with country code, one per line:&#10;+254712345678&#10;+254798765432"
            onChange={(e) => handleRecipientsChange(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="text-sm text-gray-500">
            Recipients: {campaignData.recipients.length} | Valid format: +254XXXXXXXXX
          </div>
        </div>

        {/* Balance & Cost Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-900">Mspace Balance</span>
            </div>
            {checkBalance.data ? (
              <div className="text-lg font-bold text-purple-600">
                {checkBalance.data.currency} {checkBalance.data.balance}
              </div>
            ) : (
              <div className="text-sm text-purple-600">
                {checkBalance.isLoading ? 'Loading...' : 'Connect to check'}
              </div>
            )}
          </div>
        </div>

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
              campaignData.recipients.length === 0 ||
              !campaignData.name ||
              !campaignData.content
            }
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
            {sendSMS.isPending ? 'Sending via Mspace...' : 'Send Campaign'}
          </Button>
        </div>

        {/* Integration Status */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Mspace API Integration Active</span>
            {checkBalance.data && (
              <span className="text-purple-600">
                • Provider Balance: {checkBalance.data.currency} {checkBalance.data.balance}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
