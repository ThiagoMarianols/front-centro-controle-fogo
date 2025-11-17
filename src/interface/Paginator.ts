export interface PaginatorGeneric<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: T[];
}

export interface UserPaginatorDTO {
  id: number;
  active: boolean;
  normalizedName: string;
  matriculates: string;
}
