# 📡 Serviços e Integração com API

## Visão Geral

Documentação completa dos serviços de comunicação com o backend REST API.

---

## Configuração Base

### Axios Instance

```typescript
// config/axiosConfig.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL; // http://localhost:8080/api

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
```

---

## 🔐 Auth Service

### authService.ts

Serviço responsável por autenticação e gerenciamento de usuários.

#### Login

```typescript
export async function loginService(data: LoginRequest): Promise<LoginResponse> {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email: data.email,
    password: data.password,
  });
  return response.data;
}
```

**Request:**
```json
{
  "email": "bombeiro@email.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "refreshToken": "uuid...",
  "expiresRefreshToken": 1234567890,
  "id": 1
}
```

---

#### Get User Info

```typescript
export async function getUserInfo(): Promise<UserInfoDTO> {
  const token = localStorage.getItem('accessToken');
  const id = localStorage.getItem('id');
  
  const response = await axios.get(`${API_URL}/auth/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
}
```

**Response:**
```json
{
  "id": 1,
  "username": "bombeiro01",
  "email": "bombeiro@email.com",
  "name": "João Silva",
  "cpf": "12345678901",
  "battalion": {
    "id": 1,
    "name": "1º Batalhão"
  },
  "patent": {
    "id": 1,
    "name": "Soldado"
  }
}
```

---

#### Refresh Token

```typescript
export async function refreshTokenService(
  refreshToken: string, 
  username: string
): Promise<string> {
  const response = await axios.post(`${API_URL}/auth/refresh-token/`, {
    refreshToken,
    username,
  });
  return response.data.token;
}
```

---

#### Logout

```typescript
export async function logoutService(): Promise<number> {
  const token = localStorage.getItem('accessToken');
  const id = localStorage.getItem('id');
  
  const response = await axios.post(
    `${API_URL}/auth/logout/${id}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return response.status;
}
```

---

#### Get Users Paginated

```typescript
export async function getUsersPaginated(
  page: number = 1,
  size: number = 10,
  filterGeneric?: string,
  active: boolean = true
) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    active: active.toString(),
  });

  if (filterGeneric) {
    params.append('filterGeneric', filterGeneric);
  }

  const response = await axios.get(
    `${API_URL}/auth/paginator?${params.toString()}`
  );
  
  return response.data;
}
```

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "username": "bombeiro01",
      "email": "bombeiro@email.com",
      "name": "João Silva"
    }
  ],
  "totalItems": 50,
  "totalPages": 5,
  "currentPage": 1,
  "itemsPerPage": 10
}
```

---

#### Deactivate/Activate User

```typescript
export async function deactivateUser(id: number): Promise<string> {
  const response = await axios.put(`${API_URL}/auth/deactivate/${id}`);
  return response.data;
}

export async function activateUser(id: number): Promise<string> {
  const response = await axios.put(`${API_URL}/auth/activate/${id}`);
  return response.data;
}
```

---

## 🔥 Occurrence Service

### occurrenceService.ts

Serviço para gerenciamento de ocorrências.

#### Create Occurrence

```typescript
export async function createOccurrence(data: OccurrenceRequest) {
  const response = await axios.post(`${API_URL}/occurrences`, data);
  return response.data;
}
```

**Request:**
```json
{
  "occurrenceHasVictims": true,
  "occurrenceRequester": "Maria Santos",
  "occurrenceRequesterPhoneNumber": "81988887777",
  "occurrenceSubType": "Incêndio residencial",
  "address": {
    "street": "Rua das Flores",
    "number": 456,
    "neighborhood": "Jardim",
    "city": "Recife",
    "state": "PE",
    "zipCode": "50000000"
  }
}
```

---

#### Get Occurrence By ID

```typescript
export async function getOccurrenceById(id: number) {
  const response = await axios.get(`${API_URL}/occurrences/${id}`);
  return response.data;
}
```

---

#### Get Occurrences Paginated

```typescript
export async function getOccurrencesPaginated(
  page: number = 1,
  size: number = 10,
  filterGeneric?: string,
  active: boolean = true
) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    active: active.toString(),
  });

  if (filterGeneric) {
    params.append('filterGeneric', filterGeneric);
  }

  const response = await axios.get(
    `${API_URL}/occurrences/paginator?${params.toString()}`
  );
  
  return response.data;
}
```

---

#### Complete Occurrence

```typescript
export async function completeOccurrence(id: number, data: CompleteOccurrenceDTO) {
  const response = await axios.put(
    `${API_URL}/occurrences/complete/${id}`,
    data
  );
  return response.data;
}
```

**Request:**
```json
{
  "occurrenceDetails": "Incêndio controlado após 2 horas",
  "latitude": -8.0476,
  "longitude": -34.8770,
  "occurrenceArrivalTime": "2025-10-29T15:30:00",
  "usersId": [1, 5, 8, 12]
}
```

---

#### Update Occurrence

```typescript
export async function updateOccurrence(id: number, data: Partial<OccurrenceRequest>) {
  const response = await axios.put(`${API_URL}/occurrences/${id}`, data);
  return response.data;
}
```

---

#### Deactivate/Activate Occurrence

```typescript
export async function deactivateOccurrence(id: number) {
  const response = await axios.put(`${API_URL}/occurrences/deactivate/${id}`);
  return response.data;
}

