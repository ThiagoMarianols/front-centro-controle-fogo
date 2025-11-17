import axios from '../config/axiosConfig';
import type { LoginRequest, LoginResponse } from '../interface/Login';
import { API_URL } from '../context/authContext';
import type { UserInfoDTO } from '../interface/User';


export async function loginService(data: LoginRequest): Promise<LoginResponse> {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email: data.email,
    password: data.password,
  });
  return response.data;
}

export async function getUserInfo(): Promise<UserInfoDTO> {
  const token = localStorage.getItem('accessToken');
  const id = localStorage.getItem('id');
  const response = await axios.get(`${API_URL}/auth/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function logoutService(): Promise<number> {
  const token = localStorage.getItem('accessToken');
  const id = localStorage.getItem('id');
  const response = await axios.post(
    `${API_URL}/auth/logout/${id}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.status;
}

export async function refreshTokenService(refreshToken: string, username: string): Promise<string> {
  const response = await axios.post(`${API_URL}/auth/refresh-token/`, {
    refreshToken,
    username,
  });
  return response.data.token;
}

export async function getUsersPaginated(
  page: number = 1,
  size: number = 10,
  filterGeneric?: string,
  active: boolean = true
) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    active: active.toString(),
  });

  if (filterGeneric) {
    params.append('filterGeneric', filterGeneric);
  }

  const response = await axios.get(`${API_URL}/auth/paginator?${params.toString()}`);
  return response.data;
}

export async function deactivateUser(id: number): Promise<string> {
  const response = await axios.put(`${API_URL}/auth/deactivate/${id}`);
  return response.data;
}

export async function activateUser(id: number): Promise<string> {
  const response = await axios.put(`${API_URL}/auth/activate/${id}`);
  return response.data;
}
  

