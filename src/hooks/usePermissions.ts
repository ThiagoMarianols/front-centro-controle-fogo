import { useMemo } from 'react';
import { useAuth } from '../context/authContext';
import { ROLE_PERMISSIONS, RESTRICTED_ROUTES, type UserRole } from '../types/permissions';

export function usePermissions() {
  const { user } = useAuth();

  const userRoles = useMemo(() => {
    if (!user || !('userRoles' in user) || !Array.isArray((user as any).userRoles)) {
      return [];
    }
    return (user as any).userRoles.map((ur: any) => ur.role?.name as UserRole).filter(Boolean);
  }, [user]);

  const primaryRole = useMemo((): UserRole | null => {
    // Prioridade: ADMINISTRADOR > OBSERVADOR > AGENTE
    if (userRoles.includes('ADMINISTRADOR')) return 'ADMINISTRADOR';
    if (userRoles.includes('OBSERVADOR')) return 'OBSERVADOR';
    if (userRoles.includes('AGENTE')) return 'AGENTE';
    return null;
  }, [userRoles]);

  const permissions = useMemo(() => {
    if (!primaryRole) {
      return {
        canAccessDashboard: false,
        canAccessRelatorios: false,
        canAccessBatalhao: false,
        canAccessVeiculos: false,
        canAccessUsuarios: false,
        canAccessOcorrencias: false,
        canEdit: false,
        canCreate: false,
        canDelete: false,
      };
    }
    return ROLE_PERMISSIONS[primaryRole];
  }, [primaryRole]);

  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => userRoles.includes(role));
  };

  const canAccessRoute = (path: string): boolean => {
    // Remove leading slash
    const pathWithoutSlash = path.replace(/^\//, '');
    const segments = pathWithoutSlash.split('/');
    
    // Para rotas de administração, usa os 2 primeiros segmentos (ex: administracao/Users)
    // Para outras rotas, usa apenas o primeiro segmento (ex: EditarOcorrencia)
    const isAdminRoute = segments[0] === 'administracao';
    const cleanPath = isAdminRoute 
      ? segments.slice(0, 2).join('/') 
      : segments[0];
    
    // Verifica se a rota tem restrição
    const allowedRoles = RESTRICTED_ROUTES[cleanPath];
    
    // Se não há restrição definida, permite acesso
    if (!allowedRoles) return true;
    
    // Verifica se o usuário tem alguma das roles permitidas
    return hasAnyRole(allowedRoles);
  };

  const isObservador = primaryRole === 'OBSERVADOR';
  const isAgente = primaryRole === 'AGENTE';
  const isAdministrador = primaryRole === 'ADMINISTRADOR';

  return {
    userRoles,
    primaryRole,
    permissions,
    hasRole,
    hasAnyRole,
    canAccessRoute,
    isObservador,
    isAgente,
    isAdministrador,
    // Atalhos para permissões comuns
    canEdit: permissions.canEdit,
    canCreate: permissions.canCreate,
    canDelete: permissions.canDelete,
  };
}
