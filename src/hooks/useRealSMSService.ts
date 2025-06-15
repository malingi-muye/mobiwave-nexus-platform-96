
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMspaceService } from './useMspaceService';

interface SendSMSParams {
  recipients: string[];
  message: string;
  senderId?: string;
  campaignId?: string;
}

interface BulkSMSParams extends SendSMSParams {
  campaignName: string;
}

export const useRealSMSService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const mspaceService = useMspaceService();

  const sendSMS = async (params: SendSMSParams) => {
    setIsLoading(true);
    try {
      // First, create a campaign record
      let campaignId = params.campaignId;
      
      if (!campaignId) {
        const { data: campaign, error: campaignError } = await supabase
          .from('campaigns')
          .insert({
            name: `SMS Campaign - ${new Date().toLocaleString()}`,
            type: 'sms',
            content: params.message,
            recipient_count: params.recipients.length,
            status: 'sending'
          })
          .select()
          .single();

        if (campaignError) throw campaignError;
        campaignId = campaign.id;
      }

      // Send via Mspace
      const result = await mspaceService.sendSMS({
        ...params,
        campaignId
      });

      // Update campaign with results
      await supabase
        .from('campaigns')
        .update({
          status: 'completed',
          sent_count: result.summary?.successful || 0,
          failed_count: result.summary?.failed || 0,
          cost: result.summary?.totalCost || 0,
          sent_at: new Date().toISOString(),
          metadata: {
            mspace_results: result.results,
            summary: result.summary
          }
        })
        .eq('id', campaignId);

      return result;
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendBulkSMS = async (params: BulkSMSParams) => {
    return sendSMS({
      recipients: params.recipients,
      message: params.message,
      senderId: params.senderId
    });
  };

  const checkBalance = async () => {
    return mspaceService.checkBalance();
  };

  return {
    sendSMS,
    sendBulkSMS,
    checkBalance,
    isLoading: isLoading || mspaceService.isLoading
  };
};
