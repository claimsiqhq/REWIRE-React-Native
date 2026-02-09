import Constants from "expo-constants";

// API Base URL - configure for your environment
// Priority: 1. Environment variable, 2. app.json extra.apiUrl, 3. Default
const getApiUrl = () => {
  // Check for environment variable first (for Expo)
  if (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Check app.json extra config
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }
  // Default to localhost for development
  if (__DEV__) {
    return "http://localhost:3000";
  }
  // Production fallback
  return "https://your-api-url.com";
};

const API_BASE_URL = getApiUrl();

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestOptions = {}): Promise<Response> {
    const { timeout = 30000, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
        credentials: "include", // Important for cookie-based sessions
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      // Handle authentication errors
      if (response.status === 401) {
        // Clear stored auth state on 401
        try {
          const { SecureStore } = require("expo-secure-store");
          await SecureStore.deleteItemAsync("session_token");
        } catch (e) {
          // Ignore errors clearing storage
        }
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout. Please check your connection.");
      }
      throw error;
    }
  }

  async get(endpoint: string, options?: RequestOptions): Promise<Response> {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  async post(endpoint: string, data: unknown, options?: RequestOptions): Promise<Response> {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: unknown, options?: RequestOptions): Promise<Response> {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint: string, data: unknown, options?: RequestOptions): Promise<Response> {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string, options?: RequestOptions): Promise<Response> {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
