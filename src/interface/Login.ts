export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  success: boolean;
  [key: string]: any;
}
