
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      setShouldRedirect(true);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
