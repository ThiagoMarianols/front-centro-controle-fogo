export interface BattalionDTO {
  id: number;
  name: string;
  email: string;
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
