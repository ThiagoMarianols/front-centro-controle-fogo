import { ErrorAnalyzer } from './errorAnalyzer';
import { notificationService } from './notificationService';
import type { CrudError } from './types';
import { ErrorType } from './types';

export abstract class BaseCrudErrorHandler {
  protected entityName: string;

  constructor(entityName: string) {
    this.entityName = entityName;
  }

  async handleError(
    error: any,
    operation: CrudError['operation'],
    customMessage?: string
  ): Promise<void> {
    console.error(`Erro na operação ${operation} para ${this.entityName}:`, error);

    const analyzedError = ErrorAnalyzer.analyzeError(error, operation, this.entityName);
    
    // Log detalhado para debug
    this.logError(analyzedError);

    // Mostra notificação apropriada
    this.showNotification(analyzedError, customMessage);

    // Ações específicas baseadas no tipo de erro
    await this.handleSpecificError(analyzedError);
  }

  private logError(error: CrudError): void {
    console.group(`🚨 Erro ${error.operation} - ${error.entity}`);
    console.log('Tipo:', error.type);
    console.log('Mensagem:', error.userMessage);
    console.log('Erro original:', error.originalError);
    console.groupEnd();
  }

  private showNotification(error: CrudError, customMessage?: string): void {
    const message = customMessage || error.userMessage;

    switch (error.operation) {
      case 'CREATE':
        notificationService.showCreateError(this.entityName, message);
        break;
      case 'UPDATE':
        notificationService.showUpdateError(this.entityName, message);
        break;
      case 'DELETE':
        notificationService.showDeleteError(this.entityName, message);
        break;
      case 'LIST':
      case 'READ':
        notificationService.showLoadError(this.entityName);
        break;
    }
  }

  private async handleSpecificError(error: CrudError): Promise<void> {
    switch (error.type) {
      case ErrorType.AUTHENTICATION:
        await this.handleAuthenticationError();
        break;
      case ErrorType.NETWORK:
        await this.handleNetworkError();
        break;
      case ErrorType.SERVER:
        await this.handleServerError();
        break;
      default:
        // Outros tipos de erro não precisam de ação específica
        break;
    }
  }

  protected async handleAuthenticationError(): Promise<void> {
    // Implementação padrão - pode ser sobrescrita
    console.warn('Erro de autenticação detectado. Considere redirecionar para login.');
  }

  protected async handleNetworkError(): Promise<void> {
    // Implementação padrão - pode ser sobrescrita
    console.warn('Erro de rede detectado. Considere implementar retry automático.');
  }

  protected async handleServerError(): Promise<void> {
    // Implementação padrão - pode ser sobrescrita
    console.warn('Erro de servidor detectado. Considere implementar retry automático.');
  }

  // Métodos de conveniência para operações específicas
  async handleCreateError(error: any, customMessage?: string): Promise<void> {
    await this.handleError(error, 'CREATE', customMessage);
  }

  async handleUpdateError(error: any, customMessage?: string): Promise<void> {
    await this.handleError(error, 'UPDATE', customMessage);
  }

  async handleDeleteError(error: any, customMessage?: string): Promise<void> {
    await this.handleError(error, 'DELETE', customMessage);
  }

  async handleListError(error: any, customMessage?: string): Promise<void> {
    await this.handleError(error, 'LIST', customMessage);
  }

  async handleReadError(error: any, customMessage?: string): Promise<void> {
    await this.handleError(error, 'READ', customMessage);
  }

  // Métodos para operações de ativação/desativação
  async handleActivateError(error: any): Promise<void> {
    console.error(`Erro ao ativar ${this.entityName}:`, error);
    notificationService.showActivateError(this.entityName);
  }

  async handleDeactivateError(error: any): Promise<void> {
    console.error(`Erro ao desativar ${this.entityName}:`, error);
    notificationService.showDeactivateError(this.entityName);
  }

  // Métodos para sucesso
  showCreateSuccess(): void {
    notificationService.showCreateSuccess(this.entityName);
  }

  showUpdateSuccess(): void {
    notificationService.showUpdateSuccess(this.entityName);
  }

  showDeleteSuccess(): void {
    notificationService.showDeleteSuccess(this.entityName);
  }

  showActivateSuccess(): void {
    notificationService.showActivateSuccess(this.entityName);
  }

  showDeactivateSuccess(): void {
    notificationService.showDeactivateSuccess(this.entityName);
  }
}
