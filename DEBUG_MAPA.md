# Debug - Ocorrências não aparecem no mapa

## Verificações para fazer:

### 1. Abra o Console do Navegador (F12)
Procure pelas seguintes mensagens de log:

- `Buscando ocorrências do mapa em: [URL]` - Verifica a URL completa
- `Status da resposta: [número]` - Deve ser 200 se OK
- `Dados recebidos da API: [array]` - Mostra os dados retornados
- `Dados recebidos do mapa: [array]` - Confirma que chegou no componente
- `Total de ocorrências: [número]` - Quantidade de ocorrências
- `OccurrencesMapContent - Total de ocorrências: [número]` - Confirma renderização

### 2. Possíveis Problemas:

#### A) API retorna array vazio
- Verifique se há ocorrências cadastradas no banco de dados
- Confirme que o endpoint `/api/occurrences/infomap` está funcionando
- Teste diretamente no Postman/Insomnia

#### B) Erro 401/403 (Não autorizado)
- Token de autenticação pode estar expirado
- Faça logout e login novamente

#### C) Erro 404 (Endpoint não encontrado)
- O endpoint pode ter nome diferente
- Verifique a documentação da API
- Tente: `/api/occurrences/map` ou `/api/occurrences/map-info`

#### D) Erro de CORS
- Verifique se o backend permite requisições do frontend
- Pode precisar configurar CORS no servidor

#### E) Dados com formato diferente
- A API pode retornar os dados em formato diferente do esperado
- Verifique se os campos `latitude`, `longitude`, `natureName` existem

### 3. Testes Manuais:

#### Teste 1: Verificar URL da API
No console do navegador, digite:
```javascript
console.log(import.meta.env.VITE_BASE_URL)
```

#### Teste 2: Testar endpoint diretamente
```javascript
fetch('SUA_URL_BASE/occurrences/infomap', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Dados:', data))
.catch(err => console.error('Erro:', err))
```

### 4. Soluções Alternativas:

Se o endpoint for diferente, edite o arquivo:
`src/services/occurrenceService.ts`

Linha 247, altere de:
```typescript
const url = `${API_URL}/infomap`;
```

Para uma das opções:
```typescript
const url = `${API_URL}/map`;
// ou
const url = `${API_URL}/map-info`;
// ou
const url = `${API_URL}/mapinfo`;
```

### 5. Verificar Estrutura dos Dados

Se a API retornar dados mas não aparecerem no mapa, verifique se os campos estão corretos.

Estrutura esperada:
```json
[
  {
    "id": 6,
    "typeId": 42,
    "typeName": "Evento com Pessoa",
    "subtypeId": 407,
    "subtypeName": "Preso em Altura",
    "natureId": 3,
    "natureName": "SALVAMENTO",
    "statusId": 2,
    "statusName": "EM ATENDIMENTO",
    "description": "Resgate de trabalhador em andaime",
    "latitude": -23.623456,
    "longitude": -46.689234,
    "date": "2025-11-21T00:59:37.712879Z"
  }
]
```

### 6. Próximos Passos

Após verificar os logs no console, me informe:
1. Qual é a URL completa sendo chamada?
2. Qual é o status da resposta (200, 404, 401, etc)?
3. Quantas ocorrências foram retornadas?
4. Há alguma mensagem de erro?

Com essas informações, poderei ajustar o código corretamente.
