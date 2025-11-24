export interface BattalionAddress {
  street: string;
  number: number;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface BattalionDTO {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  active: boolean;
  address?: BattalionAddress;
}

export interface BattalionRequest {
  name: string;
  email: string;
  phoneNumber: string;
  address: BattalionAddress;
}

export interface PaginatorResponse<T> {
  data: any;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: T[];
}
