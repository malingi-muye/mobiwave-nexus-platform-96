
import { useState } from 'react';
import { toast } from 'sonner';
import { useMspaceCredentials } from './useMspaceCredentials';

interface BalanceResponse {
  balance: number;
  status: string;
}

export const useMspaceBalance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getApiCredentials } = useMspaceCredentials();

  const checkBalance = async (): Promise<BalanceResponse> => {
    setIsLoading(true);
    try {
      const credentials = await getApiCredentials();
      
      const response = await fetch(
        `https://api.mspace.co.ke/smsapi/v2/balance/apikey=${credentials.api_key}/username=${credentials.username}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to check balance');
      }

      const data = await response.json();
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
