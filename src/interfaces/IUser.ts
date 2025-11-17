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
