
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Campaign {
  id: string;
  name: string;
  status: string;
  type: string;
  recipient_count: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  cost?: number;
  created_at: string;
  updated_at: string;
  content: string;
  subject?: string;
  metadata?: any;
}

export const useCampaigns = () => {
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async (): Promise<Campaign[]> => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createCampaign = useMutation({
    mutationFn: async (campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>) => {
      // Fix: Pass single object instead of array
      const { data, error } = await supabase
        .from('campaigns')
        .insert(campaignData)
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
    if (!campaigns) return { 
      total: 0, 
      active: 0, 
      completed: 0, 
      failed: 0,
      activeCampaigns: 0,
      totalCampaigns: 0,
      totalDelivered: 0,
      deliveryRate: 0
    };
    
    const totalDelivered = campaigns.reduce((sum, c) => sum + (c.delivered_count || 0), 0);
    const totalSent = campaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0);
    
    return {
      total: campaigns.length,
      active: campaigns.filter(c => c.status === 'sending' || c.status === 'scheduled').length,
      completed: campaigns.filter(c => c.status === 'completed').length,
      failed: campaigns.filter(c => c.status === 'failed').length,
      activeCampaigns: campaigns.filter(c => c.status === 'sending' || c.status === 'scheduled').length,
      totalCampaigns: campaigns.length,
      totalDelivered,
      deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0
    };
  };

  return {
    campaigns,
    isLoading,
    error,
    createCampaign,
    getCampaignStats
  };
};
