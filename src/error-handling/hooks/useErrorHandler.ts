import { useCallback } from 'react';
import { occurrenceErrorHandler } from '../handlers/occurrenceErrorHandler';
import { userErrorHandler } from '../handlers/userErrorHandler';
import { battalionErrorHandler } from '../handlers/battalionErrorHandler';
import { vehicleErrorHandler } from '../handlers/vehicleErrorHandler';
import type { BaseCrudErrorHandler } from '../baseCrudErrorHandler';

type EntityType = 'occurrence' | 'user' | 'battalion' | 'vehicle';

export function useErrorHandler(entityType: EntityType) {
  const getHandler = useCallback((): BaseCrudErrorHandler => {
    switch (entityType) {
      case 'occurrence':
        return occurrenceErrorHandler;
      case 'user':
        return userErrorHandler;
      case 'battalion':
        return battalionErrorHandler;
      case 'vehicle':
        return vehicleErrorHandler;
      default:
        throw new Error(`Handler não encontrado para entidade: ${entityType}`);
    }
  }, [entityType]);

  const handler = getHandler();

  return {
    // Métodos de erro
    handleCreateError: useCallback((error: any, customMessage?: string) => 
      handler.handleCreateError(error, customMessage), [handler]),
    
    handleUpdateError: useCallback((error: any, customMessage?: string) => 
      handler.handleUpdateError(error, customMessage), [handler]),
    
    handleDeleteError: useCallback((error: any, customMessage?: string) => 
      handler.handleDeleteError(error, customMessage), [handler]),
    
    handleListError: useCallback((error: any, customMessage?: string) => 
      handler.handleListError(error, customMessage), [handler]),
    
    handleReadError: useCallback((error: any, customMessage?: string) => 
      handler.handleReadError(error, customMessage), [handler]),
    
    handleActivateError: useCallback((error: any) => 
      handler.handleActivateError(error), [handler]),
    
    handleDeactivateError: useCallback((error: any) => 
      handler.handleDeactivateError(error), [handler]),

    // Métodos de sucesso
    showCreateSuccess: useCallback(() => 
      handler.showCreateSuccess(), [handler]),
    
    showUpdateSuccess: useCallback(() => 
      handler.showUpdateSuccess(), [handler]),
    
    showDeleteSuccess: useCallback(() => 
      handler.showDeleteSuccess(), [handler]),
    
    showActivateSuccess: useCallback(() => 
      handler.showActivateSuccess(), [handler]),
    
    showDeactivateSuccess: useCallback(() => 
      handler.showDeactivateSuccess(), [handler]),

    // Acesso direto ao handler para métodos específicos
    handler,
  };
}
