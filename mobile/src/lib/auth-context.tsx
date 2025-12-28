import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { apiClient } from "./api-client";

interface User {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: "client" | "coach" | "admin" | "superadmin";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const sessionToken = await SecureStore.getItemAsync("session_token");
      if (sessionToken) {
        const response = await apiClient.get("/api/user");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          await SecureStore.deleteItemAsync("session_token");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.post("/api/login", { username, password });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // Store session token if available in response headers or body
        await SecureStore.setItemAsync("session_token", "authenticated");
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || "Login failed" };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await apiClient.post("/api/register", {
        username,
        email,
        password,
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        await SecureStore.setItemAsync("session_token", "authenticated");
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || "Registration failed" };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/api/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await SecureStore.deleteItemAsync("session_token");
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.get("/api/user");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
