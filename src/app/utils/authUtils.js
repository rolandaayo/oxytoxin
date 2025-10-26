import { toast } from "react-hot-toast";

/**
 * Handle authentication errors and automatically logout user
 */
export const handleAuthError = (error, response = null) => {
  // Check if it's a token expiration or authentication error
  if (response && (response.status === 401 || response.status === 403)) {
    logout();
    return;
  }

  // Check error message for token-related issues
  if (
    error.message &&
    (error.message.includes("token") ||
      error.message.includes("expired") ||
      error.message.includes("unauthorized") ||
      error.message.includes("authentication"))
  ) {
    logout();
    return;
  }

  // For other errors, just show the message
  toast.error(error.message || "An error occurred");
};

/**
 * Logout user and redirect to login page
 */
export const logout = () => {
  // Clear all auth data
  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");

  // Show logout message
  toast.error("Your session has expired. Please log in again.", {
    duration: 4000,
    position: "top-center",
  });

  // Redirect to login page
  window.location.href = "/login";
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("authToken");
};

/**
 * Get auth token
 */
export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};
