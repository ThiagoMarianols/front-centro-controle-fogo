# 🔥 Frontend Central Controle de Fogo

## 📋 Sobre o Projeto

Aplicação web frontend desenvolvida em parceria com o **Corpo de Bombeiros de Pernambuco** pela **Faculdade Senac** para interface de usuário do sistema de gerenciamento centralizado de ocorrências de incêndio.

### 🎯 Objetivos

- ✅ Interface moderna e responsiva para registro de ocorrências
- ✅ Dashboard interativo com visualização de dados
- ✅ Gerenciamento de usuários, batalhões e patentes
- ✅ Autenticação segura com JWT
- ✅ PWA (Progressive Web App) para uso offline
- ✅ Geolocalização de incidentes

---

## 🚀 Tecnologias

### Core
- **React 19.1.1** - Biblioteca JavaScript
- **TypeScript 5.8.3** - Tipagem estática
- **Vite 7.1.7** - Build tool e dev server

### UI Framework
- **Mantine 8.3.2** - Component library completa
- **Tabler Icons** - Ícones
- **React Icons** - Ícones adicionais

### Roteamento e Estado
- **React Router DOM 7.9.3** - Navegação
- **Context API** - Gerenciamento de estado global

### Comunicação
- **Axios 1.12.2** - Cliente HTTP
- **JWT** - Autenticação

### Charts e Visualização
- **Recharts 3.2.1** - Gráficos e dashboards
- **Mantine Charts** - Gráficos integrados

### PWA
- **Vite Plugin PWA 1.1.0** - Service Worker
- **Workbox** - Cache strategies

### Outras Bibliotecas
- **Day.js** - Manipulação de datas
- **TipTap** - Editor de texto rico
- **Embla Carousel** - Carrosséis
- **Sass 1.93.2** - Pré-processador CSS

---

## 📁 Estrutura do Projeto

```
front-centro-controle-fogo/
├── public/                     # Assets estáticos
│   ├── manifest.json
│   └── vite.svg
│
├── src/
│   ├── assets/                 # Imagens, fonts, etc
│   │   └── img/
│   │
│   ├── components/             # Componentes reutilizáveis
│   │   ├── auth/              # Componentes de autenticação
│   │   ├── NavBar/            # Barra de navegação
│   │   └── ...
│   │
│   ├── pages/                  # Páginas da aplicação
│   │   ├── administracao/     # Páginas administrativas
│   │   │   ├── Users.tsx
│   │   │   ├── UserReg.tsx
│   │   │   ├── Batalhao.tsx
│   │   │   ├── RegistroBatalhao.tsx
│   │   │   └── TipoOcorrencia.tsx
│   │   ├── Login.tsx
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Ocorrencia.tsx
│   │   ├── RegistroOcorrencia.tsx
│   │   ├── DetalhesOcorrencia.tsx
│   │   ├── CompletarOcorrencia.tsx
│   │   └── Relatorios.tsx
│   │
│   ├── services/               # Serviços de API
│   │   ├── authService.ts
│   │   ├── occurrenceService.ts
│   │   ├── battalionService.ts
│   │   ├── patentService.ts
│   │   └── userService.ts
│   │
│   ├── context/                # Context API
│   │   └── authContext.tsx
│   │
│   ├── interfaces/             # TypeScript interfaces
│   │   ├── IUser.ts
│   │   ├── IOccurrence.ts
│   │   ├── IBattalion.ts
│   │   └── IPatent.ts
│   │
│   ├── config/                 # Configurações
│   │   └── axiosConfig.ts
│   │
│   ├── styles/                 # Estilos globais
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── mock/                   # Dados mock para desenvolvimento
│   │
│   ├── App.tsx                 # Componente raiz
│   ├── main.tsx                # Entry point
│   └── vite-env.d.ts
│
├── docs/                       # Documentação técnica
├── .env                        # Variáveis de ambiente
├── index.html                  # HTML principal
├── package.json                # Dependências
├── tsconfig.json               # Config TypeScript
├── vite.config.ts              # Config Vite
└── README.md                   # Este arquivo
```

---

## ⚙️ Configuração e Instalação

### Pré-requisitos

