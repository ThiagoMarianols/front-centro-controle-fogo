# ⚡ Quick Start Guide - Frontend

Guia rápido para começar a usar o Frontend Central Controle de Fogo em **5 minutos**.

---

## 🚀 Início Rápido (5 minutos)

### 1. Pré-requisitos

```bash
# Verificar Node.js (18+)
node -v

# Verificar npm
npm -v
```

---

### 2. Clonar e Instalar

```bash
# Clonar repositório
git clone <repository-url>
cd front-centro-controle-fogo

# Instalar dependências
npm install
```

---

### 3. Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env
echo "VITE_BASE_URL=http://localhost:8080/api" > .env
```

**Arquivo `.env`:**
```env
VITE_BASE_URL=http://localhost:8080/api
```

---

### 4. Verificar Backend

Certifique-se que o backend está rodando:
```
http://localhost:8080/api
```

---

### 5. Executar

```bash
# Modo desenvolvimento
npm run dev
```

**Aguardar mensagem:**
```
VITE v7.1.7  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### 6. Acessar

Abra o navegador:
```
http://localhost:5173
```

---

## 🔐 Primeiro Login

### Credenciais Padrão

Se já criou usuários no backend:

```
Email: bombeiro@email.com
Senha: senha123
```

---

## 📝 Comandos Úteis

### Desenvolvimento

```bash
# Executar dev server
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

---

### Portas

- **Frontend Dev:** http://localhost:5173
- **Backend API:** http://localhost:8080

---

## 📱 Principais Páginas

### Após Login

| Rota | Descrição |
|------|-----------|
| `/` | Home/Dashboard |
| `/Ocorrencia` | Lista de ocorrências |
| `/RegistroOcorrencia` | Criar ocorrência |
| `/administracao/Users` | Gerenciar usuários |
| `/administracao/Batalhao` | Gerenciar batalhões |
| `/dashboard` | Analytics |

---

## 🔧 Estrutura Rápida

```
src/
├── pages/              # Páginas (rotas)
├── components/         # Componentes reutilizáveis
├── services/           # Comunicação com API
├── context/            # Estado global
├── interfaces/         # TypeScript types
└── styles/             # Estilos globais
```

---

## 🧪 Testar Funcionalidades

### 1. Criar Ocorrência

1. Login
2. Menu: "Registro de Ocorrência"
3. Preencher formulário
4. Clicar "Registrar"

### 2. Listar Ocorrências

1. Menu: "Ocorrências"
2. Ver tabela paginada
3. Clicar em ocorrência para detalhes

### 3. Gerenciar Usuários (Admin)

1. Menu: "Administração" > "Usuários"
2. Ver lista
3. Criar novo: "Cadastro de Usuário"

---

## 🐛 Troubleshooting Rápido

### Porta 5173 em uso

```bash
# Matar processo
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac:
lsof -t -i:5173 | xargs kill -9
```

---

### Backend não conecta

```bash
# Verificar .env
cat .env

# Deve mostrar:
VITE_BASE_URL=http://localhost:8080/api

# Testar backend
curl http://localhost:8080/api/swagger-ui/index.html
```

---

### Dependências não instalam

```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

### Build falha

```bash
# Verificar TypeScript
npm run lint

# Build
npm run build
```

---

## 📚 Próximos Passos

### Documentação Completa

- [README Principal](docs/README_DOCUMENTACAO.md)
- [Arquitetura](docs/ARQUITETURA_FRONTEND.md)
- [Serviços e APIs](docs/SERVICOS_API.md)
- [Fluxos de Usuário](docs/FLUXOS_USUARIO.md)

---

### Explorar Tecnologias

#### Mantine UI
```
https://mantine.dev/
```

#### React Router
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/Ocorrencia');
```

#### Context API
```typescript
import { useAuth } from './context/authContext';

const { user, logout } = useAuth();
```

---

## ✅ Checklist de Sucesso

- [ ] Node.js 18+ instalado
- [ ] npm funcionando
- [ ] Repositório clonado
- [ ] Dependências instaladas
- [ ] Arquivo `.env` criado
- [ ] Backend rodando (porta 8080)
- [ ] Frontend rodando (porta 5173)
- [ ] Login bem-sucedido
- [ ] Primeira ocorrência criada

---

## 🎉 Parabéns!

Se chegou até aqui, seu ambiente está configurado!

**Próximos passos:**
1. Explore o código em `src/`
2. Leia a documentação técnica
3. Crie componentes novos
4. Teste diferentes fluxos
5. Contribua com o projeto

---

## 📞 Precisa de Ajuda?

### Documentação
- Consulte pasta `docs/`
- Leia README principal
- Verifique Swagger do backend

### Backend
- Verifique se está rodando
- Teste endpoints no Swagger
- Veja logs do console

### Frontend
- Verifique console do navegador (F12)
- Veja mensagens de erro
- Teste em modo incognito

---

## 🛠️ Dicas de Desenvolvimento

### Hot Reload

Vite detecta mudanças automaticamente:
```typescript
// Edite qualquer arquivo .tsx
// Salve (Ctrl+S)
// Navegador atualiza automaticamente
```

---

### DevTools

Extensões recomendadas:
- **React Developer Tools**
- **Redux DevTools** (futuro)
- **Axios DevTools**

---

### VS Code

Extensões úteis:
- ES7+ React/Redux/React-Native snippets
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier

---

## 📊 Estatísticas do Projeto

- **Componentes:** 20+
- **Páginas:** 15
- **Serviços:** 5
- **Rotas:** 13
- **Dependencies:** 40+

---

## 🎓 Recursos de Aprendizado

### React
```
https://react.dev/
```

### TypeScript
```
https://www.typescriptlang.org/docs/
```

### Vite
```
https://vite.dev/guide/
```

### Mantine
```
https://mantine.dev/getting-started/
```

---

**Desenvolvido com ❤️ pela Faculdade Senac + Corpo de Bombeiros PE**
