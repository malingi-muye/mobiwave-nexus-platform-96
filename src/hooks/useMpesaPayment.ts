
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MpesaPaymentRequest {
  amount: number;
  phoneNumber: string;
  accountReference?: string;
  transactionDesc?: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  message?: string;
  error?: string;
}

export const useMpesaPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');

  const initiatePayment = async (paymentData: MpesaPaymentRequest): Promise<PaymentResponse> => {
    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: paymentData
      });

      if (error) {
        setPaymentStatus('failed');
        toast.error(`Payment failed: ${error.message}`);
        return { success: false, error: error.message };
      }

      if (data.success) {
        setPaymentStatus('processing');
        toast.success(data.message || 'STK Push sent to your phone');
        
        // Start polling for payment status if we have a transaction ID
        if (data.transactionId) {
          pollPaymentStatus(data.transactionId);
        }
        
        return data;
      } else {
        setPaymentStatus('failed');
        toast.error(data.error || 'Payment failed');
        return { success: false, error: data.error };
      }
    } catch (error: any) {
      setPaymentStatus('failed');
      toast.error('Payment failed. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const pollPaymentStatus = async (transactionId: string) => {
    const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        // Use credit_transactions table to check payment status
        const { data, error } = await supabase
          .from('credit_transactions')
          .select('transaction_type, description, metadata')
          .eq('reference_id', transactionId)
          .single();

        if (error) {
          console.error('Error polling payment status:', error);
          return;
        }

        if (data && data.transaction_type === 'purchase') {
          setPaymentStatus('completed');
          toast.success('Payment successful!');
          return;
        }

        // Continue polling if still processing
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setPaymentStatus('failed');
          toast.error('Payment timeout. Please check your transaction status.');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Start polling after 5 seconds
    setTimeout(poll, 5000);
  };

  const getPaymentHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('transaction_type', 'purchase')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payment history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  };

  return {
    initiatePayment,
    getPaymentHistory,
    isLoading,
    paymentStatus,
    setPaymentStatus: (status: 'idle' | 'processing' | 'completed' | 'failed') => setPaymentStatus(status)
  };
};
