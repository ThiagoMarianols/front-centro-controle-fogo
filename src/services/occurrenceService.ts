import type { IOccurrenceRequest, IOccurrenceOnSiteRequest, IPaginatedResponse, IOccurrenceDTO } from '../interfaces/IOccurrence';

const API_URL = 'http://localhost:8088/api/occurrences';

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
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Erro ao desativar ocorrência');
  }
}

export async function activateOccurrence(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/activate/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Erro ao ativar ocorrência');
  }
}

export async function getOccurrenceById(id: number): Promise<IOccurrenceDTO> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Erro ao buscar ocorrência');
  }

  return await response.json();
}

export const occurrenceService = {
  async create(data: IOccurrenceRequest): Promise<string> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao criar ocorrência');
    }

    return await response.text();
  },

  async complete(id: number, data: IOccurrenceOnSiteRequest): Promise<string> {
    const response = await fetch(`${API_URL}/complete/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao completar ocorrência');
    }

    return await response.text();
  },
};
