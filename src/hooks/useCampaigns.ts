
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  type: 'sms' | 'email' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused' | 'failed';
  content: string;
  recipient_count: number;
  delivered_count: number;
  failed_count: number;
  sent_count: number; // Added this property
  total_cost: number;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useCampaigns = () => {
  const queryClient = useQueryClient();

  const getCampaigns = useQuery({
    queryKey: ['campaigns'],
    queryFn: async (): Promise<Campaign[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map database fields to our interface
      return (data || []).map(campaign => ({
        ...campaign,
        sent_count: campaign.sent_count || 0,
        total_cost: 0 // Default value, will be calculated based on sent messages
      }));
    }
  });

  const createCampaign = useMutation({
    mutationFn: async (campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'sent_count'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          ...campaign,
          user_id: user.id,
          sent_count: 0,
          total_cost: 0
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
      toast.error(error.message || 'Failed to create campaign');
    }
  });

  const updateCampaign = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Campaign> }) => {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update campaign');
    }
  });

  return {
    data: getCampaigns.data,
    isLoading: getCampaigns.isLoading,
    error: getCampaigns.error,
    createCampaign,
    updateCampaign,
    refetch: getCampaigns.refetch
  };
};

// Export the hook that CampaignManager expects
export const useCreateCampaign = () => {
  const { createCampaign } = useCampaigns();
  return createCampaign;
};
