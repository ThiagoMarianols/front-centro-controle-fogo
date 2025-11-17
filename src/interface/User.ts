export interface User {
    idUser: number;
    username: string;
    email: string;
    normalizedName: string;
}

export interface RolesDTO {
    name: string;
}

export interface UserRolesDTO {
    role: RolesDTO;
}

export interface patentUserDTO {
    id: number;
    active: boolean;
    name: string;
}

export interface UserInfoDTO {
    id: number;
    createdAt: string;
    updatedAt: string;
    active: boolean;
    username: string;
    email: string;
    cpf: string;
    phoneNumber: string;
    matriculates: string;
    normalizedName: string;
    gender: string;
    usingDefaultPassword: boolean;
    emailConfirmed: boolean;
    phoneNumberConfirmed: boolean;
    patent: patentUserDTO;
    userRoles: UserRolesDTO[];
}


