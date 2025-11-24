import axios from '../config/axiosConfig';
import type { VehicleDTO, VehicleRequest, VehicleSimple, PaginatorResponse } from '../interfaces/IVehicle';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getVehiclesPaginated = async (
  page: number = 1,
  size: number = 10,
  name?: string,
  active: boolean = true
): Promise<PaginatorResponse<VehicleDTO>> => {
  const params: any = {
    page,
    size,
    active
  };
  
  if (name) {
    params.name = name;
  }

  const response = await axios.get(`${BASE_URL}/vehicle/paginator`, { params });
  return response.data;
};

export const getAllVehicles = async (): Promise<VehicleSimple[]> => {
  const response = await axios.get(`${BASE_URL}/vehicle/all`);
  return response.data;
};

export const getVehicleById = async (id: number): Promise<VehicleDTO> => {
  const response = await axios.get(`${BASE_URL}/vehicle/${id}`, {
    params: { id }
  });
  return response.data;
};

export const createVehicle = async (data: VehicleRequest): Promise<VehicleDTO> => {
  const response = await axios.post(`${BASE_URL}/vehicle`, data);
  return response.data;
};

export const updateVehicle = async (id: number, data: VehicleRequest): Promise<VehicleDTO> => {
  const response = await axios.put(`${BASE_URL}/vehicle/${id}`, data, {
    params: { id }
  });
  return response.data;
};

export const deactivateVehicle = async (id: number): Promise<void> => {
  await axios.patch(`${BASE_URL}/vehicle/deactivate/${id}`);
};

export const activateVehicle = async (id: number): Promise<void> => {
  await axios.patch(`${BASE_URL}/vehicle/activate/${id}`);
};
