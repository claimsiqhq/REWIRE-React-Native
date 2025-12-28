import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { setAuthToken, clearAuthToken, User, AuthResponse } from '@/lib/api';

const API_BASE = Constants.expoConfig?.extra?.apiUrl || "http://localhost:5000/api";
const AUTH_TOKEN_KEY = 'rewire_auth_token';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthProvider() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Fetch current user
  const { data: user, isLoading, refetch } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        if (!token) return null;

        const response = await fetch(`${API_BASE}/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            await clearAuthToken();
            return null;
          }
          throw new Error('Failed to fetch user');
        }

        return response.json();
      } catch (err) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(error.message || 'Login failed');
      }

      return response.json() as Promise<AuthResponse>;
    },
    onSuccess: async (data) => {
      await setAuthToken(data.token);
      queryClient.setQueryData(['user'], data.user);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(error.message || 'Registration failed');
      }

      return response.json() as Promise<AuthResponse>;
    },
    onSuccess: async (data) => {
      await setAuthToken(data.token);
      queryClient.setQueryData(['user'], data.user);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const login = useCallback(async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  }, [loginMutation]);

  const register = useCallback(async (data: RegisterData) => {
    await registerMutation.mutateAsync(data);
  }, [registerMutation]);

  const logout = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      if (token) {
        await fetch(`${API_BASE}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } finally {
      await clearAuthToken();
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
    }
  }, [queryClient]);

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error,
  };
}

export { AuthContext };
export type { AuthContextType, RegisterData };
