import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  const sendSingleSMS = useMutation({
    mutationFn: async ({ recipients, message, senderId, campaignId }: SendSMSParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check user credits
      const { data: credits } = await supabase
        .from('user_credits')
        .select('credits_remaining, credits_used')
        .eq('user_id', user.id)
        .single();

      if (!credits || credits.credits_remaining < recipients.length * 0.05) {
        throw new Error('Insufficient credits');
      }

      const results = [];
      let totalCost = 0;
      
      for (const recipient of recipients) {
        try {
          // Simulate SMS sending - in real implementation, call actual SMS service
          const cost = 0.05; // Fixed cost per SMS
          totalCost += cost;

          // Record message in history
          const { data: messageRecord, error } = await supabase
            .from('message_history')
            .insert({
              user_id: user.id,
              campaign_id: campaignId,
              type: 'sms',
              sender: senderId || 'MOBIWAVE',
              recipient: recipient.replace(/\D/g, ''),
              content: message,
              status: 'sent',
              cost: cost,
              provider: 'mspace',
              provider_message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              sent_at: new Date().toISOString()
            })
            .select()
            .single();

          if (error) throw error;

          results.push({ 
            recipient, 
            success: true, 
            messageId: messageRecord.id,
            cost 
          });

          // Simulate delivery after a short delay
          setTimeout(async () => {
            await supabase
              .from('message_history')
              .update({ 
                status: 'delivered', 
                delivered_at: new Date().toISOString() 
              })
              .eq('id', messageRecord.id);
          }, Math.random() * 3000 + 1000);

        } catch (error: any) {
          results.push({ 
            recipient, 
            success: false, 
            error: error.message,
            cost: 0 
          });
        }
      }

      // Deduct credits
      await supabase
        .from('user_credits')
        .update({ 
          credits_remaining: credits.credits_remaining - totalCost,
          credits_used: (credits.credits_used || 0) + totalCost
        })
        .eq('user_id', user.id);

      // Record credit transaction
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: -totalCost,
          transaction_type: 'sms_send',
          description: `SMS campaign: ${recipients.length} messages`,
          reference_id: campaignId || `sms_${Date.now()}`
        });

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
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to send SMS: ${error.message}`);
    }
  });

  const sendBulkSMS = useMutation({
    mutationFn: async ({ recipients, message, senderId, campaignName }: BulkSMSParams) => {
      setIsLoading(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Create campaign
        const { data: campaign, error: campaignError } = await supabase
          .from('campaigns')
          .insert({
            name: campaignName,
            type: 'sms',
            content: message,
            sender_id: senderId || 'MOBIWAVE',
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
        const failCount = results.filter(r => r.success).length;
        const totalCost = results.reduce((sum, r) => sum + (r.cost || 0), 0);

        await supabase
          .from('campaigns')
          .update({
            status: 'completed',
            sent_count: successCount,
            delivered_count: successCount, // Initially assume sent = delivered
            failed_count: failCount,
            total_cost: totalCost,
            completed_at: new Date().toISOString()
          })
          .eq('id', campaign.id);

        // Update campaign recipients status
        for (const result of results) {
          const status = result.success ? 'sent' : 'failed';
          await supabase
            .from('campaign_recipients')
            .update({ 
              status,
              sent_at: result.success ? new Date().toISOString() : null,
              failed_at: !result.success ? new Date().toISOString() : null,
              error_message: result.success ? null : result.error
            })
            .eq('campaign_id', campaign.id)
            .eq('recipient_value', result.recipient.replace(/\D/g, ''));
        }

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: credits } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', user.id)
        .single();

      return { balance: credits?.credits_remaining || 0 };
    } catch (error) {
      console.error('Error checking balance:', error);
      throw error;
    }
  };

  return {
    sendSMS: sendSingleSMS.mutateAsync,
    sendBulkSMS: sendBulkSMS.mutateAsync,
    checkBalance,
    isLoading: isLoading || sendSingleSMS.isPending || sendBulkSMS.isPending
  };
};