- Node.js 18+ ou superior
- npm ou yarn
- Backend rodando (http://localhost:8080)

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd front-centro-controle-fogo
```

### 2. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configurar Variáveis de Ambiente

Crie/edite o arquivo `.env`:

```env
VITE_BASE_URL=http://localhost:8080/api
```

### 4. Executar em Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em: `http://localhost:5173`

### 5. Build para Produção

```bash
npm run build
# ou
yarn build
```

Os arquivos otimizados estarão em `dist/`

### 6. Preview da Build

```bash
npm run preview
# ou
yarn preview
```

---

## 🔐 Autenticação

### Fluxo de Login

1. Usuário acessa `/login`
2. Insere credenciais (email/senha)
3. Sistema valida com backend
4. Recebe `accessToken` e `refreshToken`
5. Tokens salvos no `localStorage`
6. Redirecionado para home

### Proteção de Rotas

Todas as rotas (exceto `/login`) são protegidas pelo componente `<ProtectedRoute>`:

```tsx
<ProtectedRoute>
  <Home />
</ProtectedRoute>
```

### Refresh Token Automático

- Token expira em 10 horas
- Refresh token válido por 30 dias
- Renovação automática via `authContext`

---

## 📡 Integração com Backend

### Base URL

```typescript
const API_URL = import.meta.env.VITE_BASE_URL;
// http://localhost:8080/api
```

### Serviços Disponíveis

#### authService
- `loginService()` - Login de usuários
- `getUserInfo()` - Buscar info do usuário
- `logoutService()` - Logout
- `refreshTokenService()` - Renovar token
- `getUsersPaginated()` - Listar usuários
- `deactivateUser()` - Desativar usuário
- `activateUser()` - Ativar usuário

#### occurrenceService
- `createOccurrence()` - Criar ocorrência
- `getOccurrenceById()` - Buscar por ID
- `getOccurrencesPaginated()` - Listar paginado
- `completeOccurrence()` - Concluir ocorrência
- `updateOccurrence()` - Atualizar
- `deactivateOccurrence()` - Desativar
- `activateOccurrence()` - Ativar

#### battalionService
- `createBattalion()` - Criar batalhão
- `getBattalionById()` - Buscar por ID
- `getBattalionsPaginated()` - Listar paginado
- `updateBattalion()` - Atualizar
- `deactivateBattalion()` - Desativar
- `activateBattalion()` - Ativar

#### patentService
- `createPatent()` - Criar patente
- `getPatentById()` - Buscar por ID
- `getAllPatents()` - Listar todas
- `getPatentsPaginated()` - Listar paginado
- `updatePatent()` - Atualizar

#### userService
- `createUser()` - Criar usuário
- `getUserById()` - Buscar por ID

---

## 🗺️ Rotas da Aplicação

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Home | Página inicial |
| `/login` | Login | Autenticação |
| `/dashboard` | Dashboard | Visualização de dados |
| `/Ocorrencia` | Ocorrencia | Lista de ocorrências |
| `/RegistroOcorrencia` | RegistroOcorrencia | Criar ocorrência |
| `/DetalhesOcorrencia/:id` | DetalhesOcorrencia | Detalhes da ocorrência |
| `/CompletarOcorrencia` | CompletarOcorrencia | Finalizar ocorrência |
| `/administracao/Users` | Users | Gerenciar usuários |
| `/administracao/CadastroUsuario` | CadastroUsuario | Criar usuário |
| `/administracao/Batalhao` | Batalhao | Gerenciar batalhões |
| `/administracao/RegistroBatalhao` | RegistroBatalhao | Criar batalhão |
| `/administracao/TipoOcorrencia` | TipoOcorrencia | Tipos de ocorrência |
| `/administracao/Relatorios` | Relatorios | Relatórios |

---

## 🎨 UI/UX

### Mantine Components

O projeto utiliza **Mantine UI** com os seguintes módulos:

- **@mantine/core** - Componentes base
- **@mantine/hooks** - React hooks úteis
- **@mantine/form** - Gerenciamento de formulários
- **@mantine/notifications** - Notificações toast
- **@mantine/modals** - Modais
- **@mantine/dates** - Date pickers
- **@mantine/dropzone** - Upload de arquivos
- **@mantine/charts** - Gráficos
- **@mantine/carousel** - Carrosséis
- **@mantine/tiptap** - Editor de texto

### Temas e Estilos

Estilos customizados em:
- `src/styles/App.css`
- `src/styles/index.css`

---

## 📱 PWA (Progressive Web App)

### Funcionalidades PWA

✅ **Instalável** - Pode ser instalado como app nativo  
✅ **Offline** - Funciona sem conexão  
✅ **Service Worker** - Cache automático  
✅ **Notificações** - Push notifications (futuro)  
✅ **Ícones** - 192x192 e 512x512

### Configuração PWA

```typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Centro Controle Fogo',
    short_name: 'CCF',
    description: 'Aplicativo de Controle de Incêndios',
    theme_color: '#ffffff'
  }
})
```

### Instalação

1. Acesse a aplicação pelo navegador
2. Clique em "Instalar" no navegador
3. App será adicionado à tela inicial

---

## 🔍 Principais Componentes

### NavBar

Barra de navegação principal com:
- Logo do Corpo de Bombeiros
- Menu de navegação
- Perfil do usuário
- Botão de logout

### ProtectedRoute

Wrapper para proteger rotas autenticadas:

```tsx
<ProtectedRoute>
  <ComponenteProtegido />
</ProtectedRoute>
```

### AuthProvider

Context provider para autenticação:
- Estado global de autenticação
- Funções de login/logout
- Gerenciamento de tokens

---

## 📊 Dashboard e Visualizações

### Recharts

Biblioteca para gráficos:
- Gráficos de linha
- Gráficos de barra
- Gráficos de pizza
- Gráficos de área

### Mantine Charts

Gráficos integrados com Mantine:
- Sparklines
- BarChart
- LineChart
- AreaChart

---

## 🧪 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint

# Preview
npm run preview
```

### ESLint

Configurado com:
- TypeScript ESLint
- React Hooks plugin
- React Refresh plugin

### TypeScript

Três configurações:
- `tsconfig.json` - Config base
- `tsconfig.app.json` - Config da aplicação
- `tsconfig.node.json` - Config do Vite

---

## 🔧 Configuração Axios

```typescript
// config/axiosConfig.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
});

