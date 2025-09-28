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
        if (error.message.includes("already in wishlist")) {
          toast.error("Item already in wishlist");
        } else {
          toast.error("Failed to add to wishlist");
        }
        return false;
      }
    } else {
      // Fallback to localStorage
      const existingWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      // Check if item already exists
      const existingItem = existingWishlist.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        toast.error("Item already in wishlist");
        return false;
      }

      // Add new item
      const updatedWishlist = [...existingWishlist, product];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      toast.success("Added to wishlist!");
      return true;
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
        toast.error("Failed to remove from wishlist");
        return false;
      }
    } else {
      // Fallback to localStorage
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
