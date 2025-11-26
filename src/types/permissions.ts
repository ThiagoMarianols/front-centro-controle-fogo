// Tipos de roles do sistema
export type UserRole = 'ADMINISTRADOR' | 'AGENTE' | 'OBSERVADOR';

// Configuração de permissões por role
export const ROLE_PERMISSIONS = {
  ADMINISTRADOR: {
    // Acesso total ao sistema
    canAccessDashboard: true,
    canAccessRelatorios: true,
    canAccessBatalhao: true,
    canAccessVeiculos: true,
    canAccessUsuarios: true,
    canAccessOcorrencias: true,
    canEdit: true,
    canCreate: true,
    canDelete: true,
  },
  AGENTE: {
    // Acesso operacional - apenas ocorrências
    canAccessDashboard: false,
    canAccessRelatorios: false,
    canAccessBatalhao: false,
    canAccessVeiculos: false,
    canAccessUsuarios: false,
    canAccessOcorrencias: true,
    canEdit: true,
    canCreate: true,
    canDelete: false,
  },
  OBSERVADOR: {
    // Apenas visualização
    canAccessDashboard: true,
    canAccessRelatorios: true,
    canAccessBatalhao: true,
    canAccessVeiculos: true,
    canAccessUsuarios: true,
    canAccessOcorrencias: true,
    canEdit: false,
    canCreate: false,
    canDelete: false,
  },
} as const;

// Rotas restritas por role
export const RESTRICTED_ROUTES: Record<string, UserRole[]> = {
  // Rotas de administração - apenas ADMINISTRADOR e OBSERVADOR
  'administracao/Users': ['ADMINISTRADOR', 'OBSERVADOR'],
  'administracao/CadastroUsuario': ['ADMINISTRADOR'],
  'administracao/EditarUsuario': ['ADMINISTRADOR'],
  'administracao/DetalhesUsuario': ['ADMINISTRADOR', 'OBSERVADOR'],
  
  // Batalhão
  'administracao/Batalhao': ['ADMINISTRADOR', 'OBSERVADOR'],
  'administracao/RegistroBatalhao': ['ADMINISTRADOR'],
  'administracao/EditarBatalhao': ['ADMINISTRADOR'],
  
  // Veículos
  'administracao/Veiculo': ['ADMINISTRADOR', 'OBSERVADOR'],
  'administracao/RegistroVeiculo': ['ADMINISTRADOR'],
  'administracao/EditarVeiculo': ['ADMINISTRADOR'],
  
  // Relatórios e Dashboard
  'administracao/Relatorios': ['ADMINISTRADOR', 'OBSERVADOR'],
  'dashboard': ['ADMINISTRADOR', 'OBSERVADOR'],
  
  // Cadastro de tipos de ocorrência
  'administracao/CadastroOcorrenciaSecun': ['ADMINISTRADOR'],
  
  // Ocorrências - todos podem acessar
  'Ocorrencia': ['ADMINISTRADOR', 'AGENTE', 'OBSERVADOR'],
  'RegistroOcorrencia': ['ADMINISTRADOR', 'AGENTE'],
  'EditarOcorrencia': ['ADMINISTRADOR', 'AGENTE'],
  'DetalhesOcorrencia': ['ADMINISTRADOR', 'AGENTE', 'OBSERVADOR'],
  'CompletarOcorrencia': ['ADMINISTRADOR', 'AGENTE'],
  
  // Home - todos podem acessar
  '': ['ADMINISTRADOR', 'AGENTE', 'OBSERVADOR'],
};

// Mensagens de erro por tipo de restrição
export const PERMISSION_MESSAGES = {
  NO_ACCESS: 'Você não tem permissão para acessar esta página.',
  NO_EDIT: 'Você não tem permissão para editar este registro.',
  NO_CREATE: 'Você não tem permissão para criar novos registros.',
  NO_DELETE: 'Você não tem permissão para excluir registros.',
};
