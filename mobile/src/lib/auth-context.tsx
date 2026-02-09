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
          if (userData && userData.id) {
            setUser(userData);
          } else {
            // No user data means not authenticated
            await SecureStore.deleteItemAsync("session_token");
          }
        } else if (response.status === 401) {
          // Unauthorized - clear session
          await SecureStore.deleteItemAsync("session_token");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // On network error, don't clear session - might be offline
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
        // Store session indicator (server uses cookie-based sessions, so cookies are handled automatically)
        // We store a flag to indicate user is authenticated
        await SecureStore.setItemAsync("session_token", userData.id?.toString() || "authenticated");
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({ message: "Login failed" }));
        return { success: false, error: errorData.message || "Invalid username or password" };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error";
      if (errorMessage.includes("timeout")) {
        return { success: false, error: "Connection timeout. Please check your internet connection." };
      }
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
        // Store session indicator (server uses cookie-based sessions)
        await SecureStore.setItemAsync("session_token", userData.id?.toString() || "authenticated");
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
        return { success: false, error: errorData.message || "Registration failed. Please try again." };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error";
      if (errorMessage.includes("timeout")) {
        return { success: false, error: "Connection timeout. Please check your internet connection." };
      }
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
