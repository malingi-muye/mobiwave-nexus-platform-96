
import React from 'react';
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles = [],
  redirectTo = '/dashboard'
}) => {
  const { user, userRole, isLoading } = useAuth();

  console.log('RoleBasedRoute - user:', user?.email, 'userRole:', userRole, 'allowedRoles:', allowedRoles, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole || 'user')) {
    console.log('User role not allowed. User role:', userRole, 'Required roles:', allowedRoles);
    return <Navigate to={redirectTo} replace />;
  }

  console.log('Access granted for user:', user.email, 'with role:', userRole);
  return <>{children}</>;
};
