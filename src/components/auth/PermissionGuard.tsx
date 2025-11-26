import type { ReactNode } from 'react';
import { notifications } from '@mantine/notifications';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSION_MESSAGES } from '../../types/permissions';

interface PermissionGuardProps {
  children: ReactNode;
  /** Requer permissão de edição */
  requireEdit?: boolean;
  /** Requer permissão de criação */
  requireCreate?: boolean;
  /** Requer permissão de exclusão */
  requireDelete?: boolean;
  /** Componente alternativo quando não tem permissão (opcional) */
  fallback?: ReactNode;
  /** Se true, mostra notificação quando bloqueado */
  showNotification?: boolean;
}

/**
 * Componente que protege ações baseado nas permissões do usuário.
 * Útil para esconder botões de edição/criação/exclusão para OBSERVADOR.
 */
export function PermissionGuard({
  children,
  requireEdit = false,
  requireCreate = false,
  requireDelete = false,
  fallback = null,
  showNotification = false,
}: PermissionGuardProps) {
  const { canEdit, canCreate, canDelete } = usePermissions();

  const hasPermission = 
    (!requireEdit || canEdit) &&
    (!requireCreate || canCreate) &&
    (!requireDelete || canDelete);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook para verificar permissão antes de executar uma ação.
 * Mostra notificação se não tiver permissão.
 */
export function usePermissionCheck() {
  const { canEdit, canCreate, canDelete, isObservador } = usePermissions();

  const checkEditPermission = (callback: () => void) => {
    if (!canEdit) {
      notifications.show({
        title: 'Ação não permitida',
        message: PERMISSION_MESSAGES.NO_EDIT,
        color: 'red',
        autoClose: 4000,
      });
      return;
    }
    callback();
  };

  const checkCreatePermission = (callback: () => void) => {
    if (!canCreate) {
      notifications.show({
        title: 'Ação não permitida',
        message: PERMISSION_MESSAGES.NO_CREATE,
        color: 'red',
        autoClose: 4000,
      });
      return;
    }
    callback();
  };

  const checkDeletePermission = (callback: () => void) => {
    if (!canDelete) {
      notifications.show({
        title: 'Ação não permitida',
        message: PERMISSION_MESSAGES.NO_DELETE,
        color: 'red',
        autoClose: 4000,
      });
      return;
    }
    callback();
  };

  return {
    checkEditPermission,
    checkCreatePermission,
    checkDeletePermission,
    isObservador,
    canEdit,
    canCreate,
    canDelete,
  };
}
