import axios from '../config/axiosConfig';
import type { BattalionDTO, PaginatorResponse } from '../interfaces/IBattalion';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getBattalionsPaginated = async (
  page: number = 1,
  size: number = 10,
  name?: string,
  active: boolean = true
): Promise<PaginatorResponse<BattalionDTO>> => {
  const params: any = {
    page,
    size,
    active
  };
  
  if (name) {
    params.name = name;
  }

  const response = await axios.get(`${BASE_URL}/battalion/paginator`, { params });
  return response.data;
};

export const deactivateBattalion = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/battalion/deactivate/${id}`, null, {
    params: { id }
  });
};

export const activateBattalion = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/battalion/activate/${id}`, null, {
    params: { id }
  });
};
