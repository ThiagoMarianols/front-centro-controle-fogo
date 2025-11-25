# Sistema de Tratamento de Erros

Este sistema fornece uma abordagem centralizada e consistente para o tratamento de erros em todas as operações CRUD do projeto.

## Estrutura

```
src/error-handling/
├── types.ts                    # Tipos e interfaces
├── notificationService.ts      # Serviço de notificações
├── errorAnalyzer.ts           # Análise e classificação de erros
├── baseCrudErrorHandler.ts    # Handler base para CRUDs
├── handlers/                  # Handlers específicos por entidade
│   ├── occurrenceErrorHandler.ts
│   ├── userErrorHandler.ts
│   ├── battalionErrorHandler.ts
│   └── vehicleErrorHandler.ts
├── hooks/
│   └── useErrorHandler.ts     # Hook React personalizado
└── index.ts                   # Exportações centralizadas
```

## Como Usar

### 1. Hook useErrorHandler

```tsx
import { useErrorHandler } from '../error-handling';

function MeuComponente() {
  const errorHandler = useErrorHandler('occurrence'); // 'occurrence' | 'user' | 'battalion' | 'vehicle'
  
  const handleCreate = async (data) => {
    try {
      await createService(data);
      errorHandler.showCreateSuccess();
    } catch (error) {
      await errorHandler.handleCreateError(error);
    }
  };
}
```

### 2. Notificações Diretas

```tsx
import { notificationService } from '../error-handling';

// Validações
notificationService.showValidationError('Preencha todos os campos');

// Sucesso
notificationService.showSuccess('Título', 'Mensagem');

// Erro
notificationService.showError('Título', 'Mensagem');
```

### 3. Handlers Específicos

```tsx
import { occurrenceErrorHandler } from '../error-handling';

// Métodos específicos para ocorrências
await occurrenceErrorHandler.handleMapDataError(error);
await occurrenceErrorHandler.handleStatusUpdateError(error);
```

## Funcionalidades

### Análise Automática de Erros
- **Rede**: Problemas de conectividade
- **Autenticação**: Token expirado (401)
- **Autorização**: Sem permissão (403)
- **Validação**: Dados inválidos (400, 422)
- **Não encontrado**: Recurso inexistente (404)
- **Servidor**: Erros internos (5xx)

### Notificações Inteligentes
- **Cores apropriadas**: Verde (sucesso), Vermelho (erro), Amarelo (aviso), Azul (info)
- **Tempo automático**: Diferentes durações baseadas no tipo
- **Mensagens contextuais**: Específicas para cada operação e entidade

### Tratamento por Entidade
Cada entidade tem seu próprio handler com tratamentos específicos:

#### Ocorrências
- Erros de carregamento de mapa
- Falhas na atualização de status
- Problemas com tipos/subtipos

#### Usuários
- Dados duplicados (CPF, email)
- Validação de senha
- Atribuição de funções

#### Batalhões
- Validação de endereço
- Nomes duplicados
- Desativação com dependências

#### Veículos
- Batalhão inativo
- Veículo em uso
- Problemas de manutenção

## Métodos Disponíveis

### Hook useErrorHandler
```tsx
const {
  // Tratamento de erros
  handleCreateError,
  handleUpdateError,
  handleDeleteError,
  handleListError,
  handleReadError,
  handleActivateError,
  handleDeactivateError,
  
  // Notificações de sucesso
  showCreateSuccess,
  showUpdateSuccess,
  showDeleteSuccess,
  showActivateSuccess,
  showDeactivateSuccess,
  
  // Acesso ao handler específico
  handler
} = useErrorHandler('entityType');
```

### NotificationService
```tsx
// Métodos básicos
notificationService.show(config);
notificationService.showSuccess(title, message);
notificationService.showError(title, message);
notificationService.showWarning(title, message);
notificationService.showInfo(title, message);

// Métodos CRUD
notificationService.showCreateSuccess(entity);
notificationService.showUpdateSuccess(entity);
notificationService.showDeleteSuccess(entity);

// Métodos de erro
notificationService.showCreateError(entity, customMessage);
notificationService.showUpdateError(entity, customMessage);
notificationService.showValidationError(message);
notificationService.showNetworkError();
notificationService.showAuthenticationError();
```

## Configuração

O sistema está configurado para usar o Mantine Notifications. Certifique-se de que o provider esteja configurado no seu App:

```tsx
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

function App() {
  return (
    <MantineProvider>
      <Notifications />
      {/* Seu app */}
    </MantineProvider>
  );
}
```

## Benefícios

1. **Consistência**: Todas as notificações seguem o mesmo padrão
2. **Manutenibilidade**: Mudanças centralizadas
3. **Experiência do usuário**: Mensagens claras e contextuais
4. **Debugging**: Logs detalhados para desenvolvimento
5. **Flexibilidade**: Handlers específicos para casos especiais
6. **Tipagem**: TypeScript para maior segurança
