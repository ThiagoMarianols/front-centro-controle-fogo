import axios from '../config/axiosConfig';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface AddressDTO {
  street: string;
  number: number;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UserRegisterDTO {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  cpf: string;
  matriculates: string;
  name: string;
  dateBirth: string; // ISO format
  gender: string; // 'M' or 'F'
  battalion: number;
  address: AddressDTO;
  patent: number;
}

export interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  name: string;
  cpf: string;
  matriculates: string;
  phoneNumber: string;
  active: boolean;
}

export interface PaginatorResponse<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: T[];
}

export const registerUser = async (userData: UserRegisterDTO): Promise<any> => {
  const response = await axios.post(`${BASE_URL}/auth/created/user`, userData);
  return response.data;
};

export const getUsersPaginated = async (
  page: number = 1,
  size: number = 10,
  filterGeneric?: string,
  active: boolean = true
): Promise<PaginatorResponse<UserResponseDTO>> => {
  const params: any = {
    page,
    size,
    active
  };
  
  if (filterGeneric) {
    params.filterGeneric = filterGeneric;
  }

  const response = await axios.get(`${BASE_URL}/auth/paginator`, { params });
  return response.data;
};

export const deactivateUser = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/auth/deactivate/${id}`);
};

export const activateUser = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/auth/activate/${id}`);
};

export const getUserById = async (id: number): Promise<UserResponseDTO> => {
  const response = await axios.get(`${BASE_URL}/auth/${id}`);
  return response.data;
};
