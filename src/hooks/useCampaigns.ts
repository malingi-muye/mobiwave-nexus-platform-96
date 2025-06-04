
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Campaign {
  id?: string;
  name: string;
  type: string;
  content: string;
  subject?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';
  recipient_count: number;
  sent_count?: number;
  delivered_count?: number;
  failed_count?: number;
  total_cost?: number;
  scheduled_at?: string | null;
}

export const useCampaigns = () => {
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const createCampaign = useMutation({
    mutationFn: async (campaignData: Campaign) => {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([campaignData])
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
      toast.error(`Failed to update campaign: ${error.message}`);
    }
  });

  const deleteCampaign = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

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

  return {
    campaigns,
    isLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign
  };
};