// Interceptor para adicionar token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Lógica de refresh token
  }
);
```

---

## 📚 Documentação Adicional

Consulte a pasta `docs/` para documentação detalhada:

- 📄 [Arquitetura](docs/ARQUITETURA.md)
- 📄 [Componentes](docs/COMPONENTES.md)
- 📄 [Serviços e APIs](docs/SERVICOS.md)
- 📄 [Guia de Estilo](docs/GUIA_ESTILO.md)
- 📄 [Fluxos de Usuário](docs/FLUXOS.md)

---

## ✅ Status do Projeto

### Funcionalidades Implementadas

- [x] Autenticação JWT completa
- [x] Proteção de rotas
- [x] Cadastro de usuários
- [x] Listagem de usuários paginada
- [x] Gerenciamento de batalhões
- [x] Gerenciamento de patentes
- [x] Registro de ocorrências
- [x] Listagem de ocorrências
- [x] Detalhes de ocorrências
- [x] Conclusão de ocorrências
- [x] Dashboard básico
- [x] PWA configurado
- [x] Refresh token automático

### Em Desenvolvimento

- [ ] Dashboard completo com gráficos
- [ ] Relatórios avançados
- [ ] Tipos de ocorrências funcional
- [ ] Upload de imagens
- [ ] Notificações push
- [ ] Geolocalização em tempo real
- [ ] Chat/comunicação interna

---

## 🐛 Troubleshooting

### Porta 5173 em uso

```bash
# Matar processo
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -t -i:5173 | xargs kill -9
```

### Backend não conecta

Verifique:
1. Backend está rodando na porta 8080
2. `.env` tem URL correta
3. CORS habilitado no backend

### Build falha

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 👥 Equipe

Projeto desenvolvido pelos alunos da **Faculdade Senac** em parceria com o **Corpo de Bombeiros de Pernambuco**.

---

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos em parceria institucional.

---

## 📞 Suporte

Para questões técnicas ou dúvidas:
- Consulte a documentação na pasta `docs/`
- Entre em contato com a equipe de desenvolvimento
- Revise o README do backend

---

**Desenvolvido com ❤️ para o Corpo de Bombeiros de Pernambuco**
