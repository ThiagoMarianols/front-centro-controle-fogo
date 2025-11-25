import { notifications } from '@mantine/notifications';
import type { NotificationConfig } from './types';

class NotificationService {
  private defaultConfig: Partial<NotificationConfig> = {
    autoClose: 5000,
    withCloseButton: true,
  };

  show(config: NotificationConfig): void {
    notifications.show({
      ...this.defaultConfig,
      ...config,
    });
  }

  showSuccess(title: string, message: string, autoClose?: number): void {
    this.show({
      title,
      message,
      color: 'green',
      autoClose: autoClose ?? 4000,
    });
  }

  showError(title: string, message: string, autoClose?: number): void {
    this.show({
      title,
      message,
      color: 'red',
      autoClose: autoClose ?? 6000,
    });
  }

  showWarning(title: string, message: string, autoClose?: number): void {
    this.show({
      title,
      message,
      color: 'yellow',
      autoClose: autoClose ?? 5000,
    });
  }

  showInfo(title: string, message: string, autoClose?: number): void {
    this.show({
      title,
      message,
      color: 'blue',
      autoClose: autoClose ?? 4000,
    });
  }

  // Métodos específicos para operações CRUD
  showCreateSuccess(entity: string): void {
    this.showSuccess('Sucesso', `${entity} criado com sucesso`);
  }

  showUpdateSuccess(entity: string): void {
    this.showSuccess('Sucesso', `${entity} atualizado com sucesso`);
  }

  showDeleteSuccess(entity: string): void {
    this.showSuccess('Sucesso', `${entity} removido com sucesso`);
  }

  showActivateSuccess(entity: string): void {
    this.showSuccess('Sucesso', `${entity} ativado com sucesso`);
  }

  showDeactivateSuccess(entity: string): void {
    this.showSuccess('Sucesso', `${entity} desativado com sucesso`);
  }

  showLoadError(entity: string): void {
    this.showError('Erro', `Erro ao carregar ${entity.toLowerCase()}`);
  }

  showCreateError(entity: string, customMessage?: string): void {
    this.showError(
      'Erro',
      customMessage || `Não foi possível criar o ${entity.toLowerCase()}`
    );
  }

  showUpdateError(entity: string, customMessage?: string): void {
    this.showError(
      'Erro',
      customMessage || `Não foi possível atualizar o ${entity.toLowerCase()}`
    );
  }

  showDeleteError(entity: string, customMessage?: string): void {
    this.showError(
      'Erro',
      customMessage || `Não foi possível remover o ${entity.toLowerCase()}`
    );
  }

  showActivateError(entity: string): void {
    this.showError('Erro', `Erro ao ativar ${entity.toLowerCase()}`);
  }

  showDeactivateError(entity: string): void {
    this.showError('Erro', `Erro ao desativar ${entity.toLowerCase()}`);
  }

  showNetworkError(): void {
    this.showError(
      'Erro de Conexão',
      'Verifique sua conexão com a internet e tente novamente'
    );
  }

  showAuthenticationError(): void {
    this.showError(
      'Erro de Autenticação',
      'Sua sessão expirou. Faça login novamente'
    );
  }

  showAuthorizationError(): void {
    this.showError(
      'Acesso Negado',
      'Você não tem permissão para realizar esta ação'
    );
  }

  showValidationError(message: string): void {
    this.showError('Dados Inválidos', message);
  }

  showServerError(): void {
    this.showError(
      'Erro do Servidor',
      'Ocorreu um erro interno. Tente novamente em alguns minutos'
    );
  }
}

export const notificationService = new NotificationService();
