
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
}

export const useCampaigns = () => {
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
    getCampaignStats
  };
};
