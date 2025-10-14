"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowRight,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSearch,
  FaTh,
  FaList,
  FaHeart,
} from "react-icons/fa";
import { motion } from "framer-motion";
import PageTransition from "./PageTransition";
import { publicApi } from "../services/api";
import { useCart } from "../context/CartContext";
import { addToWishlist, isInWishlist } from "../utils/wishlist";

export default function Categories() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const { addToCart } = useCart();

  // Responsive items per page: 10 for mobile, 12 for desktop
  const itemsPerPage = isMobile ? 10 : 12;

  useEffect(() => {
    fetchData();
  }, []);

  // Screen size detection for responsive pagination
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Reset to page 1 when items per page changes or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, selectedCategory, searchTerm, priceRange]);

  const filterAndSortProducts = useCallback(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(priceRange.max)
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "date":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy, sortOrder, priceRange, searchTerm]);

  useEffect(() => {
    filterAndSortProducts();
  }, [filterAndSortProducts]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        publicApi.getProducts(),
        publicApi.getCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const getCategoryProducts = (categoryName) => {
    return products.filter(
      (product) => product.category.toLowerCase() === categoryName.toLowerCase()
    );
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
      if (products.length === 0) return;

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
  }, [products]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[300px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/images/image2.jpeg")',
            }}
          >
            {/* Softer overlay for calmer look */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl md:text-5xl font-medium text-white mb-4 tracking-tight">
              Categories
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl">
              Explore our wide range of fashion categories
            </p>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((categoryName, index) => {
              const categoryProducts = getCategoryProducts(categoryName);

              // Use the first product's image from this category, or a default
              const categoryImage =
                categoryProducts.length > 0
                  ? // Try common image fields used across the app before falling
                    // back to the logo placeholder
                    categoryProducts[0].mainImage ||
                    categoryProducts[0].image ||
                    (categoryProducts[0].images &&
                      categoryProducts[0].images[0]) ||
                    "/images/logo.png"
                  : "/images/logo.png";

              return (
                <motion.div
                  key={categoryName}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 bg-white cursor-pointer"
                  onClick={() => setSelectedCategory(categoryName)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={categoryImage}
                      alt={categoryName}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-base font-medium mb-1">
                      {categoryName}
                    </h3>
                    <p className="text-white/70 text-sm mb-2">
                      Discover our {categoryName.toLowerCase()} collection
                    </p>
                    <p className="text-sm font-normal text-white/90">
                      {categoryProducts.length} Items
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Filters and Products Section */}
        <div className="container mx-auto px-4 pb-16">
          {/* Filter Controls */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              >
                <option value="all" className="text-black">
                  All Categories
                </option>
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="text-black"
                  >
                    {category}
                  </option>
                ))}
              </select>

              {/* Sort Options */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                >
                  <option value="name" className="text-black">
                    Sort by Name
                  </option>
                  <option value="price" className="text-black">
                    Sort by Price
                  </option>
                  <option value="date" className="text-black">
                    Sort by Date
                  </option>
                </select>

                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors text-black"
                >
                  {sortOrder === "asc" ? (
                    <FaSortAmountUp className="text-black" />
                  ) : (
                    <FaSortAmountDown className="text-black" />
                  )}
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <FaList />
                </button>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="flex gap-4 mt-4 items-center">
              <span className="text-sm font-medium text-black">
                Price Range:
              </span>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                className="w-24 px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-500"
              />
              <span className="text-black">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                className="w-24 px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-500"
              />
              <button
                onClick={() => setPriceRange({ min: "", max: "" })}
                className="text-sm text-blue-500 hover:text-blue-700 font-medium"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-700">
              Showing {filteredProducts.length} of {products.length} products
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Products Grid/List */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {(() => {
              // Pagination calculations
              const totalItems = filteredProducts.length;
              const totalPages = Math.max(
                1,
                Math.ceil(totalItems / itemsPerPage)
              );
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              const pagedProducts = filteredProducts.slice(
                startIndex,
                endIndex
              );

              return pagedProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div
                    className={`${
                      viewMode === "list"
                        ? "w-48 flex-shrink-0"
                        : "relative overflow-hidden h-40 sm:h-56 md:aspect-square"
                    }`}
                  >
                    <Image
                      src={product.mainImage || "/images/logo.png"}
                      alt={product.name}
                      width={viewMode === "list" ? 200 : 300}
                      height={viewMode === "list" ? 200 : 300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                    />
                  </div>

                  <div
                    className={`p-4 ${
                      viewMode === "list"
                        ? "flex-1 flex flex-col justify-between"
                        : ""
                    }`}
                  >
                    <div>
                      <h3 className="font-medium text-base mb-2 text-gray-700 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-semibold text-gray-800">
                          ₦{product.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the card click
                              handleWishlistToggle(product);
                            }}
                            className={`p-2 rounded-full transition-all duration-300 ${
                              wishlistStatus[product._id]
                                ? "text-red-500 bg-red-50 hover:bg-red-100"
                                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                            }`}
                            title={
                              wishlistStatus[product._id]
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                          >
                            <FaHeart className="w-4 h-4" />
                          </button>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.instock
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {product.instock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ));
            })()}
          </div>

          {/* Pagination Controls */}
          {(() => {
            const totalItems = filteredProducts.length;
            const totalPages = Math.max(
              1,
              Math.ceil(totalItems / itemsPerPage)
            );

            if (totalPages > 1) {
              return (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    Next
                  </button>
                </div>
              );
            }
            return null;
          })()}

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">
                No products found matching your criteria
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchTerm("");
                  setPriceRange({ min: "", max: "" });
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
