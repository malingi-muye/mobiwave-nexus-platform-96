
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  raw_user_meta_data?: any;
}

interface ProfileUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  user_type?: string;
  created_at: string;
}

interface UserCredits {
  user_id: string;
  credits_remaining: number;
  credits_purchased: number;
}

export interface CompleteUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  user_type?: string;
  created_at: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  credits_remaining?: number;
  credits_purchased?: number;
  has_profile: boolean;
  raw_user_meta_data?: any;
}

export const useCompleteUserManagement = (searchTerm: string, roleFilter: string, userTypeFilter: string) => {
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['complete-user-management', searchTerm, roleFilter, userTypeFilter],
    queryFn: async (): Promise<CompleteUser[]> => {
      // Fetch all auth users using admin API
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      // Fetch all profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*');
      if (profileError) throw profileError;

      // Fetch all user credits
      const { data: credits, error: creditsError } = await supabase
        .from('user_credits')
        .select('*');
      if (creditsError) throw creditsError;

      // Create lookup maps
      const profileMap = new Map(profiles.map(p => [p.id, p]));
      const creditsMap = new Map(credits.map(c => [c.user_id, c]));

      // Combine all data
      const combinedUsers: CompleteUser[] = authUsers.users.map(authUser => {
        const profile = profileMap.get(authUser.id);
        const userCredits = creditsMap.get(authUser.id);

        return {
          id: authUser.id,
          email: authUser.email || '',
          first_name: profile?.first_name || authUser.user_metadata?.first_name,
          last_name: profile?.last_name || authUser.user_metadata?.last_name,
          role: profile?.role || 'user',
          user_type: profile?.user_type || 'demo',
          created_at: authUser.created_at,
          email_confirmed_at: authUser.email_confirmed_at,
          last_sign_in_at: authUser.last_sign_in_at,
          credits_remaining: userCredits?.credits_remaining || 0,
          credits_purchased: userCredits?.credits_purchased || 0,
          has_profile: !!profile,
          raw_user_meta_data: authUser.user_metadata
        };
      });

      // Apply filters
      let filteredUsers = combinedUsers;

      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }

      if (userTypeFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.user_type === userTypeFilter);
      }

      return filteredUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  });

  const stats = {
    total: users?.length || 0,
    with_profiles: users?.filter(u => u.has_profile).length || 0,
    without_profiles: users?.filter(u => !u.has_profile).length || 0,
    admin_users: users?.filter(u => u.role === 'admin' || u.role === 'super_admin').length || 0,
    confirmed: users?.filter(u => u.email_confirmed_at).length || 0
  };

  return {
    users: users || [],
    isLoading,
    error,
    stats,
    refetch
  };
};
