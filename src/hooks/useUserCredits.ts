
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserCredits {
  id: string;
  user_id: string;
  credits_total: number;
  credits_used: number;
  credits_remaining: number;
  last_purchase_at?: string;
  created_at: string;
  updated_at: string;
}

export const useUserCredits = () => {
  return useQuery({
    queryKey: ['user-credits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as UserCredits | null;
    },
  });
};

export const useUpdateCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (creditsToAdd: number) => {
      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('credits_total')
        .single();

      const newTotal = (currentCredits?.credits_total || 0) + creditsToAdd;

      const { data, error } = await supabase
        .from('user_credits')
        .upsert({
          credits_total: newTotal,
          last_purchase_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
    },
  });
};
