import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate, Navigate } from 'react-router-dom';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isLoaded, orgRole } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const userRole = orgRole || user?.publicMetadata?.role as string | undefined;

  useEffect(() => {
    if (isLoaded && user && userRole !== 'admin') {
      navigate('/home', { replace: true });
    }
  }, [isLoaded, user, userRole, navigate]);

  if (!isLoaded) {
    return null;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

export function useAdminCheck() {
  const { isLoaded, orgRole } = useAuth();
  const { user } = useUser();

  const userRole = orgRole || user?.publicMetadata?.role as string | undefined;

  return { isAdmin: isLoaded && userRole === 'admin', isLoaded, userRole };
}