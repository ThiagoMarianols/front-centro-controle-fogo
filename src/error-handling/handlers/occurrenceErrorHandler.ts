import { BaseCrudErrorHandler } from '../baseCrudErrorHandler';

class OccurrenceErrorHandler extends BaseCrudErrorHandler {
  constructor() {
    super('Ocorrência');
  }

  protected async handleAuthenticationError(): Promise<void> {
    // Implementação específica para ocorrências
    console.warn('Sessão expirada durante operação com ocorrência');
    // Aqui poderia redirecionar para login ou renovar token
  }

  protected async handleNetworkError(): Promise<void> {
    console.warn('Erro de rede ao processar ocorrência');
    // Implementar retry específico ou cache local se necessário
  }

  // Métodos específicos para ocorrências
  async handleMapDataError(error: any): Promise<void> {
    console.error('Erro ao carregar dados do mapa:', error);
    await this.handleError(error, 'READ', 'Erro ao carregar informações do mapa');
  }

  async handleStatusUpdateError(error: any): Promise<void> {
    console.error('Erro ao atualizar status da ocorrência:', error);
    await this.handleError(error, 'UPDATE', 'Erro ao atualizar status da ocorrência');
  }

  async handleCompleteError(error: any): Promise<void> {
    console.error('Erro ao completar ocorrência:', error);
    await this.handleError(error, 'UPDATE', 'Erro ao completar a ocorrência');
  }

  async handleTypesLoadError(error: any): Promise<void> {
    console.error('Erro ao carregar tipos de ocorrência:', error);
    await this.handleError(error, 'READ', 'Erro ao carregar tipos de ocorrência');
  }

  async handleSubtypesLoadError(error: any): Promise<void> {
    console.error('Erro ao carregar subtipos de ocorrência:', error);
    await this.handleError(error, 'READ', 'Erro ao carregar subtipos de ocorrência');
  }

  async handleNaturesLoadError(error: any): Promise<void> {
    console.error('Erro ao carregar naturezas de ocorrência:', error);
    await this.handleError(error, 'READ', 'Erro ao carregar naturezas de ocorrência');
  }
}

export const occurrenceErrorHandler = new OccurrenceErrorHandler();
