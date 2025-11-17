import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, usingDefaultPassword } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [isAuthenticated, location]);

  const hasToken = Boolean(localStorage.getItem('accessToken'));

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

//   if (usingDefaultPassword) {
//     return <Navigate to="/reset-password" replace />;
//   }

  return <>{children}</>;
}