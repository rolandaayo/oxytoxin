const BACKEND_URL = "http://localhost:4000";

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

      // Use the admin endpoint as specified
      const url = `${BACKEND_URL}/api/admin/products?${queryParams}`;
      console.log("Fetching products from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        // Add cache: 'no-store' to ensure fresh data
        cache: "no-store",
        // Add next: { revalidate: 0 } for Next.js
        next: { revalidate: 0 },
      });
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response data:", result);

      if (result.status === "error") {
        throw new Error(result.message || "Unknown error from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
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

      const response = await fetch(url);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response data:", result);

      if (result.status === "error") {
        throw new Error(result.message || "Unknown error from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      console.log("Creating product with data:", productData);

      const url = `${BACKEND_URL}/api/admin/products`;
      console.log("Sending POST request to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(productData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response data:", result);

      if (result.status === "error") {
        throw new Error(result.message || "Unknown error from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const result = await response.json();

      if (result.status === "error") {
        throw new Error(result.message);
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
      const response = await fetch(`${BACKEND_URL}/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.status === "error") {
        throw new Error(result.message);
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
      const response = await fetch(`${BACKEND_URL}/api/admin/upload`, {
        method: "POST",
        body: formData,
      });

      // Log the raw response for debugging
      console.log("Upload response status:", response.status);
      const text = await response.text();
      console.log("Upload response text:", text);

      // Try to parse the response as JSON
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        throw new Error("Server returned invalid JSON response");
      }

      if (result.status === "error") {
        throw new Error(result.message || "Upload failed");
      }

      // Log the parsed result for debugging
      console.log("Parsed upload result:", result);

      return result;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },
};
