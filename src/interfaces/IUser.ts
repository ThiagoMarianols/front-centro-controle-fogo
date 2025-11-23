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
  roleIds: number[];
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

export interface UserDetailDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  username: string;
  email: string;
  cpf: string;
  phoneNumber: string;
  matriculates: string;
  name?: string;
  normalizedName: string;
  gender: string;
  usingDefaultPassword: boolean;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  dateBirth?: string;
  battalion?: {
    id: number;
    name: string;
  };
  address?: AddressDTO;
  patent: {
    id: number;
    active: boolean;
    name: string;
  };
  userRoles: {
    role: {
      id: number;
      name: string;
    };
  }[];
}

export interface UserListDTO {
  id: number;
  name: string;
  patentName: string;
  battalionName: string;
}

export interface UserUpdateDTO {
  username: string;
  email: string;
  phoneNumber: string;
  cpf: string;
  matriculates: string;
  name: string;
  dateBirth: string;
  gender: string;
  battalion: number;
  address: AddressDTO;
  patent: number;
  roleIds: number[];
}
