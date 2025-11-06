"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaHeart, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { wishlistApi } from "../services/api";
import { removeFromWishlist as removeFromWishlistUtil } from "../utils/wishlist";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    loadWishlist();
    // Test server connectivity
    testServerConnection();
  }, []);

  const testServerConnection = async () => {
    try {
      const response = await fetch("http://localhost:4000/");
      const result = await response.json();
      console.log("Server connection test:", result);
    } catch (error) {
      console.error("Server connection failed:", error);
    }
  };

  const loadWishlist = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // If no token, try to load from localStorage as fallback
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist));
        }
        setLoading(false);
        return;
      }

      const response = await wishlistApi.getWishlist();
      if (response.status === "success") {
        console.log("Loaded wishlist items:", response.data.items);
        setWishlistItems(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);

      // Check if it's an authentication error
      if (
        error.message &&
        (error.message.includes("401") ||
          error.message.includes("403") ||
          error.message.includes("token") ||
          error.message.includes("expired") ||
          error.message.includes("unauthorized"))
      ) {
        // Don't auto-logout, just show empty wishlist and let user know
        console.log("Authentication issue with wishlist, showing empty state");
        setWishlistItems([]);
      } else {
        // For other errors, try fallback to localStorage
        try {
          const savedWishlist = localStorage.getItem("wishlist");
          if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist));
          }
        } catch (localError) {
          console.error("Error loading from localStorage:", localError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    console.log("Removing from wishlist:", productId);

    // Prevent multiple clicks
    if (removingItems[productId]) return;

    // Set loading state
    setRemovingItems((prev) => ({ ...prev, [productId]: true }));

    // Optimistic update - remove from UI immediately
    const originalWishlist = [...wishlistItems];
    const updatedWishlist = wishlistItems.filter(
      (item) => (item.productId || item._id) !== productId
    );
    setWishlistItems(updatedWishlist);

    try {
      // Use the utility function for consistent behavior
      console.log("Calling removeFromWishlistUtil with productId:", productId);
      const success = await removeFromWishlistUtil(productId, false); // Don't show toast, we handle it here
      console.log("Remove result:", success);
      console.log(
        "Current wishlist items after API call:",
        wishlistItems.length
      );

      if (success) {
        // Success! Keep the optimistic update and show success message
        console.log("Success - keeping item removed");
        toast.success("Removed from wishlist", {
          icon: "💔",
          duration: 2000,
        });
      } else {
        // Revert the optimistic update if the API call failed
        console.log("Failed - reverting optimistic update");
        setWishlistItems(originalWishlist);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      // Revert the optimistic update on error
      console.log("Exception - reverting optimistic update");
      setWishlistItems(originalWishlist);
      toast.error("Failed to remove from wishlist");
    } finally {
      // Clear loading state
      setRemovingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const moveToCart = async (item) => {
    addToCart(item);
    await removeFromWishlist(item.productId || item._id);
    toast.success("Moved to cart!");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wishlist...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">Items you&apos;ve saved for later</p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <FaHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6">
                {localStorage.getItem("authToken")
                  ? "Start adding items you love to your wishlist"
                  : "Please log in to view your wishlist or start browsing to add items"}
              </p>
              <div className="space-x-4">
                <a
                  href="/categories"
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors inline-block"
                >
                  Browse Products
                </a>
                {!localStorage.getItem("authToken") && (
                  <a
                    href="/login"
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors inline-block ml-4"
                  >
                    Login
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {wishlistItems
                .filter((it) => it != null)
                .map((item) => (
                  <div
                    key={item?._id || item?.productId || Math.random()}
                    className="rounded-lg overflow-hidden group cursor-pointer bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-[200px] md:h-[400px] overflow-hidden flex flex-col items-center justify-center">
                      <Image
                        src={item?.mainImage || "/images/logo.png"}
                        alt={item?.name || "product"}
                        width={500}
                        height={500}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const idToUse = item?.productId || item?._id;
                          console.log("Item data:", {
                            _id: item?._id,
                            productId: item?.productId,
                            idToUse,
                          });
                          removeFromWishlist(idToUse);
                        }}
                        disabled={removingItems[item?._id || item?.productId]}
                        className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full transition-all duration-300 ${
                          removingItems[item?._id || item?.productId]
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-white/80 hover:bg-white hover:scale-110"
                        }`}
                      >
                        <FaTrash
                          className={`w-4 h-4 text-red-500 transition-all duration-300 ${
                            removingItems[item?._id || item?.productId]
                              ? "animate-spin"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="text-xs md:text-sm font-semibold text-black truncate">
                        {item?.name || "Unnamed product"}
                      </h3>
                      <div className="flex items-center justify-between pt-2 mb-3">
                        <span className="text-base md:text-lg font-bold text-black">
                          ₦{(item?.price ?? 0).toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveToCart(item);
                          }}
                          disabled={!item?.instock}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                            item?.instock
                              ? "bg-black text-white hover:bg-gray-800"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {item?.instock ? "Add to Cart" : "Out of Stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
