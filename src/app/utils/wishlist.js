import toast from "react-hot-toast";

export const addToWishlist = (product) => {
  try {
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
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    toast.error("Failed to add to wishlist");
    return false;
  }
};

export const removeFromWishlist = (productId) => {
  try {
    const existingWishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    const updatedWishlist = existingWishlist.filter(
      (item) => item._id !== productId
    );
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast.success("Removed from wishlist");
    return true;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    toast.error("Failed to remove from wishlist");
    return false;
  }
};

export const isInWishlist = (productId) => {
  try {
    const existingWishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    return existingWishlist.some((item) => item._id === productId);
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
