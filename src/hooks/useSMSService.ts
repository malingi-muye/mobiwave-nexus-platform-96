
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

export const useSMSService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const mspaceService = useMspaceService();

  const sendSingleSMS = useMutation({
    mutationFn: async ({ recipients, message, senderId, campaignId }: SendSMSParams) => {
      const { data: credentials } = await supabase
        .from('api_credentials')
        .select('*')
        .eq('provider', 'mspace')
        .eq('is_active', true)
        .single();

      if (!credentials) {
        throw new Error('No active API credentials found');
      }

      const results = [];
      
      for (const recipient of recipients) {
        try {
          const result = await mspaceService.sendSMS({
            username: credentials.username,
            senderId: senderId || credentials.sender_id,
            recipient: recipient.replace(/\D/g, ''), // Remove non-digits
            message,
            campaignId
          });
          
          results.push({ recipient, success: true, result });
        } catch (error) {
          results.push({ recipient, success: false, error: error.message });
        }
      }

      return results;
    },
    onSuccess: (results) => {
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      if (successCount > 0) {
        toast.success(`${successCount} SMS sent successfully`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} SMS failed to send`);
      }
      
      queryClient.invalidateQueries({ queryKey: ['message-history'] });
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to send SMS: ${error.message}`);
    }
  });

  const sendBulkSMS = useMutation({
    mutationFn: async ({ recipients, message, senderId, campaignName }: BulkSMSParams) => {
      setIsLoading(true);
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Create campaign
        const { data: campaign, error: campaignError } = await supabase
          .from('campaigns')
          .insert({
            name: campaignName,
            type: 'sms',
            content: message,
            sender_id: senderId,
            status: 'active',
            recipient_count: recipients.length,
            user_id: user.id
          })
          .select()
          .single();

        if (campaignError) throw campaignError;

        // Create campaign recipients
        const campaignRecipients = recipients.map(recipient => ({
          campaign_id: campaign.id,
          recipient_type: 'phone',
          recipient_value: recipient.replace(/\D/g, ''),
          status: 'pending' as const
        }));

        const { error: recipientsError } = await supabase
          .from('campaign_recipients')
          .insert(campaignRecipients);

        if (recipientsError) throw recipientsError;

        // Send SMS to all recipients
        const results = await sendSingleSMS.mutateAsync({
          recipients,
          message,
          senderId,
          campaignId: campaign.id
        });

        // Update campaign status
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        await supabase
          .from('campaigns')
          .update({
            status: 'completed',
            sent_count: successCount,
            delivered_count: successCount, // Assume sent = delivered for now
            failed_count: failCount,
            completed_at: new Date().toISOString()
          })
          .eq('id', campaign.id);

        return { campaign, results };
        
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: ({ results }) => {
      const successCount = results.filter(r => r.success).length;
      toast.success(`Bulk SMS campaign completed: ${successCount} messages sent`);
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    }
  });

  const checkBalance = async () => {
    try {
      return await mspaceService.checkBalance();
    } catch (error) {
      console.error('Error checking balance:', error);
      throw error;
    }
  };

  const getDeliveryReport = async (messageId: string) => {
    try {
      const { data: credentials } = await supabase
        .from('api_credentials')
        .select('username')
        .eq('provider', 'mspace')
        .eq('is_active', true)
        .single();

      if (!credentials) {
        throw new Error('No active API credentials found');
      }

      return await mspaceService.getDeliveryReport({
        username: credentials.username,
        messageId
      });
    } catch (error) {
      console.error('Error getting delivery report:', error);
      throw error;
    }
  };

  return {
    sendSMS: sendSingleSMS.mutateAsync,
    sendBulkSMS: sendBulkSMS.mutateAsync,
    checkBalance,
    getDeliveryReport,
    isLoading: isLoading || sendSingleSMS.isPending || sendBulkSMS.isPending,
    sendSingleSMS,
    sendBulkSMS
  };
};
