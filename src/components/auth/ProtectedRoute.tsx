import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../context/authContext';
import { usePermissions } from '../../hooks/usePermissions';
import type { UserRole } from '../../types/permissions';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const { hasAnyRole, canAccessRoute, primaryRole } = usePermissions();
  const location = useLocation();
  const notificationShownRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [isAuthenticated, location]);

  const hasToken = Boolean(localStorage.getItem('accessToken'));

  // Verifica autenticação
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Verifica permissão de acesso à rota
  const hasPermission = allowedRoles 
    ? hasAnyRole(allowedRoles) 
    : canAccessRoute(location.pathname);

  if (user && primaryRole && !hasPermission) {
    // Mostra notificação apenas uma vez por rota
    const notificationKey = `${location.pathname}-${primaryRole}`;
    if (notificationShownRef.current !== notificationKey) {
      notificationShownRef.current = notificationKey;
      notifications.show({
        title: 'Acesso Negado',
        message: 'Você não tem permissão para acessar esta página.',
        color: 'red',
        autoClose: 5000,
      });
    }
    
    // Redireciona para a página inicial ou ocorrências (dependendo do role)
    const redirectPath = primaryRole === 'AGENTE' ? '/Ocorrencia' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}