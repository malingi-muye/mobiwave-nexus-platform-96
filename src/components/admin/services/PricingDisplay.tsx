
import React from 'react';

interface PricingDisplayProps {
  setupFee: number;
  monthlyFee: number;
  transactionFeeType: string;
  transactionFeeAmount: number;
}

export function PricingDisplay({ 
  setupFee, 
  monthlyFee, 
  transactionFeeType, 
  transactionFeeAmount 
}: PricingDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-1 text-xs">
      {setupFee > 0 && (
        <div className="flex justify-between">
          <span>Setup Fee:</span>
          <span className="font-medium">{formatCurrency(setupFee)}</span>
        </div>
      )}
      {monthlyFee > 0 && (
        <div className="flex justify-between">
          <span>Monthly Fee:</span>
          <span className="font-medium">{formatCurrency(monthlyFee)}</span>
        </div>
      )}
      {transactionFeeAmount > 0 && (
        <div className="flex justify-between">
          <span>Transaction Fee:</span>
          <span className="font-medium">
            {transactionFeeType === 'percentage' 
              ? `${transactionFeeAmount}%`
              : formatCurrency(transactionFeeAmount)
            }
          </span>
        </div>
      )}
    </div>
  );
}
