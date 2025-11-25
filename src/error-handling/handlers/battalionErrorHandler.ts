import { BaseCrudErrorHandler } from '../baseCrudErrorHandler';

class BattalionErrorHandler extends BaseCrudErrorHandler {
  constructor() {
    super('Batalhão');
  }

  protected async handleAuthenticationError(): Promise<void> {
    console.warn('Sessão expirada durante operação com batalhão');
  }

  protected async handleNetworkError(): Promise<void> {
    console.warn('Erro de rede ao processar batalhão');
  }

  // Métodos específicos para batalhões
  async handleAddressValidationError(error: any): Promise<void> {
    console.error('Erro de validação de endereço:', error);
    
    if (error.response?.status === 400) {
      const message = error.response?.data?.message;
      if (message?.includes('CEP')) {
        await this.handleError(error, 'CREATE', 'CEP inválido ou não encontrado');
        return;
      }
      if (message?.includes('endereço')) {
        await this.handleError(error, 'CREATE', 'Dados de endereço inválidos');
        return;
      }
    }

    await this.handleError(error, 'CREATE', 'Erro na validação do endereço');
  }

  async handleDuplicateNameError(error: any): Promise<void> {
    console.error('Erro de nome duplicado:', error);
    
    if (error.response?.status === 409 || error.message?.includes('já existe')) {
      await this.handleError(error, 'CREATE', 'Já existe um batalhão com este nome');
      return;
    }

    await this.handleCreateError(error);
  }

  async handleContactValidationError(error: any): Promise<void> {
    console.error('Erro de validação de contato:', error);
    
    if (error.response?.status === 400) {
      const message = error.response?.data?.message;
      if (message?.includes('email')) {
        await this.handleError(error, 'CREATE', 'Email inválido');
        return;
      }
      if (message?.includes('telefone')) {
        await this.handleError(error, 'CREATE', 'Número de telefone inválido');
        return;
      }
    }

    await this.handleError(error, 'CREATE', 'Dados de contato inválidos');
  }

  async handleDeactivationError(error: any): Promise<void> {
    console.error('Erro ao desativar batalhão:', error);
    
    // Verifica se há usuários ou veículos vinculados
    if (error.response?.status === 409) {
      await this.handleError(
        error, 
        'DELETE', 
        'Não é possível desativar este batalhão pois há usuários ou veículos vinculados'
      );
      return;
    }

    await this.handleDeactivateError(error);
  }

  async handleActivationError(error: any): Promise<void> {
    console.error('Erro ao ativar batalhão:', error);
    await this.handleActivateError(error);
  }

  async handleUpdateWithActiveUsersError(error: any): Promise<void> {
    console.error('Erro ao atualizar batalhão com usuários ativos:', error);
    
    if (error.response?.status === 409) {
      await this.handleError(
        error,
        'UPDATE',
        'Algumas alterações não podem ser feitas pois há usuários ativos vinculados'
      );
      return;
    }

    await this.handleUpdateError(error);
  }
}

export const battalionErrorHandler = new BattalionErrorHandler();
