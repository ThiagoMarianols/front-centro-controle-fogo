import { BaseCrudErrorHandler } from '../baseCrudErrorHandler';

class VehicleErrorHandler extends BaseCrudErrorHandler {
  constructor() {
    super('Veículo');
  }

  protected async handleAuthenticationError(): Promise<void> {
    console.warn('Sessão expirada durante operação com veículo');
  }

  protected async handleNetworkError(): Promise<void> {
    console.warn('Erro de rede ao processar veículo');
  }

  // Métodos específicos para veículos
  async handleDuplicateNameError(error: any): Promise<void> {
    console.error('Erro de nome duplicado:', error);
    
    if (error.response?.status === 409 || error.message?.includes('já existe')) {
      await this.handleError(error, 'CREATE', 'Já existe um veículo com este nome neste batalhão');
      return;
    }

    await this.handleCreateError(error);
  }

  async handleBattalionNotFoundError(error: any): Promise<void> {
    console.error('Erro de batalhão não encontrado:', error);
    
    if (error.response?.status === 404) {
      await this.handleError(error, 'CREATE', 'Batalhão selecionado não encontrado');
      return;
    }

    await this.handleCreateError(error);
  }

  async handleInactiveBattalionError(error: any): Promise<void> {
    console.error('Erro de batalhão inativo:', error);
    
    if (error.response?.status === 400) {
      const message = error.response?.data?.message;
      if (message?.includes('inativo')) {
        await this.handleError(error, 'CREATE', 'Não é possível vincular veículo a um batalhão inativo');
        return;
      }
    }

    await this.handleCreateError(error);
  }

  async handleDeactivationError(error: any): Promise<void> {
    console.error('Erro ao desativar veículo:', error);
    
    // Verifica se o veículo está em uso em ocorrências ativas
    if (error.response?.status === 409) {
      await this.handleError(
        error,
        'DELETE',
        'Não é possível desativar este veículo pois está sendo usado em ocorrências ativas'
      );
      return;
    }

    await this.handleDeactivateError(error);
  }

  async handleActivationError(error: any): Promise<void> {
    console.error('Erro ao ativar veículo:', error);
    
    // Verifica se o batalhão está ativo
    if (error.response?.status === 400) {
      const message = error.response?.data?.message;
      if (message?.includes('batalhão')) {
        await this.handleError(
          error,
          'UPDATE',
          'Não é possível ativar veículo de um batalhão inativo'
        );
        return;
      }
    }

    await this.handleActivateError(error);
  }

  async handleBattalionChangeError(error: any): Promise<void> {
    console.error('Erro ao alterar batalhão do veículo:', error);
    
    if (error.response?.status === 409) {
      await this.handleError(
        error,
        'UPDATE',
        'Não é possível alterar o batalhão pois o veículo está em uso'
      );
      return;
    }

    await this.handleUpdateError(error);
  }

  async handleMaintenanceStatusError(error: any): Promise<void> {
    console.error('Erro ao alterar status de manutenção:', error);
    await this.handleError(error, 'UPDATE', 'Erro ao alterar status de manutenção do veículo');
  }

  async handleAssignmentError(error: any): Promise<void> {
    console.error('Erro ao atribuir veículo:', error);
    
    if (error.response?.status === 409) {
      await this.handleError(
        error,
        'UPDATE',
        'Este veículo já está atribuído a outra ocorrência'
      );
      return;
    }

    await this.handleError(error, 'UPDATE', 'Erro ao atribuir veículo');
  }
}

export const vehicleErrorHandler = new VehicleErrorHandler();
