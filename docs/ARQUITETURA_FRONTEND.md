# 🏗️ Arquitetura do Frontend

## Visão Geral

O **Frontend Central Controle de Fogo** segue uma arquitetura baseada em componentes React com TypeScript, utilizando padrões modernos de desenvolvimento web.

---

## Padrão Arquitetural

### Component-Based Architecture

```
┌─────────────────────────────────────────────────────┐
│              CAMADA DE APRESENTAÇÃO                 │
│                  (React Components)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Pages   │  │Components│  │  Layout  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│            CAMADA DE GERENCIAMENTO                   │
│                 (State Management)                   │
│  ┌──────────────────────────────────────────┐       │
│  │  Context API (Auth, Theme, etc)          │       │
│  └──────────────────────────────────────────┘       │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              CAMADA DE SERVIÇOS                      │
│             (API Communication)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │   Auth   │  │Occurrence│  │ Battalion│         │
│  │ Service  │  │ Service  │  │ Service  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│           CAMADA DE COMUNICAÇÃO                      │
│              (Axios Instance)                        │
│  ┌────────────────────────────────────────────┐     │
│  │  HTTP Client + Interceptors                │     │
│  └────────────────────────────────────────────┘     │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                    BACKEND API                       │
│              (REST API - Spring Boot)                │
└─────────────────────────────────────────────────────┘
```

---

## Estrutura de Diretórios

### Organização por Funcionalidade

```
src/
├── assets/              # Recursos estáticos (imagens, fonts)
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── NavBar/         # Barra de navegação
│   ├── forms/          # Formulários reutilizáveis
│   └── common/         # Componentes comuns
│
├── pages/              # Páginas (rotas principais)
│   ├── administracao/  # Páginas administrativas
│   ├── Login.tsx       # Página de login
│   ├── Home.tsx        # Dashboard principal
│   └── ...
│
├── services/           # Serviços de API
│   ├── authService.ts
│   ├── occurrenceService.ts
│   └── ...
│
├── context/            # Context API (estado global)
│   └── authContext.tsx
│
├── interfaces/         # TypeScript interfaces
│   ├── IUser.ts
│   ├── IOccurrence.ts
│   └── ...
│
├── config/             # Configurações
│   └── axiosConfig.ts
│
├── styles/             # Estilos globais
│   ├── App.css
│   └── index.css
│
├── mock/               # Dados mock para desenvolvimento
│
├── App.tsx             # Componente raiz
└── main.tsx            # Entry point
```

---

## Camadas da Aplicação

### 1. Camada de Apresentação (UI)

**Responsabilidade:** Renderizar a interface do usuário

#### Pages (Páginas)
Componentes de nível superior que representam rotas:

```typescript
// Home.tsx
export default function Home() {
  return (
    <Container>
      <h1>Dashboard</h1>
      <OccurrenceList />
    </Container>
  );
}
```

**Páginas principais:**
- `Login.tsx` - Autenticação
- `Home.tsx` - Dashboard
- `Ocorrencia.tsx` - Lista de ocorrências
- `RegistroOcorrencia.tsx` - Criar ocorrência
- `DetalhesOcorrencia.tsx` - Detalhes
- `CompletarOcorrencia.tsx` - Finalizar
- `Dashboard.tsx` - Analytics
- `Users.tsx` - Gerenciar usuários
- `Batalhao.tsx` - Gerenciar batalhões

#### Components (Componentes)
Componentes reutilizáveis:

```typescript
// NavBar/index.tsx
export function NavBar2() {
  const { user, logout } = useAuth();
  
  return (
    <nav>
      <Logo />
      <Menu />
      <UserProfile user={user} onLogout={logout} />
    </nav>
  );
}
```

**Tipos de componentes:**
- **Presentational:** Apenas exibem dados
- **Container:** Gerenciam estado e lógica
- **HOC:** Higher-Order Components (ProtectedRoute)

---

### 2. Camada de Gerenciamento de Estado

**Responsabilidade:** Gerenciar estado global da aplicação

#### Context API

```typescript
// authContext.tsx
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // Lógica de autenticação...
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Contextos disponíveis:**
- `AuthContext` - Autenticação e usuário
- (Futuros: ThemeContext, NotificationContext)

---

### 3. Camada de Serviços

**Responsabilidade:** Comunicação com backend via API

#### Estrutura de Serviços

```typescript
// authService.ts
export async function loginService(data: LoginRequest): Promise<LoginResponse> {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
}

