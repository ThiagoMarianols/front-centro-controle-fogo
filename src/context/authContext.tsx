import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../config/axiosConfig';
import type { ReactNode } from 'react';
import type { User } from '../interface/User';
import { refreshTokenService } from '../services/authService';


interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  usingDefaultPassword: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: { normalizedName?: string; }) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const API_URL = `${import.meta.env.VITE_BASE_URL}`;

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [usingDefaultPassword, setUsingDefaultPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        fetchUserProfile(Number(storedUserId))
          .catch(error => {
            console.error('Erro ao buscar perfil:', error);
          })
          .finally(() => {
            setTimeout(() => {
              setIsLoading(false);
            }, 300);
          });
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [accessToken]);

  const fetchUserProfile = async (userId: number) => {
    try {
      const response = await axios.get(`${API_URL}/auth/${userId}`);
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        console.warn('Resposta do perfil não contém dados do usuário:', response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username: email, password });
      
      if (response.data && response.data.success) {
        const { accessToken, refreshToken, expiresRefreshToken, id } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('expiresRefreshToken', expiresRefreshToken.toString());
        localStorage.setItem('id', id);
        localStorage.setItem('username', email);
        localStorage.setItem('userId', id);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        await fetchUserProfile(id);
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error('Login falhou');
      }
    } catch (error) {
      console.error('Erro de login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        await axios.post(`${API_URL}/auth/logout/${userId}`);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('id');
      localStorage.removeItem('expiresRefreshToken');
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (data: { normalizedName?: string }) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile/`, data);
      setUser(response.data.user);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const username = localStorage.getItem('username');

      if (!storedRefreshToken || !username) {
        throw new Error('Refresh token ou username não encontrado');
      }

      const newAccessToken = await refreshTokenService(storedRefreshToken, username);
      localStorage.setItem('accessToken', newAccessToken);
      setAccessToken(newAccessToken);
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      // Se falhar ao renovar, faz logout
      await logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        refreshToken,
        usingDefaultPassword,
        login,
        logout,
        updateProfile,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}