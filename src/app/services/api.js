import { handleAuthError } from "../utils/authUtils";

// const BACKEND_URL = "https://oxytoxin-backend.vercel.app";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
// process.env.NEXT_PUBLIC_BACKEND_URL || "https://oxytoxin-backend.vercel.app";

// Public API calls
export const publicApi = {
  // Get all categories
  getCategories: async () => {
    try {
      const url = `${BACKEND_URL}/api/public/categories`;
      console.log("Fetching categories from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Unknown error from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get all products
  getProducts: async (filters = {}, refreshTrigger = 0) => {
    try {
      const { category, search, minPrice, maxPrice, inStock } = filters;
      const queryParams = new URLSearchParams();

      if (category && category !== "all")
        queryParams.append("category", category);
      if (search) queryParams.append("search", search);
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);
      if (inStock) queryParams.append("inStock", inStock);
      // Add timestamp to prevent caching
      queryParams.append("_t", Date.now());

      // Use the public endpoint
      const url = `${BACKEND_URL}/api/public/products?${queryParams}`;
      console.log("Fetching products from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Unknown error from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const url = `${BACKEND_URL}/api/public/orders`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "error") {
        throw new Error(result.message || "Failed to create order");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's cart from database
  getCart: async (userEmail) => {
    try {
      const url = `${BACKEND_URL}/api/public/cart?userEmail=${encodeURIComponent(
        userEmail
      )}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to fetch cart");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user's cart in database
  updateCart: async (userEmail, cartItems) => {
    try {
      const url = `${BACKEND_URL}/api/public/cart`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, cartItems }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to update cart");
      }
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Update specific item in user's cart
  updateCartItem: async (userEmail, cartItemId, quantity) => {
    try {
      const url = `${BACKEND_URL}/api/public/cart/${cartItemId}?userEmail=${encodeURIComponent(
        userEmail
      )}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to update item in cart");
      }
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Remove specific item from user's cart
  removeCartItem: async (userEmail, cartItemId) => {
    try {
      console.log("=== REMOVE CART ITEM API CALL ===");
      console.log("userEmail:", userEmail);
      console.log("cartItemId:", cartItemId);

      const url = `${BACKEND_URL}/api/public/cart/${encodeURIComponent(
        cartItemId
      )}?userEmail=${encodeURIComponent(userEmail)}`;
      console.log("API URL:", url);

      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API result:", result);

      if (result.status === "error") {
        throw new Error(result.message || "Failed to remove item from cart");
      }
      return result;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // Clear user's cart in database
  clearCart: async (userEmail) => {
    try {
      const url = `${BACKEND_URL}/api/public/cart?userEmail=${encodeURIComponent(
        userEmail
      )}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to clear cart");
      }
      return result;
    } catch (error) {
      throw error;
    }
  },
};

// Helper to get auth token
function getAdminToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
}

export const adminApi = {
  // Get all products
  getProducts: async () => {
    try {
      const url = `${BACKEND_URL}/api/admin/products`;
      console.log("Admin fetching products from:", url);

      const token = getAdminToken();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Unknown error from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching admin products:", error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const url = `${BACKEND_URL}/api/admin/products`;
      console.log("Creating product:", productData);

      const token = getAdminToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to create product");
      }

      return result.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const url = `${BACKEND_URL}/api/admin/products/${id}`;
      console.log("Updating product:", { id, productData });

      const token = getAdminToken();
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to update product");
      }

      return result.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const url = `${BACKEND_URL}/api/admin/products/${id}`;
      console.log("Deleting product:", id);

      const token = getAdminToken();
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Cache-Control": "no-cache",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to delete product");
      }

      return result.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Upload image
  uploadImage: async (formData) => {
    try {
      const url = `${BACKEND_URL}/api/admin/upload`;
      console.log("Uploading image");

      const token = getAdminToken();
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "Cache-Control": "no-cache",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to upload image");
      }

      return result.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  // Fetch all users (admin)
  getUsers: async () => {
    try {
      const url = `${BACKEND_URL}/api/admin/users`;
      const token = getAdminToken();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Unknown error from server");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user (admin)
  updateUser: async (id, updates) => {
    try {
      const url = `${BACKEND_URL}/api/admin/users/${id}`;
      const token = getAdminToken();
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to update user");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user (admin)
  deleteUser: async (id) => {
    try {
      const url = `${BACKEND_URL}/api/admin/users/${id}`;
      const token = getAdminToken();
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Cache-Control": "no-cache",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to delete user");
      }
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Create new user (admin)
  createUser: async (userData) => {
    try {
      const url = `${BACKEND_URL}/api/admin/users`;
      const token = getAdminToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to create user");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status, paymentRef) => {
    try {
      const url = `${BACKEND_URL}/api/admin/orders/${orderId}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentRef }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to update order");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  getOrders: async () => {
    try {
      const url = `${BACKEND_URL}/api/admin/orders`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to fetch orders");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },
  // Delete order (admin)
  deleteOrder: async (orderId) => {
    try {
      const url = `${BACKEND_URL}/api/admin/orders/${orderId}`;
      const token = getAdminToken();
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Cache-Control": "no-cache",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to delete order");
      }
      return result;
    } catch (error) {
      throw error;
    }
  },
};

// User profile API calls
export const userApi = {
  // Get user profile
  getUserProfile: async (userEmail) => {
    try {
      const url = `${BACKEND_URL}/api/public/profile?userEmail=${encodeURIComponent(
        userEmail
      )}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to fetch user profile");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userEmail, profileData) => {
    try {
      const url = `${BACKEND_URL}/api/public/profile`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, ...profileData }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to update user profile");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (userEmail, passwordData) => {
    try {
      const url = `${BACKEND_URL}/api/public/change-password`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, ...passwordData }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to change password");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (userEmail, formData) => {
    try {
      const url = `${BACKEND_URL}/api/public/profile-picture`;
      formData.append("userEmail", userEmail);
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to upload profile picture");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete account
  deleteAccount: async (userEmail) => {
    try {
      const url = `${BACKEND_URL}/api/public/delete-account`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to delete account");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async (userEmail) => {
    try {
      const url = `${BACKEND_URL}/api/public/user-orders?userEmail=${encodeURIComponent(
        userEmail
      )}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "error") {
        throw new Error(result.message || "Failed to fetch user orders");
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  },
};

// Auth API calls
export const authApi = {
  // Test email endpoint
  testEmail: async (email) => {
    try {
      const url = `${BACKEND_URL}/api/auth/test-email`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Signup
  signup: async (userData) => {
    try {
      const url = `${BACKEND_URL}/api/auth/signup`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const url = `${BACKEND_URL}/api/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Verify code
  verifyCode: async (email, code) => {
    try {
      const url = `${BACKEND_URL}/api/auth/verify-code`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },
};

// Wishlist API calls
export const wishlistApi = {
  // Get user's wishlist
  getWishlist: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = `${BACKEND_URL}/api/wishlist`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Don't call handleAuthError here to prevent automatic logout
        // Let the calling component handle the error appropriately
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      // Don't call handleAuthError here to prevent automatic logout
      throw error;
    }
  },

  // Add item to wishlist
  addToWishlist: async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = `${BACKEND_URL}/api/wishlist/add`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          }
        } catch (parseError) {
          // If parsing fails, use the original error text
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = `${BACKEND_URL}/api/wishlist/remove/${productId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Check if item is in wishlist
  checkWishlist: async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { isInWishlist: false };
      }

      const url = `${BACKEND_URL}/api/wishlist/check/${productId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return { isInWishlist: false };
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      return { isInWishlist: false };
    }
  },

  // Clear wishlist
  clearWishlist: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = `${BACKEND_URL}/api/wishlist/clear`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },
};
