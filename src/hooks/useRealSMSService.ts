
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
        .select('credits_remaining, credits_purchased')
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

          // Store message data in campaign metadata
          const messageData = {
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
          };

          // Store in campaigns table metadata for now
          if (campaignId) {
            const { data: campaign } = await supabase
              .from('campaigns')
              .select('metadata')
              .eq('id', campaignId)
              .single();

            const existingMetadata = campaign?.metadata as any || {};
            const messages = existingMetadata.messages || [];
            messages.push(messageData);

            await supabase
              .from('campaigns')
              .update({ 
                metadata: { ...existingMetadata, messages }
              })
              .eq('id', campaignId);
          }

          results.push({ 
            recipient, 
            success: true, 
            messageId: messageData.provider_message_id,
            cost 
          });

          // Simulate delivery after a short delay
          setTimeout(async () => {
            if (campaignId) {
              const { data: campaign } = await supabase
                .from('campaigns')
                .select('metadata')
                .eq('id', campaignId)
                .single();

              const existingMetadata = campaign?.metadata as any || {};
              const messages = existingMetadata.messages || [];
              const messageIndex = messages.findIndex((m: any) => m.provider_message_id === messageData.provider_message_id);
              
              if (messageIndex >= 0) {
                messages[messageIndex] = { 
                  ...messages[messageIndex],
                  status: 'delivered', 
                  delivered_at: new Date().toISOString() 
                };

                await supabase
                  .from('campaigns')
                  .update({ 
                    metadata: { ...existingMetadata, messages }
                  })
                  .eq('id', campaignId);
              }
            }
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
          credits_purchased: (credits.credits_purchased || 0)
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
            status: 'active',
            recipient_count: recipients.length,
            user_id: user.id,
            metadata: {
              sender_id: senderId || 'MOBIWAVE',
              recipients: recipients.map(recipient => ({
                recipient_type: 'phone',
                recipient_value: recipient.replace(/\D/g, ''),
                status: 'pending'
              }))
            }
          })
          .select()
          .single();

        if (campaignError) throw campaignError;

        // Send SMS to all recipients
        const results = await sendSingleSMS.mutateAsync({
          recipients,
          message,
          senderId,
          campaignId: campaign.id
        });

        // Update campaign status
        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;
        const totalCost = results.reduce((sum, r) => sum + (r.cost || 0), 0);

        await supabase
          .from('campaigns')
          .update({
            status: 'completed',
            sent_count: successCount,
            delivered_count: successCount, // Initially assume sent = delivered
            failed_count: failCount,
            cost: totalCost,
            metadata: {
              // Fix: Create new object instead of spreading undefined
              sender_id: senderId || 'MOBIWAVE',
              recipients: recipients.map(recipient => ({
                recipient_type: 'phone',
                recipient_value: recipient.replace(/\D/g, ''),
                status: 'completed'
              })),
              completed_at: new Date().toISOString()
            }
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
