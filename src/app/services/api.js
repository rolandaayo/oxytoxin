const BACKEND_URL = "https://oxytoxin-backend.vercel.app/";

// Public API calls
export const publicApi = {
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
};

// Admin API calls
export const adminApi = {
  // Get all products
  getProducts: async () => {
    try {
      const url = `${BACKEND_URL}/api/admin/products`;
      console.log("Admin fetching products from:", url);

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
      console.error("Error fetching admin products:", error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const url = `${BACKEND_URL}/api/admin/products`;
      console.log("Creating product:", productData);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
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

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
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

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Cache-Control": "no-cache",
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

      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "Cache-Control": "no-cache",
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
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
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
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Cache-Control": "no-cache",
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
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
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
};
