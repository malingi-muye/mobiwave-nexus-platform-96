
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompleteUser } from '@/hooks/useCompleteUserManagement';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: CompleteUser;
  onUserUpdated: () => void;
}

export function UserCreditsDialog({ open, onOpenChange, user, onUserUpdated }: UserCreditsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [operation, setOperation] = useState<'add' | 'subtract' | 'set'>('add');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    const creditAmount = parseFloat(amount);
    if (!creditAmount || creditAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      // Get current credits
      const { data: currentCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('credits_remaining, credits_purchased')
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      let newCreditsRemaining = currentCredits.credits_remaining;
      let newCreditsPurchased = currentCredits.credits_purchased;

      switch (operation) {
        case 'add':
          newCreditsRemaining += creditAmount;
          newCreditsPurchased += creditAmount;
          break;
        case 'subtract':
          newCreditsRemaining = Math.max(0, newCreditsRemaining - creditAmount);
          break;
        case 'set':
          newCreditsRemaining = creditAmount;
          break;
      }

      // Update credits
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          credits_remaining: newCreditsRemaining,
          credits_purchased: operation === 'add' ? newCreditsPurchased : currentCredits.credits_purchased,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Log the transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          transaction_type: operation,
          amount: creditAmount,
          description: description || `Credits ${operation} by admin`,
          created_at: new Date().toISOString()
        });

      if (transactionError) throw transactionError;

      toast.success('Credits updated successfully');
      onUserUpdated();
      onOpenChange(false);
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error updating credits:', error);
      toast.error('Failed to update credits');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Credits</DialogTitle>
          <DialogDescription>
            Update credits for {user.first_name} {user.last_name} ({user.email})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-600">Current Credits</div>
            <div className="text-lg font-semibold">{user.credits_remaining?.toFixed(2) || '0.00'}</div>
          </div>
          
          <div>
            <Label htmlFor="operation">Operation</Label>
            <Select value={operation} onValueChange={(value: 'add' | 'subtract' | 'set') => setOperation(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add Credits</SelectItem>
                <SelectItem value="subtract">Subtract Credits</SelectItem>
                <SelectItem value="set">Set Credits</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="amount">Amount</Label>
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
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Reason for credit adjustment"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Credits'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
