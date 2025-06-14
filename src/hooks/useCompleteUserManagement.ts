
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
      console.log('Fetching complete user data...');
      
      try {
        // First, try to fetch auth users using admin API
        console.log('Attempting to fetch auth users...');
        const { data: authUsersResponse, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.warn('Admin listUsers failed:', authError);
          // If admin API fails, fall back to profiles-only approach
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*');
          
          if (profileError) throw profileError;
          
          console.log('Fetched profiles only:', profiles?.length || 0);
          
          // Fetch user credits
          const { data: credits, error: creditsError } = await supabase
            .from('user_credits')
            .select('*');
          if (creditsError) throw creditsError;
          
          const creditsMap = new Map(credits?.map(c => [c.user_id, c]) || []);
          
          // Return profile-based users
          const profileUsers: CompleteUser[] = (profiles || []).map(profile => {
            const userCredits = creditsMap.get(profile.id);
            return {
              id: profile.id,
              email: profile.email,
              first_name: profile.first_name,
              last_name: profile.last_name,
              role: profile.role,
              user_type: profile.user_type,
              created_at: profile.created_at,
              email_confirmed_at: undefined, // Not available without auth data
              last_sign_in_at: undefined,
              credits_remaining: userCredits?.credits_remaining || 0,
              credits_purchased: userCredits?.credits_purchased || 0,
              has_profile: true,
              raw_user_meta_data: {}
            };
          });
          
          return applyFilters(profileUsers, searchTerm, roleFilter, userTypeFilter);
        }

        const authUsers = authUsersResponse.users;
        console.log('Fetched auth users:', authUsers?.length || 0);

        // Fetch all profiles
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*');
        if (profileError) throw profileError;
        console.log('Fetched profiles:', profiles?.length || 0);

        // Fetch all user credits
        const { data: credits, error: creditsError } = await supabase
          .from('user_credits')
          .select('*');
        if (creditsError) throw creditsError;
        console.log('Fetched credits:', credits?.length || 0);

        // Create lookup maps
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        const creditsMap = new Map(credits?.map(c => [c.user_id, c]) || []);

        // Combine all data
        const combinedUsers: CompleteUser[] = authUsers.map(authUser => {
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

        console.log('Combined users:', combinedUsers.length);
        return applyFilters(combinedUsers, searchTerm, roleFilter, userTypeFilter);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
    }
  });

  const applyFilters = (userList: CompleteUser[], search: string, role: string, userType: string) => {
    let filteredUsers = userList;

    if (search) {
      filteredUsers = filteredUsers.filter(user =>
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    if (userType !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.user_type === userType);
    }

    return filteredUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

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
