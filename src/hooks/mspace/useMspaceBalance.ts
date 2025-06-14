
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BalanceResponse {
  balance: number;
  status: string;
}

export const useMspaceBalance = () => {
  const [isLoading, setIsLoading] = useState(false);

  const checkBalance = async (): Promise<BalanceResponse> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mspace-balance');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    } catch (error: any) {
      console.error('Error checking balance:', error);
      toast.error(`Failed to check balance: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { checkBalance, isLoading };
};
