
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  recipient_count: number;
  cost: number;
  created_at: string;
  user_id: string;
  content: string;
  subject?: string;
  scheduled_at?: string;
  total_cost?: number;
}

interface CreateCampaignData {
  name: string;
  type: string;
  content: string;
  subject?: string;
  recipients: string[];
  status: string;
  recipient_count: number;
  delivered_count: number;
  failed_count: number;
  total_cost: number;
  scheduled_at?: string | null;
}

export const useCampaigns = () => {
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading, error } = useQuery({
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
    mutationFn: async (campaignData: CreateCampaignData): Promise<Campaign> => {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          name: campaignData.name,
          type: campaignData.type,
          content: campaignData.content,
          subject: campaignData.subject,
          status: campaignData.status,
          recipient_count: campaignData.recipient_count,
          delivered_count: campaignData.delivered_count,
          failed_count: campaignData.failed_count,
          cost: campaignData.total_cost,
          scheduled_at: campaignData.scheduled_at,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create campaign: ${error.message}`);
    }
  });

  const getCampaignStats = () => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'sending').length;
    const completedCampaigns = campaigns.filter(c => c.status === 'sent').length;
    const totalSent = campaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0);
    const totalDelivered = campaigns.reduce((sum, c) => sum + (c.delivered_count || 0), 0);
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;

    return {
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      totalSent,
      totalDelivered,
      deliveryRate
    };
  };

  return {
    campaigns,
    isLoading,
    error,
    getCampaignStats,
    createCampaign
  };
};
