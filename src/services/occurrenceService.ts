import type { IOccurrenceRequest, IOccurrenceOnSiteRequest, IPaginatedResponse, IOccurrenceDTO, IUpdateOccurrenceRequest } from '../interfaces/IOccurrence';

const API_URL = `${import.meta.env.VITE_BASE_URL}/occurrences`;

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('Você precisa estar logado para realizar esta ação');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function getOccurrencesPaginated(
  page: number = 1,
  size: number = 10,
  filterGeneric?: string,
  active: boolean = true
): Promise<{ items: IOccurrenceDTO[]; total: number }> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    active: active.toString(),
  });

  if (filterGeneric) {
    params.append('filterGeneric', filterGeneric);
  }

  const response = await fetch(`${API_URL}/paginator?${params}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar ocorrências');
  }

  const data: IPaginatedResponse = await response.json();
  return {
    items: data.items,
    total: data.totalItems,
  };
}

export async function deactivateOccurrence(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/deactivate/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Erro ao desativar ocorrência');
  }
}

export async function activateOccurrence(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/activate/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Erro ao ativar ocorrência');
  }
}

const getOccurrenceById = async (id: number): Promise<IOccurrenceDTO> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Erro ao buscar ocorrência');
  }

  return await response.json();
};

const updateOccurrence = async (id: number, data: IUpdateOccurrenceRequest): Promise<void> => {
  const headers = {
    ...getAuthHeaders(),
    'Content-Type': 'application/json'
  };

  console.log('Enviando requisição para:', `${API_URL}/${id}`);
  console.log('Headers:', headers);
  console.log('Payload:', JSON.stringify(data));

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Erro ao atualizar ocorrência';
    try {
      const errorData = await response.text();
      console.error('Erro na resposta:', response.status, response.statusText);
      console.error('Detalhes do erro:', errorData);
      errorMessage = errorData || errorMessage;
    } catch (e) {
      console.error('Erro ao processar resposta de erro:', e);
    }
    throw new Error(errorMessage);
  }

  try {
    // Tenta fazer o parse apenas se houver conteúdo na resposta
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : undefined;
  } catch (e) {
    // Se não for possível fazer o parse, apenas retorna
    return undefined;
  }
};

export const occurrenceService = {
  async create(data: IOccurrenceRequest): Promise<string> {
    try {
      const rawHeaders = getAuthHeaders() as Record<string, string>;
      const maskedHeaders = {
        ...rawHeaders,
        Authorization: rawHeaders?.['Authorization']
          ? `Bearer ${rawHeaders['Authorization'].slice(7, 11)}***`
          : undefined,
      };

      console.log('Criar ocorrência - URL:', API_URL);
      console.log('Criar ocorrência - Headers:', maskedHeaders);
      console.log('Criar ocorrência - Payload:', JSON.stringify(data));

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: rawHeaders,
        body: JSON.stringify(data),
      });

      console.log('Criar ocorrência - Status:', response.status, response.statusText);
      try {
        const preview = await response.clone().text();
        console.log('Criar ocorrência - Corpo resposta (preview):', preview);
      } catch (e) {
        console.log('Criar ocorrência - Falha ao ler corpo de resposta para preview:', e);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Criar ocorrência - Erro:', errorText);
        throw new Error(errorText || 'Erro ao criar ocorrência');
      }

      return await response.text();
    } catch (err) {
      console.error('Criar ocorrência - Falha na requisição:', err);
      throw err instanceof Error ? err : new Error('Erro desconhecido ao criar ocorrência');
    }
  },

  async complete(data: any): Promise<string> {
    const response = await fetch(`${API_URL}/complement`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao completar ocorrência');
    }

    return await response.text();
  },
  
  getById: getOccurrenceById,
  update: updateOccurrence,
  activate: activateOccurrence,
  deactivate: deactivateOccurrence,
  getOccurrencesPaginated: getOccurrencesPaginated,
};
