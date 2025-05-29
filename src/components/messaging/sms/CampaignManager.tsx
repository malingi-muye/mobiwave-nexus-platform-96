
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCampaign, useUpdateCampaign } from '@/hooks/useCampaigns';
import { useUserCredits } from '@/hooks/useUserCredits';
import { toast } from 'sonner';
import { Send, Save, AlertCircle } from 'lucide-react';

interface CampaignManagerProps {
  onSuccess?: () => void;
}

export function CampaignManager({ onSuccess }: CampaignManagerProps) {
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: 'sms' as 'sms' | 'email' | 'whatsapp',
    content: '',
    subject: '',
  });

  const createCampaign = useCreateCampaign();
  const { data: credits } = useUserCredits();
  const [estimatedCost, setEstimatedCost] = useState(0);

  const handleSubmit = async (status: 'draft' | 'active') => {
    if (!campaignData.name || !campaignData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (status === 'active' && credits && credits.credits_remaining < estimatedCost) {
      toast.error('Insufficient credits to send campaign');
      return;
    }

    try {
      await createCampaign.mutateAsync({
        ...campaignData,
        status,
      });

      toast.success(`Campaign ${status === 'draft' ? 'saved as draft' : 'created and activated'} successfully`);
      
      // Reset form
      setCampaignData({
        name: '',
        type: 'sms',
        content: '',
        subject: '',
      });

      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create campaign');
      console.error('Campaign creation error:', error);
    }
  };

  const characterCount = campaignData.content.length;
  const smsCount = Math.ceil(characterCount / 160);
  const costPerSMS = 0.05;
  
  React.useEffect(() => {
    setEstimatedCost(smsCount * costPerSMS);
  }, [smsCount]);

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" />
          Create New Campaign
        </CardTitle>
        <CardDescription>
          Design and launch your messaging campaign
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

        {/* Cost Estimation */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Cost Estimation</span>
          </div>
          <div className="text-sm text-blue-800">
            <p>Estimated cost: ${estimatedCost.toFixed(2)} ({smsCount} SMS)</p>
            <p>Available credits: {credits?.credits_remaining || 0}</p>
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
            disabled={createCampaign.isPending || (credits && credits.credits_remaining < estimatedCost)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
            {createCampaign.isPending ? 'Creating...' : 'Launch Campaign'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
