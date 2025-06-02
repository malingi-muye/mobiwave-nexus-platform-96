
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, Shield, Zap } from 'lucide-react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { toast } from 'sonner';

const CREDIT_PACKAGES = [
  { amount: 10, bonus: 0, popular: false },
  { amount: 25, bonus: 2, popular: false },
  { amount: 50, bonus: 5, popular: true },
  { amount: 100, bonus: 15, popular: false },
  { amount: 250, bonus: 50, popular: false },
  { amount: 500, bonus: 125, popular: false }
];

export function CreditPurchase() {
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[2]);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { data: credits, purchaseCredits } = useUserCredits();

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      const amount = customAmount ? parseFloat(customAmount) : selectedPackage.amount + selectedPackage.bonus;
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add credits to account
      await purchaseCredits.mutateAsync(amount);
      
      toast.success(`Successfully purchased $${amount.toFixed(2)} in credits!`);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getTotalAmount = () => {
    if (customAmount) return parseFloat(customAmount) || 0;
    return selectedPackage.amount + selectedPackage.bonus;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Credits</h2>
        <p className="text-gray-600">Add credits to your account to send SMS messages</p>
        {credits && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold text-blue-900">
                Current Balance: ${credits.credits_remaining.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CREDIT_PACKAGES.map((pkg) => (
          <Card 
            key={pkg.amount}
            className={`cursor-pointer transition-all border-2 ${
              selectedPackage.amount === pkg.amount && !customAmount
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            } ${pkg.popular ? 'ring-2 ring-blue-200' : ''}`}
            onClick={() => {
              setSelectedPackage(pkg);
              setCustomAmount('');
            }}
          >
            <CardHeader className="text-center pb-2">
              {pkg.popular && (
                <Badge className="self-center mb-2 bg-blue-600">
                  Most Popular
                </Badge>
              )}
              <CardTitle className="text-2xl">${pkg.amount}</CardTitle>
              {pkg.bonus > 0 && (
                <CardDescription className="text-green-600 font-medium">
                  +${pkg.bonus} bonus credits
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-sm text-gray-600">
                Total: ${pkg.amount + pkg.bonus}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ~{Math.floor((pkg.amount + pkg.bonus) / 0.05)} SMS messages
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-dashed border-gray-300">
        <CardHeader>
          <CardTitle className="text-lg">Custom Amount</CardTitle>
          <CardDescription>Enter your own credit amount</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Label htmlFor="customAmount" className="text-lg">$</Label>
            <Input
              id="customAmount"
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                if (e.target.value) {
                  setSelectedPackage({ amount: 0, bonus: 0, popular: false });
                }
              }}
              min="5"
              max="1000"
              step="1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mpesa">M-Pesa Mobile Money</SelectItem>
              <SelectItem value="card">Credit/Debit Card</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">${getTotalAmount().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Processing Fee:</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">${getTotalAmount().toFixed(2)}</span>
            </div>
          </div>

          <Button 
            onClick={handlePurchase}
            disabled={isProcessing || getTotalAmount() < 5}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Purchase Credits - ${getTotalAmount().toFixed(2)}
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            Secure payment processing. Your payment information is encrypted and protected.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
