// Tipos
export * from './types';

// Serviços principais
export { notificationService } from './notificationService';
export { ErrorAnalyzer } from './errorAnalyzer';
export { BaseCrudErrorHandler } from './baseCrudErrorHandler';

// Handlers específicos
export { occurrenceErrorHandler } from './handlers/occurrenceErrorHandler';
export { userErrorHandler } from './handlers/userErrorHandler';
export { battalionErrorHandler } from './handlers/battalionErrorHandler';
export { vehicleErrorHandler } from './handlers/vehicleErrorHandler';

// Hook personalizado para facilitar o uso
export { useErrorHandler } from './hooks/useErrorHandler';
