
import React, { useState } from 'react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useMspaceApi } from '@/hooks/useMspaceApi';
import { toast } from 'sonner';
import { CampaignForm } from './CampaignForm';
import { CampaignStatus } from './CampaignStatus';

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

  const { createCampaign } = useCampaigns();
  const { data: credits } = useUserCredits();
  const { sendSMS, checkBalance } = useMspaceApi();
  const [estimatedCost, setEstimatedCost] = useState(0);

  const characterCount = campaignData.content.length;
  const smsCount = Math.ceil(characterCount / 160);

  React.useEffect(() => {
    const cost = campaignData.recipients.length * smsCount * 0.05;
    setEstimatedCost(cost);
  }, [smsCount, campaignData.recipients.length]);

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
      const campaign = await createCampaign.mutateAsync({
        ...campaignData,
        status,
        recipient_count: campaignData.recipients.length,
        delivered_count: 0,
        failed_count: 0,
        total_cost: estimatedCost,
        scheduled_at: null
      });

      if (status === 'active' && campaignData.recipients.length > 0) {
        await sendSMS.mutateAsync({
          recipients: campaignData.recipients,
          message: campaignData.content,
          senderId: 'MOBIWAVE',
          campaignId: campaign.id
        });
        
        toast.success('Campaign sent successfully! Check the Live Tracking tab for real-time updates.');
      } else {
        toast.success(`Campaign ${status === 'draft' ? 'saved as draft' : 'created'} successfully`);
      }
      
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

  return (
    <div className="space-y-6">
      <CampaignForm
        campaignData={campaignData}
        setCampaignData={setCampaignData}
        onSubmit={handleSubmit}
        isLoading={createCampaign.isPending || sendSMS.isPending}
        estimatedCost={estimatedCost}
        characterCount={characterCount}
        smsCount={smsCount}
      />
      <CampaignStatus checkBalance={checkBalance} />
    </div>
  );
}
