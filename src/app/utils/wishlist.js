import toast from "react-hot-toast";
import { wishlistApi } from "../services/api";

export const addToWishlist = async (product) => {
  try {
    const token = localStorage.getItem("authToken");

    if (token) {
      // Use backend API
      try {
        await wishlistApi.addToWishlist(product._id);
        toast.success("Added to wishlist!");
        return true;
      } catch (error) {
        console.error("Backend wishlist error:", error);
        if (error.message.includes("already in wishlist")) {
          toast.error("Item already in wishlist");
        } else if (
          error.message.includes("401") ||
          error.message.includes("403") ||
          error.message.includes("unauthorized") ||
          error.message.includes("TOKEN_EXPIRED") ||
          error.message.includes("SESSION_EXPIRED")
        ) {
          toast.error("Your session has expired. Please login again.", {
            duration: 4000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          });

          // Clear invalid token and redirect to login
          localStorage.removeItem("authToken");
          setTimeout(() => {
            localStorage.setItem(
              "redirectAfterLogin",
              window.location.pathname
            );
            window.location.href = "/login";
          }, 2000);
        } else {
          toast.error("Failed to add to wishlist. Please try again.");
        }
        return false;
      }
    } else {
      // Show login message for non-authenticated users
      toast.error("Please login to add items to your wishlist", {
        duration: 4000,
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });

      // Optionally redirect to login after a short delay
      setTimeout(() => {
        if (confirm("Would you like to go to the login page now?")) {
          localStorage.setItem("redirectAfterLogin", window.location.pathname);
          window.location.href = "/login";
        }
      }, 1000);

      return false;
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    toast.error("Failed to add to wishlist");
    return false;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const token = localStorage.getItem("authToken");

    if (token) {
      // Use backend API
      try {
        await wishlistApi.removeFromWishlist(productId);
        toast.success("Removed from wishlist");
        return true;
      } catch (error) {
        console.error("Backend remove wishlist error:", error);
        if (
          error.message.includes("401") ||
          error.message.includes("403") ||
          error.message.includes("unauthorized") ||
          error.message.includes("TOKEN_EXPIRED") ||
          error.message.includes("SESSION_EXPIRED")
        ) {
          toast.error("Your session has expired. Please login again.");
          localStorage.removeItem("authToken");
          setTimeout(() => {
            localStorage.setItem(
              "redirectAfterLogin",
              window.location.pathname
            );
            window.location.href = "/login";
          }, 2000);
        } else {
          toast.error("Failed to remove from wishlist");
        }
        return false;
      }
    } else {
      // Fallback to localStorage for non-authenticated users
      const existingWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      const updatedWishlist = existingWishlist.filter(
        (item) => item._id !== productId
      );
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      toast.success("Removed from wishlist");
      return true;
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    toast.error("Failed to remove from wishlist");
    return false;
  }
};

export const isInWishlist = async (productId) => {
  try {
    const token = localStorage.getItem("authToken");

    if (token) {
      // Use backend API
      try {
        const result = await wishlistApi.checkWishlist(productId);
        return result.isInWishlist;
      } catch (error) {
        console.error("Error checking wishlist:", error);
        // If authentication error, silently return false (don't show error to user)
        if (
          error.message.includes("401") ||
          error.message.includes("403") ||
          error.message.includes("unauthorized") ||
          error.message.includes("TOKEN_EXPIRED") ||
          error.message.includes("SESSION_EXPIRED")
        ) {
          // Silently clear invalid token
          localStorage.removeItem("authToken");
        }
        return false;
      }
    } else {
      // Fallback to localStorage
      const existingWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      return existingWishlist.some((item) => item._id === productId);
    }
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }
};

export const getWishlistCount = () => {
  try {
    const existingWishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    return existingWishlist.length;
  } catch (error) {
    console.error("Error getting wishlist count:", error);
    return 0;
  }
};
