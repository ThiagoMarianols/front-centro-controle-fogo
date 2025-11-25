export interface ErrorResponse {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface NotificationConfig {
  title: string;
  message: string;
  color: 'red' | 'green' | 'yellow' | 'blue';
  autoClose?: number;
  withCloseButton?: boolean;
}

export const ErrorType = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

export interface CrudError {
  type: ErrorType;
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LIST';
  entity: string;
  originalError: any;
  userMessage: string;
}
