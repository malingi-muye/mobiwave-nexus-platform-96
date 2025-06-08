
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { useOptimizedQuery } from '@/hooks/useOptimizedQueries';
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
  role?: 'admin' | 'reseller' | 'client' | 'user';
}

const fetchUsers = async (searchTerm: string, roleFilter: string): Promise<User[]> => {
  let query = supabase
    .from('profiles')
    .select('*');

  if (searchTerm) {
    query = query.or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
  }

  // Only filter by role if the column exists and filter is not 'all'
  if (roleFilter !== 'all') {
    const validRoles: ('admin' | 'reseller' | 'client' | 'user')[] = ['admin', 'reseller', 'client', 'user'];
    if (validRoles.includes(roleFilter as 'admin' | 'reseller' | 'client' | 'user')) {
      // Try to filter by role, but don't fail if column doesn't exist
      try {
        query = query.eq('role', roleFilter as 'admin' | 'reseller' | 'client' | 'user');
      } catch (error) {
        console.warn('Role column may not exist yet:', error);
      }
    }
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(user => ({
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    created_at: user.created_at,
    role: (user as any).role || 'user' // Safely access role with fallback
  }));
};

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: users, isLoading, error, refetch } = useOptimizedQuery({
    queryKey: ['admin-users', searchTerm, roleFilter],
    queryFn: () => fetchUsers(searchTerm, roleFilter),
    staleTime: 60000 // 1 minute
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: 'admin' | 'reseller' | 'client' | 'user' }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole } as any) // Type assertion to handle schema mismatch
        .eq('id', userId);

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

  const handleUserUpdated = () => {
    refetch();
  };

  const filteredUsers = users || [];

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

      <LoadingWrapper 
        isLoading={isLoading} 
        error={error}
        fallback={
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        }
      >
        <UserStats users={users || []} />
        
        <UserTable 
          users={filteredUsers}
          isLoading={isLoading}
          onRoleUpdate={(userId, newRole) => updateUserRole.mutate({ userId, newRole })}
          onUserUpdated={handleUserUpdated}
        />
      </LoadingWrapper>
    </div>
  );
}
