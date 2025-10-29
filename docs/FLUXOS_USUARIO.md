# 🔄 Fluxos de Usuário

## Visão Geral

Documentação dos principais fluxos de interação do usuário com o sistema.

---

## 1. Fluxo de Login

### Sequência

```
┌─────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│ Usuário │         │  Login   │         │   Auth   │         │ Backend  │
│         │         │   Page   │         │  Context │         │   API    │
└────┬────┘         └─────┬────┘         └─────┬────┘         └─────┬────┘
     │                    │                    │                    │
     │ 1. Acessa /login   │                    │                    │
     ├───────────────────►│                    │                    │
     │                    │                    │                    │
     │ 2. Preenche form   │                    │                    │
     │    email + senha   │                    │                    │
     ├───────────────────►│                    │                    │
     │                    │                    │                    │
     │ 3. Clica "Entrar"  │                    │                    │
     ├───────────────────►│                    │                    │
     │                    │                    │                    │
     │                    │ 4. login(email,pwd)│                    │
     │                    ├───────────────────►│                    │
     │                    │                    │                    │
     │                    │                    │ 5. POST /auth/login│
     │                    │                    ├───────────────────►│
     │                    │                    │                    │
     │                    │                    │ 6. Valida          │
     │                    │                    │    credentials     │
     │                    │                    │                    │
     │                    │                    │◄───────────────────┤
     │                    │                    │ 7. Returns tokens  │
     │                    │◄───────────────────┤                    │
     │                    │ 8. Success         │                    │
     │                    │                    │                    │
     │                    │ 9. Save tokens     │                    │
     │                    │    localStorage    │                    │
     │                    │                    │                    │
     │                    │ 10. Fetch user info│                    │
     │                    │                    ├───────────────────►│
     │                    │                    │◄───────────────────┤
     │                    │                    │                    │
     │◄───────────────────┤ 11. Navigate("/")  │                    │
     │ Redireciona Home   │                    │                    │
     │                    │                    │                    │
```

### Código

```typescript
// Login.tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const success = await login(email, password);
    
    if (success) {
      notifications.show({
        title: 'Sucesso',
        message: 'Login realizado com sucesso',
        color: 'green'
      });
      navigate('/');
    }
  } catch (error) {
    notifications.show({
      title: 'Erro',
      message: 'Credenciais inválidas',
      color: 'red'
    });
  } finally {
    setLoading(false);
  }
};
```

---

## 2. Fluxo de Registro de Ocorrência

### Parte 1: Dados Básicos

```
┌─────────┐         ┌──────────────┐         ┌──────────────┐         ┌──────────┐
│Bombeiro │         │   Registro   │         │  Occurrence  │         │ Backend  │
│         │         │  Ocorrencia  │         │   Service    │         │   API    │
└────┬────┘         └──────┬───────┘         └──────┬───────┘         └─────┬────┘
     │                     │                        │                       │
     │ 1. Acessa rota      │                        │                       │
     │    /RegistroOcorrencia                       │                       │
     ├────────────────────►│                        │                       │
     │                     │                        │                       │
     │ 2. Preenche form    │                        │                       │
     │    - Nome solicitante                        │                       │
     │    - Telefone       │                        │                       │
     │    - Tem vítimas?   │                        │                       │
     │    - Tipo ocorrência│                        │                       │
     │    - Endereço       │                        │                       │
     ├────────────────────►│                        │                       │
     │                     │                        │                       │
     │ 3. Clica "Registrar"│                        │                       │
     ├────────────────────►│                        │                       │
     │                     │ 4. Valida form         │                       │
     │                     │                        │                       │
     │                     │ 5. createOccurrence()  │                       │
     │                     ├───────────────────────►│                       │
     │                     │                        │                       │
     │                     │                        │ 6. POST /occurrences  │
     │                     │                        ├──────────────────────►│
     │                     │                        │                       │
     │                     │                        │ 7. Cria occurrence    │
     │                     │                        │    Status: EM_ATENDIMENTO
     │                     │                        │                       │
     │                     │                        │◄──────────────────────┤
     │                     │◄───────────────────────┤ 8. Returns ID         │
     │◄────────────────────┤ 9. Notificação sucesso │                       │
     │ Redireciona /Ocorrencia                      │                       │
     │                     │                        │                       │
```

### Parte 2: Conclusão da Ocorrência

