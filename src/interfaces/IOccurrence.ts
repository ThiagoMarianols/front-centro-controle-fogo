export interface IAddress {
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
}

export interface IOccurrenceRequest {
  occurrenceHasVictims: boolean;
  occurrenceRequester: string;
  occurrenceRequesterPhoneNumber: string;
  occurrenceSubType: string;
  address: IAddress;
}

export interface IUpdateOccurrenceRequest extends IOccurrenceRequest {
  occurrenceDetails: string;
  latitude: number;
  longitude: number;
  occurrenceArrivalTime: string;
  userIds: number[];
}

export interface IOccurrenceOnSiteRequest {
  occurrenceDetails: string;
  latitude: number;
  longitude: number;
  occurrenceArrivalTime: string;
  userIds: number[];
}

export interface IOccurrenceDTO {
  id: number;
  occurrenceHasVictims: boolean;
  occurrenceRequester: string;
  occurrenceRequesterPhoneNumber: string;
  occurrenceSubType: string;
  occurrenceDetails?: string;
  latitude?: number;
  longitude?: number;
  occurrenceArrivalTime?: string;
  status: string;
  createDate: string;
  active: boolean;
  // Endereço
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  complement?: string;
}

export interface IPaginatedResponse {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: IOccurrenceDTO[];
}
