import { Alert } from "react-native";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes("timeout")) {
      return "Connection timeout. Please check your internet connection.";
    }
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      return "Network error. Please check your connection and try again.";
    }
    
    // API errors
    if (error.message.includes("401") || error.message.includes("Unauthorized")) {
      return "You are not authorized. Please log in again.";
    }
    if (error.message.includes("403") || error.message.includes("Forbidden")) {
      return "You don't have permission to perform this action.";
    }
    if (error.message.includes("404") || error.message.includes("Not Found")) {
      return "The requested resource was not found.";
    }
    if (error.message.includes("500") || error.message.includes("Server")) {
      return "Server error. Please try again later.";
    }
    
    return error.message;
  }
  
  return "An unexpected error occurred. Please try again.";
}

export function showErrorAlert(error: unknown, title: string = "Error") {
  const message = handleApiError(error);
  Alert.alert(title, message);
}

export function showSuccessAlert(message: string, title: string = "Success") {
  Alert.alert(title, message);
}
