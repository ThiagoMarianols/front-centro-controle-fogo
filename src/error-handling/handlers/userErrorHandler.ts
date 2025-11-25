import { BaseCrudErrorHandler } from '../baseCrudErrorHandler';

class UserErrorHandler extends BaseCrudErrorHandler {
  constructor() {
    super('Usuário');
  }

  protected async handleAuthenticationError(): Promise<void> {
    console.warn('Sessão expirada durante operação com usuário');
    // Implementação específica para usuários
  }

  protected async handleNetworkError(): Promise<void> {
    console.warn('Erro de rede ao processar usuário');
  }

  // Métodos específicos para usuários
  async handleRegistrationError(error: any): Promise<void> {
    console.error('Erro ao registrar usuário:', error);
    
    // Verifica se é erro de dados duplicados
    if (error.response?.status === 409 || error.message?.includes('já existe')) {
      await this.handleError(error, 'CREATE', 'Este usuário já está cadastrado no sistema');
      return;
    }

    // Verifica se é erro de validação de CPF/email
    if (error.response?.status === 400) {
      const message = error.response?.data?.message;
      if (message?.includes('CPF')) {
        await this.handleError(error, 'CREATE', 'CPF inválido ou já cadastrado');
        return;
      }
      if (message?.includes('email')) {
        await this.handleError(error, 'CREATE', 'Email inválido ou já cadastrado');
        return;
      }
    }

    await this.handleCreateError(error);
  }

  async handlePasswordUpdateError(error: any): Promise<void> {
    console.error('Erro ao atualizar senha:', error);
    
    if (error.response?.status === 400) {
      await this.handleError(error, 'UPDATE', 'Senha atual incorreta ou nova senha não atende aos critérios');
      return;
    }

    await this.handleError(error, 'UPDATE', 'Erro ao atualizar senha');
  }

  async handleProfileUpdateError(error: any): Promise<void> {
    console.error('Erro ao atualizar perfil:', error);
    
    // Verifica se é erro de dados duplicados
    if (error.response?.status === 409) {
      await this.handleError(error, 'UPDATE', 'Dados já utilizados por outro usuário');
      return;
    }

    await this.handleUpdateError(error);
  }

  async handleRoleAssignmentError(error: any): Promise<void> {
    console.error('Erro ao atribuir função:', error);
    
    if (error.response?.status === 403) {
      await this.handleError(error, 'UPDATE', 'Você não tem permissão para atribuir esta função');
      return;
    }

    await this.handleError(error, 'UPDATE', 'Erro ao atribuir função ao usuário');
  }

  async handleBattalionAssignmentError(error: any): Promise<void> {
    console.error('Erro ao atribuir batalhão:', error);
    await this.handleError(error, 'UPDATE', 'Erro ao atribuir batalhão ao usuário');
  }
}

export const userErrorHandler = new UserErrorHandler();
