
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserTableCell } from './UserTableCell';
import { UserActions } from './UserActions';
import { UserEditDialog } from './UserEditDialog';
import { UserCreditsDialog } from './UserCreditsDialog';
import { UserDeleteDialog } from './UserDeleteDialog';
import { CompleteUser } from '@/hooks/useCompleteUserManagement';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CompleteUserTableRowProps {
  user: CompleteUser;
  onUserUpdated: () => void;
}

type UserRole = 'user' | 'manager' | 'admin' | 'super_admin';

export function CompleteUserTableRow({ user, onUserUpdated }: CompleteUserTableRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [editForm, setEditForm] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    role: (user.role || 'user') as UserRole,
    user_type: user.user_type || 'demo'
  });

  const handleEdit = () => {
    setEditForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role: (user.role || 'user') as UserRole,
      user_type: user.user_type || 'demo'
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          role: editForm.role,
          user_type: editForm.user_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('User updated successfully');
      onUserUpdated();
      setShowEditDialog(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredits = () => {
    setShowCreditsDialog(true);
  };

  const handleEmail = () => {
    // TODO: Implement email functionality
    toast.info('Email functionality coming soon');
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      // Delete user profile (this will cascade delete related records)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      toast.success('User deleted successfully');
      onUserUpdated();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = () => {
    if (!user.has_profile) {
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
    if (user.email_confirmed_at) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <UserTableCell user={user} />
        </TableCell>
        
        <TableCell>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <div className="text-sm">
              {!user.has_profile && <div className="text-amber-600">Missing Profile</div>}
              {user.has_profile && user.email_confirmed_at && <div className="text-green-600">Verified</div>}
              {user.has_profile && !user.email_confirmed_at && <div className="text-red-600">Unverified</div>}
            </div>
          </div>
        </TableCell>
        
        <TableCell>
          <div className="space-y-1">
            <Badge className={getRoleBadgeColor(user.role || 'user')} variant="secondary">
              {user.role || 'user'}
            </Badge>
            <div className="text-xs text-gray-500">
              {user.user_type || 'demo'}
            </div>
          </div>
        </TableCell>
        
        <TableCell>
          <div className="text-sm">
            <div className="font-medium text-green-600">
              {user.credits_remaining?.toFixed(2) || '0.00'} credits
            </div>
            <div className="text-gray-500">
              Purchased: {user.credits_purchased?.toFixed(2) || '0.00'}
            </div>
          </div>
        </TableCell>
        
        <TableCell>
          <div className="text-sm text-gray-500">
            {user.last_sign_in_at 
              ? new Date(user.last_sign_in_at).toLocaleDateString()
              : 'Never'
            }
          </div>
        </TableCell>
        
        <TableCell>
          <UserActions
            onEdit={handleEdit}
            onCredits={handleCredits}
            onEmail={handleEmail}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </TableCell>
      </TableRow>

      <UserEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        user={user}
        editForm={editForm}
        onFormChange={setEditForm}
        onSubmit={handleSaveEdit}
        isLoading={isLoading}
      />

      <UserCreditsDialog
        open={showCreditsDialog}
        onOpenChange={setShowCreditsDialog}
        user={user}
        onUserUpdated={onUserUpdated}
      />

      <UserDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        user={user}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </>
  );
}
