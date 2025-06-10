
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MpesaPaymentRequest {
  phone: string;
  amount: number;
  description?: string;
  accountReference?: string;
  transactionDesc?: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

export const useMpesaPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const queryClient = useQueryClient();

  const initiatePayment = useMutation({
    mutationFn: async ({ phone, amount, description }: MpesaPaymentRequest): Promise<PaymentResponse> => {
      setIsProcessing(true);
      setPaymentStatus('processing');
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Call the mpesa-payment edge function
        const { data, error } = await supabase.functions.invoke('mpesa-payment', {
          body: { phone, amount, description }
        });

        if (error) throw error;

        // Create credit transaction record
        const { error: transactionError } = await supabase
          .from('credit_transactions')
          .insert({
            user_id: user.id,
            amount: amount,
            transaction_type: 'purchase',
            description: description || `M-Pesa payment for ${amount} credits`,
            reference_id: data.transactionId
          });

        if (transactionError) {
          console.warn('Failed to create transaction record:', transactionError);
        }

        setPaymentStatus('completed');
        return {
          success: true,
          message: 'Payment initiated successfully',
          transactionId: data.transactionId
        };
      } catch (error: any) {
        setPaymentStatus('failed');
        throw new Error(error.message || 'Payment failed');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      queryClient.invalidateQueries({ queryKey: ['credit-transactions'] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });

  const getTransactionHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(transaction => ({
        ...transaction,
        type: transaction.transaction_type || 'unknown'
      }));
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  };

  return {
    initiatePayment: initiatePayment.mutateAsync,
    isProcessing,
    isLoading: initiatePayment.isPending,
    paymentStatus,
    getTransactionHistory
  };
};
