
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { CompleteUser } from '@/hooks/useCompleteUserManagement';
import { UserActions } from './UserActions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompleteUserTableRowProps {
  user: CompleteUser;
  onUserUpdated: () => void;
}

export function CompleteUserTableRow({ user, onUserUpdated }: CompleteUserTableRowProps) {
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const handleCreateProfile = async () => {
    setIsCreatingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          role: 'user',
          user_type: 'demo'
        });

      if (error) throw error;

      // Also initialize credits
      await supabase
        .from('user_credits')
        .insert({
          user_id: user.id,
          credits_remaining: 10.00,
          credits_purchased: 10.00
        });

      toast.success('Profile created successfully');
      onUserUpdated();
    } catch (error: any) {
      toast.error(`Failed to create profile: ${error.message}`);
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (userType: string) => {
    switch (userType) {
      case 'real': return 'bg-green-100 text-green-800';
      case 'demo': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TableRow className={!user.has_profile ? 'bg-amber-50' : ''}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            user.has_profile ? 'bg-blue-100' : 'bg-amber-100'
          }`}>
            <User className={`w-4 h-4 ${user.has_profile ? 'text-blue-600' : 'text-amber-600'}`} />
          </div>
          <div>
            <div className="font-medium flex items-center gap-2">
              {user.first_name || user.last_name 
                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                : user.email.split('@')[0]
              }
              {!user.has_profile && (
                <AlertTriangle className="w-4 h-4 text-amber-500" title="Missing profile" />
              )}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <div className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</div>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            {user.email_confirmed_at ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs">
              {user.email_confirmed_at ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <Badge variant={user.has_profile ? 'default' : 'destructive'} className="text-xs">
            {user.has_profile ? 'Complete' : 'Incomplete'}
          </Badge>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col gap-1">
          <Badge className={getRoleColor(user.role || 'user')} variant="secondary">
            {user.role || 'user'}
          </Badge>
          <Badge className={getTypeColor(user.user_type || 'demo')} variant="secondary">
            {user.user_type || 'demo'}
          </Badge>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="text-sm">
          <div className="font-medium text-green-600">
            ${user.credits_remaining?.toFixed(2) || '0.00'}
          </div>
          <div className="text-xs text-gray-500">
            Purchased: ${user.credits_purchased?.toFixed(2) || '0.00'}
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="text-sm text-gray-500">
          <div>Created: {formatDate(user.created_at)}</div>
          <div>Last Login: {formatDate(user.last_sign_in_at)}</div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex gap-1">
          {!user.has_profile ? (
            <Button
              size="sm"
              onClick={handleCreateProfile}
              disabled={isCreatingProfile}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isCreatingProfile ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                'Create Profile'
              )}
            </Button>
          ) : (
            <UserActions user={user} onUserUpdated={onUserUpdated} />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
