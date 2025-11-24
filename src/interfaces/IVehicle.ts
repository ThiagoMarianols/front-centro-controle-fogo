export interface VehicleDTO {
  id: number;
  active: boolean;
  name: string;
  battalionId: number;
  battalionName: string;
}

export interface VehicleRequest {
  name: string;
  battalion: number;
}

export interface VehicleSimple {
  id: number;
  name: string;
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

// Legacy interfaces for backward compatibility
export interface IVehicle {
  id: number;
  name: string;
}

export interface IVehicleResponse {
  id: number;
  name: string;
}