```
┌─────────┐         ┌──────────────┐         ┌──────────────┐         ┌──────────┐
│Bombeiro │         │  Completar   │         │  Occurrence  │         │ Backend  │
│         │         │  Ocorrencia  │         │   Service    │         │   API    │
└────┬────┘         └──────┬───────┘         └──────┬───────┘         └─────┬────┘
     │                     │                        │                       │
     │ 1. Após atendimento │                        │                       │
     │    acessa rota      │                        │                       │
     │    /CompletarOcorrencia                      │                       │
     ├────────────────────►│                        │                       │
     │                     │                        │                       │
     │ 2. Preenche dados   │                        │                       │
     │    - Detalhes       │                        │                       │
     │    - Lat/Long       │                        │                       │
     │    - Hora chegada   │                        │                       │
     │    - Bombeiros      │                        │                       │
     ├────────────────────►│                        │                       │
     │                     │                        │                       │
     │ 3. Clica "Finalizar"│                        │                       │
     ├────────────────────►│                        │                       │
     │                     │                        │                       │
     │                     │ 4. completeOccurrence()│                       │
     │                     ├───────────────────────►│                       │
     │                     │                        │                       │
     │                     │                        │ 5. PUT /complete/{id} │
     │                     │                        ├──────────────────────►│
     │                     │                        │                       │
     │                     │                        │ 6. Atualiza           │
     │                     │                        │    Status: CONCLUIDA  │
     │                     │                        │    + dados finais     │
     │                     │                        │                       │
     │                     │                        │◄──────────────────────┤
     │                     │◄───────────────────────┤ 7. Success            │
     │◄────────────────────┤ 8. Notificação         │                       │
     │ Redireciona /Ocorrencia                      │                       │
     │                     │                        │                       │
```

### Código

```typescript
// RegistroOcorrencia.tsx
const handleSubmit = async (values: OccurrenceFormValues) => {
  try {
    await createOccurrence({
      occurrenceHasVictims: values.hasVictims,
      occurrenceRequester: values.requester,
      occurrenceRequesterPhoneNumber: values.phoneNumber,
      occurrenceSubType: values.subType,
      address: values.address
    });
    
    notifications.show({
      title: 'Sucesso',
      message: 'Ocorrência registrada',
      color: 'green'
    });
    
    navigate('/Ocorrencia');
  } catch (error) {
    notifications.show({
      title: 'Erro',
      message: 'Falha ao registrar ocorrência',
      color: 'red'
    });
  }
};
```

---

## 3. Fluxo de Cadastro de Usuário

```
┌─────────┐         ┌──────────────┐         ┌──────────────┐         ┌──────────┐
│  Admin  │         │   Cadastro   │         │     User     │         │ Backend  │
│         │         │   Usuario    │         │   Service    │         │   API    │
└────┬────┘         └──────┬───────┘         └──────┬───────┘         └─────┬────┘
     │                     │                        │                       │
     │ 1. Acessa           │                        │                       │
     │    /administracao/CadastroUsuario            │                       │
     ├────────────────────►│                        │                       │
     │                     │                        │                       │
     │ 2. Preenche form    │                        │                       │
     │    - Dados pessoais │                        │                       │
     │    - Username/Email │                        │                       │
     │    - CPF/Matrícula  │                        │                       │
     │    - Patente        │                        │                       │
     │    - Batalhão       │                        │                       │
     │    - Endereço       │                        │                       │
     │    - Senha          │                        │                       │
     ├────────────────────►│                        │                       │
     │                     │                        │                       │
     │ 3. Clica "Cadastrar"│                        │                       │
     ├────────────────────►│                        │                       │
     │                     │ 4. Valida campos       │                       │
     │                     │                        │                       │
     │                     │ 5. createUser()        │                       │
     │                     ├───────────────────────►│                       │
     │                     │                        │                       │
     │                     │                        │ 6. POST /auth/created/user
     │                     │                        ├──────────────────────►│
     │                     │                        │                       │
     │                     │                        │ 7. Valida unique:     │
     │                     │                        │    CPF, email, username
     │                     │                        │                       │
     │                     │                        │ 8. Hash password      │
     │                     │                        │    (BCrypt)           │
     │                     │                        │                       │
     │                     │                        │ 9. Cria user          │
     │                     │                        │                       │
     │                     │                        │◄──────────────────────┤
     │                     │◄───────────────────────┤ 10. Success           │
     │◄────────────────────┤ 11. Notificação        │                       │
     │ Redireciona /administracao/Users             │                       │
     │                     │                        │                       │
```

---

## 4. Fluxo de Listagem com Paginação

