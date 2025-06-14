
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompleteUser } from '@/hooks/useCompleteUserManagement';

interface UserCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: CompleteUser;
  creditsForm: {
    amount: string;
    type: 'add' | 'subtract';
    description: string;
  };
  onFormChange: (form: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function UserCreditsDialog({ 
  open, 
  onOpenChange, 
  user, 
  creditsForm, 
  onFormChange, 
  onSubmit, 
  isLoading 
}: UserCreditsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Credits</DialogTitle>
          <DialogDescription>
            Add or subtract credits for {user.first_name} {user.last_name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="credit_type">Action</Label>
            <Select value={creditsForm.type} onValueChange={(value: 'add' | 'subtract') => onFormChange({...creditsForm, type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add Credits</SelectItem>
                <SelectItem value="subtract">Subtract Credits</SelectItem>
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
              value={creditsForm.amount}
              onChange={(e) => onFormChange({...creditsForm, amount: e.target.value})}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={creditsForm.description}
              onChange={(e) => onFormChange({...creditsForm, description: e.target.value})}
              placeholder="Reason for credit adjustment"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? 'Processing...' : `${creditsForm.type === 'add' ? 'Add' : 'Subtract'} Credits`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
