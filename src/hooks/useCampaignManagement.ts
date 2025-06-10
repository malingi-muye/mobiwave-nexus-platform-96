
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  type: string;
  content: string;
  status: string;
  recipient_count?: number;
  sent_count?: number;
  delivered_count?: number;
  failed_count?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface CampaignRecipient {
  id: string;
  campaign_id: string;
  recipient_type: string;
  recipient_value: string;
  status: string;
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
}

export const useCampaignManagement = () => {
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async (): Promise<Campaign[]> => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const createCampaign = useMutation({
    mutationFn: async (campaignData: {
      name: string;
      type: string;
      content: string;
      recipients: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create the campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          name: campaignData.name,
          type: campaignData.type,
          content: campaignData.content,
          status: 'draft',
          user_id: user.id,
          recipient_count: campaignData.recipients.length
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Note: Since campaign_recipients table doesn't exist, we'll store recipients in metadata
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({
          metadata: {
            recipients: campaignData.recipients.map(recipient => ({
              recipient_type: campaignData.type === 'sms' ? 'phone' : 'email',
              recipient_value: recipient,
              status: 'pending'
            }))
          }
        })
        .eq('id', campaign.id);

      if (updateError) throw updateError;

      return campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create campaign: ${error.message}`);
    }
  });

  const updateCampaignStatus = useMutation({
    mutationFn: async ({ campaignId, status }: { campaignId: string; status: string }) => {
      const updateData: any = { status, updated_at: new Date().toISOString() };
      
      if (status === 'active') {
        updateData.sent_at = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('campaigns')
        .update(updateData)
        .eq('id', campaignId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign status updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update campaign: ${error.message}`);
    }
  });

  const deleteCampaign = useMutation({
    mutationFn: async (campaignId: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete campaign: ${error.message}`);
    }
  });

  const getCampaignRecipients = (campaignId: string) => {
    return useQuery({
      queryKey: ['campaign-recipients', campaignId],
      queryFn: async (): Promise<CampaignRecipient[]> => {
        // Since campaign_recipients table doesn't exist, get recipients from metadata
        const { data: campaign, error } = await supabase
          .from('campaigns')
          .select('metadata')
          .eq('id', campaignId)
          .single();

        if (error) throw error;

        const metadata = campaign?.metadata as any;
        const recipients = metadata?.recipients || [];
        
        return recipients.map((recipient: any, index: number) => ({
          id: `${campaignId}-${index}`,
          campaign_id: campaignId,
          recipient_type: recipient.recipient_type || 'email',
          recipient_value: recipient.recipient_value || '',
          status: recipient.status || 'pending'
        }));
      },
      enabled: !!campaignId
    });
  };

  return {
    campaigns,
    campaignsLoading,
    createCampaign,
    updateCampaignStatus,
    deleteCampaign,
    getCampaignRecipients
  };
};