export async function activateOccurrence(id: number) {
  const response = await axios.put(`${API_URL}/occurrences/activate/${id}`);
  return response.data;
}
```

---

## 🚒 Battalion Service

### battalionService.ts

Serviço para gerenciamento de batalhões.

#### Create Battalion

```typescript
export async function createBattalion(data: BattalionRequest) {
  const response = await axios.post(`${API_URL}/battalion/created`, data);
  return response.data;
}
```

**Request:**
```json
{
  "name": "1º Batalhão de Incêndio",
  "phoneNumber": "81988887777",
  "email": "1gbm@bombeiros.pe.gov.br",
  "address": {
    "street": "Av. Principal",
    "number": 100,
    "neighborhood": "Centro",
    "city": "Recife",
    "state": "PE",
    "zipCode": "50000000"
  }
}
```

---

#### Get Battalion By ID

```typescript
export async function getBattalionById(id: number) {
  const response = await axios.get(`${API_URL}/battalion/${id}`);
  return response.data;
}
```

---

#### Get Battalions Paginated

```typescript
export async function getBattalionsPaginated(
  page: number = 1,
  size: number = 10,
  name?: string,
  active: boolean = true
) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    active: active.toString(),
  });

  if (name) {
    params.append('name', name);
  }

  const response = await axios.get(
    `${API_URL}/battalion/paginator?${params.toString()}`
  );
  
  return response.data;
}
```

---

#### Update Battalion

```typescript
export async function updateBattalion(id: number, data: BattalionRequest) {
  const response = await axios.put(`${API_URL}/battalion/${id}`, data);
  return response.data;
}
```

---

#### Deactivate/Activate Battalion

```typescript
export async function deactivateBattalion(id: number) {
  const response = await axios.put(
    `${API_URL}/battalion/deactivate/${id}`,
    null,
    {
      params: { id }
    }
  );
  return response.data;
}

