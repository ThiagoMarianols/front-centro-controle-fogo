import type { ErrorResponse, CrudError, ErrorType } from './types';
import { ErrorType as ErrorTypeEnum } from './types';

export class ErrorAnalyzer {
  static analyzeError(error: any, operation: CrudError['operation'], entity: string): CrudError {
    const errorType = this.determineErrorType(error);
    const userMessage = this.generateUserMessage(error, errorType, operation, entity);

    return {
      type: errorType,
      operation,
      entity,
      originalError: error,
      userMessage,
    };
  }

  private static determineErrorType(error: any): ErrorType {
    // Erro de rede
    if (!error.response && error.request) {
      return ErrorTypeEnum.NETWORK;
    }

    // Erro com resposta HTTP
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          return ErrorTypeEnum.VALIDATION;
        case 401:
          return ErrorTypeEnum.AUTHENTICATION;
        case 403:
          return ErrorTypeEnum.AUTHORIZATION;
        case 404:
          return ErrorTypeEnum.NOT_FOUND;
        case 422:
          return ErrorTypeEnum.VALIDATION;
        case 500:
        case 502:
        case 503:
        case 504:
          return ErrorTypeEnum.SERVER;
        default:
          return ErrorTypeEnum.UNKNOWN;
      }
    }

    // Erro de fetch API
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return ErrorTypeEnum.NETWORK;
    }

    // Erro genérico
    return ErrorTypeEnum.UNKNOWN;
  }

  private static generateUserMessage(
    error: any,
    errorType: ErrorType,
    operation: CrudError['operation'],
    entity: string
  ): string {
    const entityLower = entity.toLowerCase();
    const operationMap = {
      CREATE: 'criar',
      READ: 'buscar',
      UPDATE: 'atualizar',
      DELETE: 'remover',
      LIST: 'listar',
    };

    const operationText = operationMap[operation];

    // Tenta extrair mensagem específica da API
    const apiMessage = this.extractApiMessage(error);
    if (apiMessage) {
      return apiMessage;
    }

    // Mensagens baseadas no tipo de erro
    switch (errorType) {
      case ErrorTypeEnum.NETWORK:
        return 'Verifique sua conexão com a internet e tente novamente';

      case ErrorTypeEnum.AUTHENTICATION:
        return 'Sua sessão expirou. Faça login novamente';

      case ErrorTypeEnum.AUTHORIZATION:
        return `Você não tem permissão para ${operationText} ${entityLower}`;

      case ErrorTypeEnum.NOT_FOUND:
        return `${entity} não encontrado`;

      case ErrorTypeEnum.VALIDATION:
        return `Dados inválidos para ${operationText} ${entityLower}`;

      case ErrorTypeEnum.SERVER:
        return 'Erro interno do servidor. Tente novamente em alguns minutos';

      default:
        return `Não foi possível ${operationText} o ${entityLower}`;
    }
  }

  private static extractApiMessage(error: any): string | null {
    // Tenta extrair mensagem de diferentes estruturas de resposta
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.response?.data?.error) {
      return error.response.data.error;
    }

    if (error.response?.data && typeof error.response.data === 'string') {
      return error.response.data;
    }

    if (error.message && typeof error.message === 'string') {
      return error.message;
    }

    return null;
  }

  static isRetryableError(errorType: ErrorType): boolean {
    return errorType === ErrorTypeEnum.NETWORK || errorType === ErrorTypeEnum.SERVER;
  }

  static shouldRedirectToLogin(errorType: ErrorType): boolean {
    return errorType === ErrorTypeEnum.AUTHENTICATION;
  }
}
