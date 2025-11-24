import axios from '../config/axiosConfig';
import type { RoleDTO } from '../interfaces/IRole';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllRoles = async (): Promise<RoleDTO[]> => {
  const response = await axios.get<RoleDTO[]>(`${BASE_URL}/roles/all`);
  return response.data;
};