```
┌─────────┐         ┌──────────────┐         ┌──────────────┐         ┌──────────┐
│Usuário  │         │  Ocorrencia  │         │  Occurrence  │         │ Backend  │
│         │         │     Page     │         │   Service    │         │   API    │
└────┬────┘         └──────┬───────┘         └──────┬───────┘         └─────┬────┘
     │                     │                        │                       │
     │ 1. Acessa /Ocorrencia                        │                       │
     ├────────────────────►│                        │                       │
     │                     │                        │                       │
     │                     │ 2. useEffect mounts    │                       │
     │                     │                        │                       │
     │                     │ 3. getOccurrencesPaginated()                   │
     │                     ├───────────────────────►│                       │
     │                     │    (page=1, size=10)   │                       │
     │                     │                        │                       │
     │                     │                        │ 4. GET /occurrences/  │
     │                     │                        │    paginator?page=1   │
     │                     │                        ├──────────────────────►│
     │                     │                        │                       │
     │                     │                        │ 5. Query DB           │
     │                     │                        │    LIMIT/OFFSET       │
     │                     │                        │                       │
     │                     │                        │◄──────────────────────┤
     │                     │◄───────────────────────┤ 6. Returns            │
     │◄────────────────────┤ 7. Renderiza tabela    │    {items, total,     │
     │ Exibe dados         │                        │     pages}            │
     │                     │                        │                       │
     │ 8. Clica próxima    │                        │                       │
     │    página           │                        │                       │
     ├────────────────────►│                        │                       │
     │                     │ 9. getOccurrencesPaginated()                   │
     │                     ├───────────────────────►│                       │
     │                     │    (page=2, size=10)   │                       │
     │                     │                        ├──────────────────────►│
     │                     │                        │◄──────────────────────┤
     │                     │◄───────────────────────┤                       │
     │◄────────────────────┤ Atualiza tabela        │                       │
     │                     │                        │                       │
```

### Código

```typescript
// Ocorrencia.tsx
const [occurrences, setOccurrences] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [loading, setLoading] = useState(false);

useEffect(() => {
  loadOccurrences();
}, [page]);

const loadOccurrences = async () => {
  setLoading(true);
  try {
    const data = await getOccurrencesPaginated(page, 10);
    setOccurrences(data.items);
    setTotalPages(data.totalPages);
  } catch (error) {
    notifications.show({
      title: 'Erro',
      message: 'Falha ao carregar ocorrências',
      color: 'red'
    });
  } finally {
    setLoading(false);
  }
};
```

---

## 5. Fluxo de Refresh Token Automático

```
┌─────────┐         ┌──────────────┐         ┌──────────────┐         ┌──────────┐
│Usuário  │         │   Axios      │         │     Auth     │         │ Backend  │
│         │         │ Interceptor  │         │   Context    │         │   API    │
└────┬────┘         └──────┬───────┘         └──────┬───────┘         └─────┬────┘
     │                     │                        │                       │
     │ 1. Faz requisição   │                        │                       │
     │    (token expirado) │                        │                       │
     ├────────────────────►│                        │                       │
     │                     │ 2. Request com token   │                       │
     │                     ├───────────────────────────────────────────────►│
     │                     │                        │                       │
     │                     │                        │ 3. Valida token       │
     │                     │                        │    Expirado!          │
     │                     │                        │                       │
     │                     │◄───────────────────────────────────────────────┤
     │                     │ 4. 401 Unauthorized    │                       │
     │                     │                        │                       │
     │                     │ 5. Detecta 401         │                       │
     │                     │    !_retry             │                       │
     │                     │                        │                       │
     │                     │ 6. refreshAccessToken()│                       │
     │                     ├───────────────────────►│                       │
     │                     │                        │                       │
     │                     │                        │ 7. POST /auth/        │
     │                     │                        │    refresh-token/     │
     │                     │                        ├──────────────────────►│
     │                     │                        │                       │
     │                     │                        │ 8. Valida refresh     │
     │                     │                        │    token              │
     │                     │                        │                       │
     │                     │                        │◄──────────────────────┤
     │                     │◄───────────────────────┤ 9. New access token   │
     │                     │ 10. Save new token     │                       │
     │                     │                        │                       │
     │                     │ 11. Retry original     │                       │
     │                     │     request with new   │                       │
     │                     │     token              │                       │
     │                     ├───────────────────────────────────────────────►│
     │                     │                        │                       │
     │                     │◄───────────────────────────────────────────────┤
     │◄────────────────────┤ 12. Success            │                       │
     │ Recebe dados        │                        │                       │
     │                     │                        │                       │
```

---

## 6. Fluxo de Busca/Filtro

