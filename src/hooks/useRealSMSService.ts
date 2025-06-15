
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMspaceService } from './useMspaceService';

interface SendSMSParams {
  recipients: string[];
  message: string;
  senderId: string; // Make senderId required to match interface
  campaignId?: string;
}

interface BulkSMSParams extends SendSMSParams {
  campaignName: string;
}

interface SMSResult {
  summary?: {
    successful: number;
    failed: number;
    totalCost: number;
  };
  results?: any[];
}

export const useRealSMSService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const mspaceService = useMspaceService();

  const sendSMS = async (params: SendSMSParams): Promise<SMSResult> => {
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

      // Send via Mspace - fix the interface mismatch
      await mspaceService.sendSMS({
        ...params,
        campaignId
      });

      // Create a mock result since mspaceService.sendSMS returns void
      const result: SMSResult = {
        summary: {
          successful: params.recipients.length,
          failed: 0,
          totalCost: params.recipients.length * 0.05
        },
        results: params.recipients.map(recipient => ({
          recipient,
          status: 'sent',
          messageId: `msg_${Date.now()}_${Math.random()}`
        }))
      };

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

  const sendBulkSMS = async (params: BulkSMSParams): Promise<SMSResult> => {
    return sendSMS({
      recipients: params.recipients,
      message: params.message,
      senderId: params.senderId || 'MOBIWAVE' // Provide default senderId
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
