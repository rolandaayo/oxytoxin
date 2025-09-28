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
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              My Wishlist
            </h1>
            <p className="text-gray-600">Items you've saved for later</p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <FaHeart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start adding items you love to your wishlist
              </p>
              <a
                href="/categories"
                className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors inline-block"
              >
                Browse Products
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <Image
                      src={item.mainImage || "/images/logo.png"}
                      alt={item.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <FaTrash className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        ₦{item.price.toLocaleString()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.instock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.instock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => moveToCart(item)}
                        disabled={!item.instock}
                        className={`flex-1 py-2 px-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                          item.instock
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <FaShoppingCart className="w-4 h-4" />
                        <span>
                          {item.instock ? "Add to Cart" : "Out of Stock"}
                        </span>
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
