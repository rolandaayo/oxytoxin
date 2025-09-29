"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { wishlistApi } from "../services/api";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

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
        setWishlistItems(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      // Fallback to localStorage
      try {
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist));
        }
      } catch (localError) {
        console.error("Error loading from localStorage:", localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Use backend API
        await wishlistApi.removeFromWishlist(productId);
        const updatedWishlist = wishlistItems.filter(
          (item) => item.productId !== productId
        );
        setWishlistItems(updatedWishlist);
        toast.success("Removed from wishlist");
      } else {
        // Fallback to localStorage
        const updatedWishlist = wishlistItems.filter(
          (item) => item._id !== productId
        );
        setWishlistItems(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
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
                Start adding items you love to your wishlist
              </p>
              <a
                href="/categories"
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors inline-block"
              >
                Browse Products
              </a>
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
                        removeFromWishlist(item?._id || item?.productId);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <FaTrash className="w-4 h-4 text-red-500" />
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
