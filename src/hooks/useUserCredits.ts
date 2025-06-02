
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserCredits {
  id: string;
  user_id: string;
  credits_remaining: number;
  credits_used: number;
  total_purchased: number;
  last_updated: string;
}

export const useUserCredits = () => {
  const queryClient = useQueryClient();

  const getUserCredits = useQuery({
    queryKey: ['user-credits'],
    queryFn: async (): Promise<UserCredits | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If no credits record exists, create one with default values
      if (!data) {
        const { data: newCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: user.id,
            credits_remaining: 10.00, // $10 starter credits
            credits_used: 0,
            total_purchased: 10.00
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newCredits;
      }

      return data;
    },
    staleTime: 30000, // 30 seconds
  });

  const purchaseCredits = useMutation({
    mutationFn: async (amount: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_credits')
        .update({
          credits_remaining: supabase.raw(`credits_remaining + ${amount}`),
          total_purchased: supabase.raw(`total_purchased + ${amount}`)
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      toast.success(`$${data.credits_remaining.toFixed(2)} credits added successfully`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to purchase credits');
    }
  });

  return {
    data: getUserCredits.data,
    isLoading: getUserCredits.isLoading,
    error: getUserCredits.error,
    purchaseCredits,
    refetch: getUserCredits.refetch
  };
};
