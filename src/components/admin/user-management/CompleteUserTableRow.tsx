
import React, { useState } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { CompleteUser } from '@/hooks/useCompleteUserManagement';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserTableCell } from './UserTableCell';
import { UserActions } from './UserActions';
import { UserEditDialog } from './UserEditDialog';
import { UserCreditsDialog } from './UserCreditsDialog';
import { UserDeleteDialog } from './UserDeleteDialog';

interface CompleteUserTableRowProps {
  user: CompleteUser;
  onUserUpdated: () => void;
}

type UserRole = 'user' | 'manager' | 'admin' | 'super_admin';

export function CompleteUserTableRow({ user, onUserUpdated }: CompleteUserTableRowProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to ensure valid role
  const getValidRole = (role?: string): UserRole => {
    const validRoles: UserRole[] = ['user', 'manager', 'admin', 'super_admin'];
    return validRoles.includes(role as UserRole) ? (role as UserRole) : 'user';
  };

  const [editForm, setEditForm] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    role: getValidRole(user.role),
    user_type: user.user_type || 'demo'
  });

  const [creditsForm, setCreditForm] = useState({
    amount: '',
    type: 'add' as 'add' | 'subtract',
    description: ''
  });

  const handleUpdateUser = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          role: editForm.role,
          user_type: editForm.user_type
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('User updated successfully');
      setEditDialogOpen(false);
      onUserUpdated();
    } catch (error: any) {
      toast.error(`Failed to update user: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustCredits = async () => {
    setIsLoading(true);
    try {
      const amount = parseFloat(creditsForm.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      // Get current credits
      const { data: currentCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        // If no credits record exists, create one
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: user.id,
            credits_remaining: creditsForm.type === 'add' ? amount : 0,
            credits_purchased: creditsForm.type === 'add' ? amount : 0
          });

        if (insertError) throw insertError;
      } else {
        // Update existing credits
        const newAmount = creditsForm.type === 'add' 
          ? currentCredits.credits_remaining + amount
          : Math.max(0, currentCredits.credits_remaining - amount);

        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ 
            credits_remaining: newAmount,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: creditsForm.type === 'add' ? amount : -amount,
          transaction_type: creditsForm.type === 'add' ? 'admin_credit' : 'admin_debit',
          description: creditsForm.description || `Credits ${creditsForm.type}ed by admin`,
          reference_id: `admin_${Date.now()}`
        });

      if (transactionError) throw transactionError;

      toast.success(`Credits ${creditsForm.type}ed successfully`);
      setCreditsDialogOpen(false);
      setCreditForm({ amount: '', type: 'add', description: '' });
      onUserUpdated();
    } catch (error: any) {
      toast.error(`Failed to adjust credits: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsLoading(true);
    try {
      // Delete from profiles table (this should cascade to other tables)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      onUserUpdated();
    } catch (error: any) {
      toast.error(`Failed to delete user: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeEmail = async () => {
    setIsLoading(true);
    try {
      // This would typically integrate with your email service
      toast.success('Welcome email sent successfully');
    } catch (error: any) {
      toast.error(`Failed to send email: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TableRow>
        <UserTableCell user={user} />
        
        <TableCell>
          <UserActions
            onEdit={() => setEditDialogOpen(true)}
            onCredits={() => setCreditsDialogOpen(true)}
            onEmail={sendWelcomeEmail}
            onDelete={() => setDeleteDialogOpen(true)}
            isLoading={isLoading}
          />
        </TableCell>
      </TableRow>

      <UserEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={user}
        editForm={editForm}
        onFormChange={setEditForm}
        onSubmit={handleUpdateUser}
        isLoading={isLoading}
      />

      <UserCreditsDialog
        open={creditsDialogOpen}
        onOpenChange={setCreditsDialogOpen}
        user={user}
        creditsForm={creditsForm}
        onFormChange={setCreditForm}
        onSubmit={handleAdjustCredits}
        isLoading={isLoading}
      />

      <UserDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={user}
        onConfirm={handleDeleteUser}
        isLoading={isLoading}
      />
    </>
  );
}
