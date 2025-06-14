
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompleteUser } from '@/hooks/useCompleteUserManagement';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreditCard, Plus, Minus } from 'lucide-react';

interface UserCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: CompleteUser;
  onCreditsUpdated: () => void;
}

export function UserCreditsDialog({ 
  open, 
  onOpenChange, 
  user, 
  onCreditsUpdated
}: UserCreditsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [operation, setOperation] = useState<'add' | 'subtract' | 'set'>('add');
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const handleSubmit = async () => {
    if (!user || !amount || isNaN(parseFloat(amount))) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    const numAmount = parseFloat(amount);
    let newCredits = user.credits_remaining || 0;
    
    switch (operation) {
      case 'add':
        newCredits += numAmount;
        break;
      case 'subtract':
        newCredits = Math.max(0, newCredits - numAmount);
        break;
      case 'set':
        newCredits = numAmount;
        break;
    }
    
    setIsLoading(true);
    try {
      // Update user credits
      const { error: creditsError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: user.id,
          credits_remaining: newCredits,
          credits_purchased: operation === 'add' ? (user.credits_purchased || 0) + numAmount : user.credits_purchased || 0,
          updated_at: new Date().toISOString()
        });

      if (creditsError) throw creditsError;

      // Log the transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          transaction_type: operation,
          amount: numAmount,
          description: reason || `Credits ${operation} by admin`,
          reference_id: `admin-${Date.now()}`
        });

      if (transactionError) {
        console.warn('Failed to log transaction:', transactionError);
      }

      toast.success(`Credits ${operation === 'set' ? 'updated' : operation === 'add' ? 'added' : 'deducted'} successfully`);
      onCreditsUpdated();
      onOpenChange(false);
      setAmount('');
      setReason('');
    } catch (error) {
      console.error('Error updating credits:', error);
      toast.error('Failed to update credits');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Manage Credits
          </DialogTitle>
          <DialogDescription>
            Update user credits for {user.first_name} {user.last_name} ({user.email})
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gray-50 border rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-600 mb-1">Current Balance</div>
          <div className="text-2xl font-bold text-green-600">
            ${(user.credits_remaining || 0).toFixed(2)}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="operation">Operation</Label>
            <Select value={operation} onValueChange={(value: 'add' | 'subtract' | 'set') => setOperation(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Credits
                  </div>
                </SelectItem>
                <SelectItem value="subtract">
                  <div className="flex items-center gap-2">
                    <Minus className="w-4 h-4" />
                    Subtract Credits
                  </div>
                </SelectItem>
                <SelectItem value="set">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Set Balance
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Credit adjustment reason..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !amount}>
            {isLoading ? 'Processing...' : 'Update Credits'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
