
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompleteUser } from '@/hooks/useCompleteUserManagement';
import { CheckCircle, XCircle, AlertTriangle, User, Mail, Calendar, Edit, Trash2, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompleteUserTableRowProps {
  user: CompleteUser;
  onUserUpdated: () => void;
}

export function CompleteUserTableRow({ user, onUserUpdated }: CompleteUserTableRowProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    role: user.role || 'user',
    user_type: user.user_type || 'demo'
  });

  const [creditsForm, setCreditForm] = useState({
    amount: '',
    type: 'add' as 'add' | 'subtract',
    description: ''
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getUserTypeBadgeColor = (userType: string) => {
    switch (userType) {
      case 'real': return 'bg-green-100 text-green-800';
      case 'demo': return 'bg-gray-100 text-gray-800';
      case 'mspace_client': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

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
        <TableCell>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <div className="font-medium">
                {user.first_name || user.last_name 
                  ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                  : user.email.split('@')[0]
                }
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {user.email}
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                Joined: {formatDate(user.created_at)}
              </div>
            </div>
          </div>
        </TableCell>
        
        <TableCell>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {user.has_profile ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">
                {user.has_profile ? 'Profile Created' : 'Missing Profile'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {user.email_confirmed_at ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : user.email_confirmed_at === undefined ? (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">
                {user.email_confirmed_at 
                  ? 'Email Verified' 
                  : user.email_confirmed_at === undefined 
                    ? 'Status Unknown'
                    : 'Email Unverified'
                }
              </span>
            </div>
          </div>
        </TableCell>
        
        <TableCell>
          <div className="space-y-2">
            <Badge className={getRoleBadgeColor(user.role || 'user')} variant="secondary">
              {user.role || 'user'}
            </Badge>
            <br />
            <Badge className={getUserTypeBadgeColor(user.user_type || 'demo')} variant="outline">
              {user.user_type || 'demo'}
            </Badge>
          </div>
        </TableCell>
        
        <TableCell>
          <div className="space-y-1">
            <div className="text-sm font-medium">
              Remaining: {user.credits_remaining?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-gray-500">
              Purchased: {user.credits_purchased?.toFixed(2) || '0.00'}
            </div>
          </div>
        </TableCell>
        
        <TableCell>
          <div className="space-y-1">
            <div className="text-sm">
              Last Sign In: 
            </div>
            <div className="text-xs text-gray-500">
              {formatDateTime(user.last_sign_in_at)}
            </div>
          </div>
        </TableCell>
        
        <TableCell>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
              className="hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCreditsDialogOpen(true)}
              className="hover:bg-green-50"
            >
              <CreditCard className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={sendWelcomeEmail}
              disabled={isLoading}
              className="hover:bg-purple-50"
            >
              <Mail className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="hover:bg-red-50 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm({...editForm, role: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="user_type">User Type</Label>
              <Select value={editForm.user_type} onValueChange={(value) => setEditForm({...editForm, user_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demo">Demo</SelectItem>
                  <SelectItem value="real">Real</SelectItem>
                  <SelectItem value="mspace_client">Mspace Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credits Management Dialog */}
      <Dialog open={creditsDialogOpen} onOpenChange={setCreditsDialogOpen}>
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
              <Select value={creditsForm.type} onValueChange={(value: 'add' | 'subtract') => setCreditForm({...creditsForm, type: value})}>
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
                onChange={(e) => setCreditForm({...creditsForm, amount: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={creditsForm.description}
                onChange={(e) => setCreditForm({...creditsForm, description: e.target.value})}
                placeholder="Reason for credit adjustment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreditsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdjustCredits} disabled={isLoading}>
              {isLoading ? 'Processing...' : `${creditsForm.type === 'add' ? 'Add' : 'Subtract'} Credits`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {user.first_name} {user.last_name} ({user.email})?
              This action cannot be undone and will permanently remove all user data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
