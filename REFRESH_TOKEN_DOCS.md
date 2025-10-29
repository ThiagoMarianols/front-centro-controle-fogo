# Documentação do Refresh Token

## Visão Geral

O sistema de autenticação foi configurado com refresh token automático para manter os usuários autenticados de forma segura.

## Como Funciona

### 1. Login
Quando o usuário faz login, o backend retorna:
- `accessToken`: Token de acesso principal (curta duração)
- `refreshToken`: Token para renovação (longa duração)
- `username`: Identificador do usuário
- `id`: ID do usuário

Esses dados são salvos no `localStorage`.

### 2. Interceptor Axios
O arquivo `src/config/axiosConfig.ts` configura dois interceptores:

#### Interceptor de Requisição
- Adiciona automaticamente o `accessToken` no header `Authorization` de todas as requisições

#### Interceptor de Resposta
- Detecta erros 401 (não autorizado)
- Quando o `accessToken` expira:
  1. Pausa a requisição original
  2. Chama o endpoint `/auth/refresh-token/` com o `refreshToken` e `username`
  3. Recebe um novo `accessToken`
  4. Atualiza o `localStorage`
  5. Retenta a requisição original com o novo token
- Se o refresh falhar:
  - Limpa todos os dados do `localStorage`
  - Redireciona para `/login`

### 3. Gerenciamento de Fila
O interceptor usa um sistema de fila para evitar múltiplas chamadas simultâneas de refresh:
- Se uma renovação já está em andamento, novas requisições são enfileiradas
- Quando o novo token chega, todas as requisições enfileiradas são processadas

## Integração Backend

O backend deve ter o endpoint:
```
POST /api/auth/refresh-token/
```

**Request Body:**
```json
{
  "refreshToken": "string",
  "username": "string"
}
```

**Response:**
```json
{
  "token": "novo_access_token"
}
```

## Arquivos Modificados

1. **src/config/axiosConfig.ts**
   - Novo arquivo com interceptores configurados

2. **src/services/authService.ts**
   - Adicionada função `refreshTokenService()`
   - Atualizado para usar axios configurado

3. **src/context/authContext.tsx**
   - Importa axios configurado
   - Salva `username` no login
   - Função `refreshAccessToken()` disponível no contexto
   - Limpeza completa no logout

## Uso Manual

Se precisar renovar o token manualmente:

```typescript
import { useAuth } from './context/authContext';

function MyComponent() {
  const { refreshAccessToken } = useAuth();

  const handleRefresh = async () => {
    try {
      await refreshAccessToken();
      console.log('Token renovado com sucesso');
    } catch (error) {
      console.error('Erro ao renovar token');
    }
  };

  return <button onClick={handleRefresh}>Renovar Token</button>;
}
```

## Segurança

- Tokens são armazenados no `localStorage` (considere usar `httpOnly cookies` em produção)
- O `refreshToken` nunca é enviado em requisições normais, apenas no endpoint específico
- Após falha na renovação, o usuário é automaticamente deslogado
- Todos os tokens são limpos no logout

## Fluxo Visual

```
[Usuário faz requisição] 
    ↓
[Interceptor adiciona token]
    ↓
[Backend responde 401] → [accessToken expirado]
    ↓
[Interceptor detecta 401]
    ↓
[Chama /refresh-token/]
    ↓
[Recebe novo accessToken]
    ↓
[Atualiza localStorage]
    ↓
[Retenta requisição original]
    ↓
[Sucesso!]
```

## Tratamento de Erros

- **401 na primeira requisição**: Renova automaticamente
- **401 no refresh**: Logout e redirecionamento
- **Sem refreshToken**: Logout e redirecionamento
- **Token inválido**: Logout e redirecionamento