export async function getUserInfo(): Promise<UserInfoDTO> {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get(`${API_URL}/auth/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}
```

**Serviços disponíveis:**
- `authService.ts` - Autenticação e usuários
- `occurrenceService.ts` - Ocorrências
- `battalionService.ts` - Batalhões
- `patentService.ts` - Patentes
- `userService.ts` - Operações de usuário

---

### 4. Camada de Comunicação

**Responsabilidade:** HTTP client configurado

#### Axios Configuration

```typescript
// axiosConfig.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se token expirou (401), tenta refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await refreshAccessToken();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Redireciona para login
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## Fluxo de Dados

### Fluxo Unidirecional

```
User Action
    ↓
Component Event Handler
    ↓
Service Call (API)
    ↓
Axios Request
    ↓
Backend API
    ↓
Response
    ↓
Service Returns Data
    ↓
Component Updates State
    ↓
React Re-renders
    ↓
UI Updates
```

---

## Roteamento

### React Router DOM

```typescript
// main.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { 
        path: '', 
        element: <ProtectedRoute><Home /></ProtectedRoute> 
      },
      { 
        path: 'Ocorrencia', 
        element: <ProtectedRoute><Ocorrencia /></ProtectedRoute> 
      },
      // ... mais rotas
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
```

### Proteção de Rotas

```typescript
// ProtectedRoute.tsx
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

---

## Gerenciamento de Estado

### Local State (useState)

Para estado específico de componente:

```typescript
function OccurrenceForm() {
  const [formData, setFormData] = useState<OccurrenceData>({
    requester: '',
    phoneNumber: '',
    address: {}
  });
  
  // Lógica do componente...
}
```

### Global State (Context API)

Para estado compartilhado entre componentes:

```typescript
// Uso do contexto
function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header>
      <span>Bem-vindo, {user?.name}</span>
      <button onClick={logout}>Sair</button>
    </header>
  );
}
```

---

## TypeScript Interfaces

### Tipagem Forte

```typescript
// interfaces/IUser.ts
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  cpf: string;
  phoneNumber: string;
  gender: string;
  dateBirth: string;
  battalion: Battalion;
  patent: Patent;
  roles: Role[];
  usingDefaultPassword: boolean;
  active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  expiresRefreshToken: number;
  id: number;
}
```

---

## Build e Bundle

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Centro Controle Fogo',
        short_name: 'CCF',
        // ...
      }
    })
  ],
  server: {
    port: 5173,
    strictPort: true,
    host: true
  }
});
```

### Otimizações de Build

- **Code Splitting:** Automático por rota
- **Tree Shaking:** Remove código não utilizado
- **Minification:** Código minificado
- **Lazy Loading:** Componentes carregados sob demanda

---

## PWA (Progressive Web App)

### Service Worker

```typescript
// main.tsx
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nova atualização disponível!')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App pronto para uso offline');
  },
});
```

### Cache Strategy

- **Runtime Caching:** Requisições API
- **Precaching:** Assets estáticos
- **Offline Fallback:** Página offline

---

## Segurança

### Proteções Implementadas

1. **JWT Token Storage**
   - Tokens em `localStorage`
   - Renovação automática

2. **Protected Routes**
   - Validação de autenticação
   - Redirecionamento para login

3. **CORS**
   - Configurado no backend
   - Credenciais incluídas

4. **XSS Prevention**
   - React auto-escape
   - DOMPurify (se necessário)

5. **HTTPS Only (Produção)**
   - Tokens apenas via HTTPS
   - Secure cookies

---

## Performance

### Otimizações

1. **Code Splitting**
```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

2. **Memoization**
```typescript
const MemoizedComponent = memo(ExpensiveComponent);
```

3. **useMemo / useCallback**
```typescript
const filteredData = useMemo(
  () => data.filter(item => item.active),
  [data]
);
```

4. **Virtualization**
- Listas grandes com paginação
- Lazy loading de imagens

---

## Testes (Planejado)

### Estratégia de Testes

```
├── Unit Tests (Jest + React Testing Library)
├── Integration Tests (API mocking)
├── E2E Tests (Cypress/Playwright)
└── Visual Regression (Storybook + Chromatic)
```

---

## CI/CD (Planejado)

### Pipeline

```
Git Push
  ↓
Lint & Type Check
  ↓
Run Tests
  ↓
Build
  ↓
Deploy to Staging
  ↓
Manual Approval
  ↓
Deploy to Production
```

---

## Escalabilidade

### Considerações

1. **Lazy Loading:** Rotas carregadas sob demanda
2. **Code Splitting:** Bundle otimizado
3. **CDN:** Assets servidos via CDN
4. **Caching:** Service Worker + HTTP cache
5. **Monitoramento:** Error tracking (Sentry)

---

## Padrões de Código

### Convenções

1. **Naming:**
   - Components: PascalCase
   - Functions: camelCase
   - Constants: UPPER_SNAKE_CASE

2. **File Structure:**
   - Um componente por arquivo
   - Index.tsx para export

3. **Imports:**
   - Absolute imports quando possível
   - Agrupados por tipo

4. **TypeScript:**
   - Tipagem explícita
   - Evitar `any`
   - Interfaces para props

---

## Conclusão

A arquitetura do frontend foi projetada para:

✅ **Manutenibilidade** - Código organizado e modular  
✅ **Escalabilidade** - Fácil adicionar novas features  
✅ **Performance** - Otimizações de bundle e runtime  
✅ **Segurança** - Proteções contra vulnerabilidades  
✅ **Developer Experience** - TypeScript + Vite + ESLint  
✅ **User Experience** - PWA + Responsivo + Rápido
