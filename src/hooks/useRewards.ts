
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RewardCampaign {
  id: string;
  user_id: string;
  name: string;
  reward_type: 'airtime' | 'data_bundle';
  amount: number;
  criteria: any;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  total_recipients: number;
  successful_distributions: number;
  created_at: string;
  updated_at: string;
}

export interface RewardDistribution {
  id: string;
  campaign_id: string;
  recipient_phone: string;
  reward_type: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider_reference?: string;
  error_message?: string;
  distributed_at?: string;
  created_at: string;
}

export const useRewards = () => {
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['reward-campaigns'],
    queryFn: async (): Promise<RewardCampaign[]> => {
      const { data, error } = await supabase
        .from('reward_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        reward_type: item.reward_type as 'airtime' | 'data_bundle',
        status: item.status as 'draft' | 'active' | 'paused' | 'completed'
      }));
    }
  });

  const createCampaign = useMutation({
    mutationFn: async (campaignData: Omit<RewardCampaign, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('reward_campaigns')
        .insert({ ...campaignData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reward-campaigns'] });
      toast.success('Reward campaign created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create campaign: ${error.message}`);
    }
  });

  const updateCampaign = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RewardCampaign> & { id: string }) => {
      const { data, error } = await supabase
        .from('reward_campaigns')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reward-campaigns'] });
      toast.success('Campaign updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update campaign: ${error.message}`);
    }
  });

  const distributeReward = useMutation({
    mutationFn: async ({ campaignId, recipients }: { campaignId: string; recipients: string[] }) => {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) throw new Error('Campaign not found');

      const distributions = recipients.map(phone => ({
        campaign_id: campaignId,
        recipient_phone: phone,
        reward_type: campaign.reward_type,
        amount: campaign.amount,
        status: 'pending' as const
      }));

      const { data, error } = await supabase
        .from('reward_distributions')
        .insert(distributions)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reward-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['reward-distributions'] });
      toast.success('Rewards distributed successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to distribute rewards: ${error.message}`);
    }
  });

  return {
    campaigns,
    isLoading,
    createCampaign: createCampaign.mutateAsync,
    updateCampaign: updateCampaign.mutateAsync,
    distributeReward: distributeReward.mutateAsync,
    isCreating: createCampaign.isPending,
    isUpdating: updateCampaign.isPending,
    isDistributing: distributeReward.isPending
  };
};

export const useRewardDistributions = (campaignId?: string) => {
  const { data: distributions = [], isLoading } = useQuery({
    queryKey: ['reward-distributions', campaignId],
    queryFn: async (): Promise<RewardDistribution[]> => {
      if (!campaignId) return [];
      
      const { data, error } = await supabase
        .from('reward_distributions')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'processing' | 'completed' | 'failed'
      }));
    },
    enabled: !!campaignId
  });

  return { distributions, isLoading };
};
