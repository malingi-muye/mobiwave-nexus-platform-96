
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserStats } from './user-management/UserStats';
import { UserFilters } from './user-management/UserFilters';
import { UserTable } from './user-management/UserTable';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  last_sign_in_at?: string;
  role?: string;
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, roleFilter],
    queryFn: async (): Promise<User[]> => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          created_at,
          user_roles(
            roles(name)
          )
        `);

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
        role: user.user_roles?.[0]?.roles?.name || 'end_user'
      }));
    }
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: 'admin' | 'agent' | 'end_user' }) => {
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', newRole)
        .single();

      if (roleError) throw roleError;

      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleData.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update user role: ${error.message}`);
    }
  });

  const filteredUsers = users?.filter(user => {
    if (roleFilter === 'all') return true;
    return user.role === roleFilter;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
          User Management
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Manage user accounts, roles, and permissions across the platform.
        </p>
      </div>

      <UserFilters 
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        onSearchChange={setSearchTerm}
        onRoleFilterChange={setRoleFilter}
      />

      <UserStats users={users || []} />

      <UserTable 
        users={filteredUsers}
        isLoading={isLoading}
        onRoleUpdate={(userId, newRole) => updateUserRole.mutate({ userId, newRole })}
      />
    </div>
  );
}