export async function activateBattalion(id: number) {
  const response = await axios.put(
    `${API_URL}/battalion/activate/${id}`,
    null,
    {
      params: { id }
    }
  );
  return response.data;
}
```

---

## 🎖️ Patent Service

### patentService.ts

Serviço para gerenciamento de patentes.

#### Create Patent

```typescript
export async function createPatent(data: { name: string }) {
  const response = await axios.post(`${API_URL}/patent/register/patent`, data);
  return response.data;
}
```

---

#### Get Patent By ID

```typescript
export async function getPatentById(id: number) {
  const response = await axios.get(`${API_URL}/patent/${id}`, {
    params: { id }
  });
  return response.data;
}
```

---

#### Get All Patents

```typescript
export async function getAllPatents() {
  const response = await axios.get(`${API_URL}/patent`);
  return response.data;
}
```

**Response:**
```json
{
  "patentResponseDTOList": [
    {
      "id": 1,
      "name": "Soldado"
    },
    {
      "id": 2,
      "name": "Cabo"
    }
  ]
}
```

---

#### Get Patents Paginated

```typescript
export async function getPatentsPaginated(
  page: number = 1,
  size: number = 10,
  filterGeneric?: string,
  active: boolean = true
) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    active: active.toString(),
  });

  if (filterGeneric) {
    params.append('filterGeneric', filterGeneric);
  }

  const response = await axios.get(
    `${API_URL}/patent/paginator?${params.toString()}`
  );
  
  return response.data;
}
```

---

#### Update Patent

```typescript
export async function updatePatent(id: number, data: { name: string }) {
  const response = await axios.put(
    `${API_URL}/patent/${id}`,
    data,
    {
      params: { id }
    }
  );
  return response.data;
}
```

---

## 👤 User Service

### userService.ts

Serviço adicional para operações de usuário.

#### Create User

```typescript
export async function createUser(data: CreateUserRequest) {
  const response = await axios.post(`${API_URL}/auth/created/user`, data);
  return response.data;
}
```

**Request:**
```json
{
  "username": "bombeiro01",
  "email": "bombeiro@email.com",
  "phoneNumber": "81999999999",
  "cpf": "12345678901",
  "matriculates": "BM001",
  "name": "João Silva",
  "dateBirth": "1990-01-01T00:00:00Z",
  "gender": "M",
  "password": "senha123",
  "patentId": 1,
  "battalionId": 1,
  "address": {
    "street": "Rua Exemplo",
    "number": 123,
    "neighborhood": "Bairro",
    "city": "Recife",
    "state": "PE",
    "zipCode": "50000000"
  }
}
```

---

#### Get User By ID

```typescript
export async function getUserById(id: number) {
  const response = await axios.get(`${API_URL}/auth/${id}`);
  return response.data;
}
```

---

## Interceptors

### Request Interceptor

Adiciona token automaticamente:

```typescript
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

---

### Response Interceptor

Trata erros e refresh token:

```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const username = localStorage.getItem('username');
        
        const newToken = await refreshTokenService(refreshToken, username);
        localStorage.setItem('accessToken', newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Redireciona para login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## Tratamento de Erros

### Padrão de Tratamento

```typescript
try {
  const data = await someService();
  // Sucesso
  showNotification({
    title: 'Sucesso',
    message: 'Operação concluída',
    color: 'green'
  });
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || 'Erro ao processar';
    
    showNotification({
      title: 'Erro',
      message,
      color: 'red'
    });
  }
}
```

---

## Tipos TypeScript

### Interfaces Principais

```typescript
// Login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  expiresRefreshToken: number;
  id: number;
}

// User
interface User {
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
  active: boolean;
}

// Occurrence
interface Occurrence {
  id: number;
  occurrenceHasVictims: boolean;
  occurrenceRequester: string;
  occurrenceRequesterPhoneNumber: string;
  occurrenceSubType: string;
  address: Address;
  status: OccurrenceStatus;
  occurrenceDetails?: string;
  latitude?: number;
  longitude?: number;
  occurrenceArrivalTime?: string;
  active: boolean;
}

// Battalion
interface Battalion {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  endereco?: Address;
  active: boolean;
}

// Patent
interface Patent {
  id: number;
  name: string;
  active: boolean;
}

// Address
interface Address {
  street: string;
  number: number;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

// Paginator
interface PaginatorResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}
```

---

## Boas Práticas

### 1. Sempre usar try-catch

```typescript
async function handleSubmit() {
  try {
    await createOccurrence(formData);
    navigate('/Ocorrencia');
  } catch (error) {
    handleError(error);
  }
}
```

---

### 2. Validar dados antes de enviar

```typescript
if (!formData.requester || !formData.phoneNumber) {
  showNotification({
    title: 'Erro',
    message: 'Preencha todos os campos obrigatórios',
    color: 'red'
  });
  return;
}
```

---

### 3. Loading states

```typescript
const [loading, setLoading] = useState(false);

async function loadData() {
  setLoading(true);
  try {
    const data = await getOccurrencesPaginated();
    setOccurrences(data.items);
  } finally {
    setLoading(false);
  }
}
```

---

### 4. Cancelar requisições

```typescript
useEffect(() => {
  const controller = new AbortController();
  
  fetchData({ signal: controller.signal });
  
  return () => {
    controller.abort();
  };
}, []);
```

---

## Conclusão

Os serviços estão organizados para:

✅ **Separação de responsabilidades**  
✅ **Reutilização de código**  
✅ **Tipagem forte com TypeScript**  
✅ **Tratamento consistente de erros**  
✅ **Interceptors para auth automática**  
✅ **Fácil manutenção e testes**
