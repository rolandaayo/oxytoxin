"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaSearch,
  FaFilter,
  FaStar,
  FaSort,
  FaHeart,
} from "react-icons/fa";
import QuickView from "./QuickView";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import PageTransition from "./PageTransition";
import { publicApi } from "../services/api";
import { addToWishlist, isInWishlist } from "../utils/wishlist";

export default function Body() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [selectedSize, setSelectedSize] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState("asc");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    cartItems,
    setCartItems,
    showCart,
    setShowCart,
    addToCart: contextAddToCart,
    removeFromCart: contextRemoveFromCart,
    totalAmount,
    loading: cartLoading,
    initializePayment,
  } = useCart();

  // Add a refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const categories = [
    "all",
    "jackets",
    "pants",
    "shirts",
    "shoes",
    "accessories",
  ];
  const sizes = ["S", "M", "L", "XL"];

  useEffect(() => {
    setMounted(true);
    try {
      // Don't restore selected sizes - users should select size fresh each time
      // const savedSizes = localStorage.getItem("selectedSizes");
      const savedQuantities = localStorage.getItem("itemQuantities");

      // Clear any previously saved sizes to prevent auto-selection
      localStorage.removeItem("selectedSizes");
      setSelectedSize({}); // Start with no sizes selected

      if (savedQuantities) setItemQuantities(JSON.parse(savedQuantities));
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadPaystack = () => {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => setPaystackLoaded(true);
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    };

    loadPaystack();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const filters = {
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchQuery || undefined,
        };
        // Add cache-busting parameter
        const data = await publicApi.getProducts(filters, refreshTrigger);
        const mapped = Array.isArray(data)
          ? data.map((p) => ({ ...p, id: p._id || p.id }))
          : [];
        setProducts(mapped);
        console.log("Fetched products:", mapped);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
        setProducts([]);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    // Reduce debounce time to 300ms for faster updates
    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchQuery, mounted, refreshTrigger]); // Add refreshTrigger to dependencies

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Add a refresh function
  const refreshProducts = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Wishlist functions
  const handleWishlistToggle = async (product) => {
    try {
      const isInWishlistResult = await isInWishlist(product._id);

      if (isInWishlistResult) {
        // Item is in wishlist, remove it
        const { removeFromWishlist } = await import("../utils/wishlist");
        await removeFromWishlist(product._id);
        setWishlistStatus((prev) => ({ ...prev, [product._id]: false }));
      } else {
        // Item is not in wishlist, add it
        await addToWishlist(product);
        setWishlistStatus((prev) => ({ ...prev, [product._id]: true }));
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  // Check wishlist status for all products
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!mounted || products.length === 0) return;

      const statusPromises = products.map(async (product) => {
        const isInWishlistResult = await isInWishlist(product._id);
        return { productId: product._id, isInWishlist: isInWishlistResult };
      });

      try {
        const results = await Promise.all(statusPromises);
        const statusMap = {};
        results.forEach(({ productId, isInWishlist }) => {
          statusMap[productId] = isInWishlist;
        });
        setWishlistStatus(statusMap);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [mounted, products]);

  // Set up an interval to refresh products every 30 seconds
  useEffect(() => {
    if (!mounted) return;

    const intervalId = setInterval(refreshProducts, 30000);
    return () => clearInterval(intervalId);
  }, [mounted]);

  // Removed: No longer saving selected sizes to localStorage
  // Users should select size fresh each time to avoid auto-selection

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("itemQuantities", JSON.stringify(itemQuantities));
    } catch (error) {
      console.error("Error saving quantities:", error);
    }
  }, [itemQuantities, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen pt-16 md:pt-[calc(4rem+32px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const addToCart = (item) => {
    if (!selectedSize[item.id]) {
      toast.error("Please select a size first", {
        icon: "👕",
        duration: 2000,
      });
      return;
    }
    const quantity = itemQuantities[item.id] || 1;
    // Generate a unique cartItemId based on product id, size, color, and timestamp
    const cartItemId = `${item.id}-${selectedSize[item.id]}${
      item.color ? `-${item.color}` : ""
    }-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const itemWithDetails = {
      ...item,
      size: selectedSize[item.id],
      quantity,
      cartItemId,
    };
    contextAddToCart(itemWithDetails);
    setSelectedSize((prev) => {
      const newSizes = { ...prev };
      delete newSizes[item.id];
      return newSizes;
    });
  };

  const updateQuantity = (itemId, value) => {
    const newQuantities = {
      ...itemQuantities,
      [itemId]: Math.max(1, (itemQuantities[itemId] || 1) + value),
    };
    setItemQuantities(newQuantities);
    localStorage.setItem("itemQuantities", JSON.stringify(newQuantities));
  };

  const clearStoredData = (paymentReference) => {
    const orderData = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: "processing",
      items: cartItems,
      totalAmount: totalAmount,
      paymentRef: paymentReference,
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = [...existingOrders, orderData];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    setCartItems([]);
    setSelectedSize({});
    setItemQuantities({});
    localStorage.removeItem("itemQuantities");
    setShowCart(false);

    toast.success("Payment completed successfully!", {
      duration: 3000,
    });
  };

  const filteredItems = Array.isArray(products)
    ? products.filter((item) => {
        const price = parseFloat(item.price);
        return price >= priceRange.min && price <= priceRange.max;
      })
    : [];

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "price") {
      return sortOrder === "asc"
        ? parseFloat(a.price) - parseFloat(b.price)
        : parseFloat(b.price) - parseFloat(a.price);
    }
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return 0;
  });

  // Pagination calculations
  const totalItems = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pagedItems = sortedItems.slice(startIndex, endIndex);

  // Before rendering, log filtered and sorted items
  console.log("All products:", products);
  console.log("Filtered items:", filteredItems);
  console.log("Sorted items:", sortedItems);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 mt-6">
        <div className="relative h-[300px] md:h-[400px] object-cover rounded-2xl overflow-hidden mb-8">
          <div
            className="absolute h-[1100] inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/images/bgh.jpeg")',
            }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Discover Your Style
            </h1>
            <p className="text-base md:text-lg text-white mb-8 max-w-2xl">
              Explore our collection of premium clothing designed for comfort
              and style
            </p>
            <button
              onClick={() => {
                const productsSection = document.getElementById("products");
                productsSection.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-white/90 hover:text-black transition-all duration-300 animate-bounce"
            >
              Shop Now
            </button>
          </div>
        </div>

        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 border-black transform -translate-y-1/2 text-black" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-20 px-2 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      min: Number(e.target.value),
                    })
                  }
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-20 px-2 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      max: Number(e.target.value),
                    })
                  }
                />
              </div> */}
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {selectedCategory !== "all" && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory("all")}
                className="hover:text-blue-600"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </span>
          )}
          {(priceRange.min > 0 || priceRange.max < 1000) && (
            <span className="px-3 py-1 bg-black/10 text-black rounded-full text-sm flex items-center gap-2">
              Price: ₦{priceRange.min} - ₦{priceRange.max}
              <button
                onClick={() => setPriceRange({ min: 0, max: 1000 })}
                className="hover:text-black"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-6 p-4 bg-gray-100 text-gray-700 rounded-lg text-center">
            Loading products...
          </div>
        )}

        <div
          id="products"
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
        >
          {pagedItems.length === 0 && !loading && !error ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No products found
            </div>
          ) : (
            pagedItems.map((item, index) => {
              // Robust image handling with fallback
              const mainImg =
                item.mainImage ||
                (Array.isArray(item.image) ? item.image[0] : item.image) ||
                (item.images && item.images[0]) ||
                "/images/logo.png"; // Fallback image
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="rounded-lg overflow-hidden group cursor-pointer bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setQuickViewProduct(item)}
                >
                  <div className="relative h-[200px] md:h-[400px] overflow-hidden flex flex-col items-center justify-center">
                    <Image
                      src={mainImg}
                      alt={item.name}
                      width={500}
                      height={500}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-xs md:text-sm font-semibold text-black truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between pt-2 mb-3">
                      <span className="text-base md:text-lg font-bold text-black">
                        ₦{item.price.toLocaleString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the card click
                          handleWishlistToggle(item);
                        }}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          wishlistStatus[item._id]
                            ? "text-red-500 bg-red-50 hover:bg-red-100"
                            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                        title={
                          wishlistStatus[item._id]
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <FaHeart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border ${
              currentPage === 1 ? "text-gray-400 border-gray-200" : "text-black"
            }`}
          >
            Prev
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === pageNum
                      ? "bg-black text-white border-black"
                      : "text-black"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-200"
                : "text-black"
            }`}
          >
            Next
          </button>
        </div>

        {quickViewProduct && (
          <QuickView
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            addToCart={addToCart}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            itemQuantities={itemQuantities}
            updateQuantity={updateQuantity}
          />
        )}
      </div>
    </PageTransition>
  );
}