```
┌─────────┐         ┌──────────────┐         ┌──────────────┐         ┌──────────┐
│Usuário  │         │  Users Page  │         │     Auth     │         │ Backend  │
│         │         │              │         │   Service    │         │   API    │
└────┬────┘         └──────┬───────┘         └──────┬───────┘         └─────┬────┘
     │                     │                        │                       │
     │ 1. Digita no campo  │                        │                       │
     │    de busca: "joão" │                        │                       │
     ├────────────────────►│                        │                       │
     │                     │ 2. Debounce 500ms      │                       │
     │                     │                        │                       │
     │                     │ 3. getUsersPaginated() │                       │
     │                     ├───────────────────────►│                       │
     │                     │    (filter="joão")     │                       │
     │                     │                        │                       │
     │                     │                        │ 4. GET /auth/         │
     │                     │                        │    paginator?         │
     │                     │                        │    filterGeneric=joão │
     │                     │                        ├──────────────────────►│
     │                     │                        │                       │
     │                     │                        │ 5. Query:             │
     │                     │                        │    WHERE name LIKE    │
     │                     │                        │    '%joão%'           │
     │                     │                        │                       │
     │                     │                        │◄──────────────────────┤
     │                     │◄───────────────────────┤ 6. Filtered results   │
     │◄────────────────────┤ 7. Atualiza tabela     │                       │
     │ Exibe resultados    │                        │                       │
     │ filtrados           │                        │                       │
     │                     │                        │                       │
```

### Código

```typescript
// Users.tsx
const [filter, setFilter] = useState('');
const [debouncedFilter] = useDebouncedValue(filter, 500);

useEffect(() => {
  loadUsers();
}, [page, debouncedFilter]);

const loadUsers = async () => {
  setLoading(true);
  try {
    const data = await getUsersPaginated(
      page,
      10,
      debouncedFilter,
      true
    );
    setUsers(data.items);
  } finally {
    setLoading(false);
  }
};
```

---

## 7. Fluxo de Logout

```
┌─────────┐         ┌──────────────┐         ┌──────────────┐         ┌──────────┐
│Usuário  │         │    NavBar    │         │     Auth     │         │ Backend  │
│         │         │              │         │   Context    │         │   API    │
└────┬────┘         └──────┬───────┘         └──────┬───────┘         └─────┬────┘
     │                     │                        │                       │
     │ 1. Clica "Sair"     │                        │                       │
     ├────────────────────►│                        │                       │
     │                     │ 2. logout()            │                       │
     │                     ├───────────────────────►│                       │
     │                     │                        │                       │
     │                     │                        │ 3. POST /auth/        │
     │                     │                        │    logout/{id}        │
     │                     │                        ├──────────────────────►│
     │                     │                        │                       │
     │                     │                        │ 4. Limpa refresh      │
     │                     │                        │    token do banco     │
     │                     │                        │                       │
     │                     │                        │◄──────────────────────┤
     │                     │◄───────────────────────┤ 5. Success            │
     │                     │ 6. Clear localStorage  │                       │
     │                     │    - accessToken       │                       │
     │                     │    - refreshToken      │                       │
     │                     │    - userId            │                       │
     │                     │                        │                       │
     │                     │ 7. Reset state         │                       │
     │                     │    - isAuthenticated=false                     │
     │                     │    - user=null         │                       │
     │                     │                        │                       │
     │◄────────────────────┤ 8. Navigate("/login")  │                       │
     │ Redireciona login   │                        │                       │
     │                     │                        │                       │
```

---

## 8. Fluxo PWA (Offline)

```
┌─────────┐         ┌──────────────┐         ┌──────────────┐         ┌──────────┐
│Usuário  │         │   Browser    │         │   Service    │         │  Cache   │
│         │         │              │         │   Worker     │         │          │
└────┬────┘         └──────┬───────┘         └──────┬───────┘         └─────┬────┘
     │                     │                        │                       │
     │ 1. Acessa app       │                        │                       │
     ├────────────────────►│                        │                       │
     │                     │ 2. Check SW            │                       │
     │                     ├───────────────────────►│                       │
     │                     │                        │                       │
     │                     │◄───────────────────────┤ 3. SW ativo           │
     │                     │                        │                       │
     │ 4. Faz requisição   │                        │                       │
     │    (offline)        │                        │                       │
     ├────────────────────►│                        │                       │
     │                     │ 5. Intercept request   │                       │
     │                     ├───────────────────────►│                       │
     │                     │                        │                       │
     │                     │                        │ 6. Check cache        │
     │                     │                        ├──────────────────────►│
     │                     │                        │                       │
     │                     │                        │◄──────────────────────┤
     │                     │◄───────────────────────┤ 7. Cached response    │
     │◄────────────────────┤ 8. Retorna dados       │                       │
     │ Exibe dados cached  │                        │                       │
     │                     │                        │                       │
```

---

## Conclusão

Os fluxos foram projetados para:

✅ **Experiência fluida** - Transições suaves  
✅ **Feedback visual** - Notificações e loading  
✅ **Tratamento de erros** - Mensagens claras  
✅ **Performance** - Otimizações e cache  
✅ **Segurança** - Tokens e validações  
✅ **Offline-first** - PWA com cache
