
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchUserRole = async (userId: string): Promise<string> => {
    try {
      console.log('Fetching role for user:', userId);
      
      // First try to get role from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!profileError && profile?.role) {
        console.log('User role from profiles:', profile.role);
        return profile.role;
      }

      // If not found in profiles, try the database function
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_current_user_role');

      if (!roleError && roleData) {
        console.log('User role from function:', roleData);
        return roleData;
      }

      console.log('No role found, defaulting to user');
      return 'user';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const role = await fetchUserRole(session.user.id);
            if (mounted) {
              setUserRole(role);
              console.log('Set user role to:', role);
            }
          } catch (error) {
            console.error('Error fetching role during auth change:', error);
            if (mounted) {
              setUserRole('user');
            }
          }
        } else {
          if (mounted) {
            setUserRole(null);
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        console.log('Initial session check:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const role = await fetchUserRole(session.user.id);
            if (mounted) {
              setUserRole(role);
              console.log('Initial role set to:', role);
            }
          } catch (error) {
            console.error('Error fetching role during session check:', error);
            if (mounted) {
              setUserRole('user');
            }
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Login successful:', data.user?.email);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    userRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
