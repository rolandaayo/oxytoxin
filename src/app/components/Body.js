"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import items from "./Data";
import {
  FaTimes,
  FaSearch,
  FaFilter,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaSort,
} from "react-icons/fa";
import QuickView from "./QuickView";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import PageTransition from "./PageTransition";

export default function Body() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("wishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    }
    return [];
  });
  const [selectedSize, setSelectedSize] = useState(() => {
    if (typeof window !== "undefined") {
      const savedSizes = localStorage.getItem("selectedSizes");
      return savedSizes ? JSON.parse(savedSizes) : {};
    }
    return {};
  });
  const [itemQuantities, setItemQuantities] = useState(() => {
    if (typeof window !== "undefined") {
      const savedQuantities = localStorage.getItem("itemQuantities");
      return savedQuantities ? JSON.parse(savedQuantities) : {};
    }
    return {};
  });
  const [loading, setLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState("asc");
  const {
    cartItems,
    setCartItems,
    showCart,
    setShowCart,
    addToCart: contextAddToCart,
  } = useCart();

  const categories = ["all", "jackets", "pants"];
  const sizes = ["S", "M", "L", "XL"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedSizes", JSON.stringify(selectedSize));
    }
  }, [selectedSize]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("itemQuantities", JSON.stringify(itemQuantities));
    }
  }, [itemQuantities]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, []);

  const addToCart = (item) => {
    if (!selectedSize[item.id]) {
      toast.error("Please select a size first", {
        icon: "👕",
        duration: 2000,
      });
      return;
    }
    const quantity = itemQuantities[item.id] || 1;
    const itemWithDetails = {
      ...item,
      size: selectedSize[item.id],
      quantity,
    };
    contextAddToCart(itemWithDetails);
    setSelectedSize((prev) => {
      const newSizes = { ...prev };
      delete newSizes[item.id];
      return newSizes;
    });
    toast.success(`${item.name} added to cart!`, {
      icon: "🛍️",
      duration: 2000,
    });
  };

  const removeFromCart = (itemId) => {
    const itemToRemove = cartItems.find((item) => item.id === itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    toast.success(`${itemToRemove.name} removed from cart`, {
      icon: "🗑️",
      duration: 2000,
    });
  };

  const toggleWishlist = (itemId) => {
    const item = items.find((item) => item.id === itemId);
    if (wishlist.includes(itemId)) {
      const newWishlist = wishlist.filter((id) => id !== itemId);
      setWishlist(newWishlist);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      window.dispatchEvent(
        new CustomEvent("wishlistUpdate", {
          detail: { count: newWishlist.length },
        })
      );
      toast.success(`${item.name} removed from wishlist`, {
        icon: "💔",
        duration: 2000,
      });
    } else {
      const newWishlist = [...wishlist, itemId];
      setWishlist(newWishlist);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      window.dispatchEvent(
        new CustomEvent("wishlistUpdate", {
          detail: { count: newWishlist.length },
        })
      );
      toast.success(`${item.name} added to wishlist`, {
        icon: "❤️",
        duration: 2000,
      });
    }
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
    // Create order data before clearing cart
    const orderData = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: "processing",
      items: cartItems,
      totalAmount: totalAmount,
      paymentRef: paymentReference,
    };

    // Get existing orders and add new order
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = [...existingOrders, orderData];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Clear cart data
    setCartItems([]);
    setSelectedSize({});
    setItemQuantities({});
    localStorage.removeItem("cartItems");
    localStorage.removeItem("selectedSizes");
    localStorage.removeItem("itemQuantities");
    setShowCart(false);

    toast.success("Payment completed successfully!", {
      duration: 3000,
    });
  };

  const initializePayment = async () => {
    setLoading(true);
    try {
      const handler = PaystackPop.setup({
        key: "pk_test_dc632dcb524653128c7ffcd7f3c74cd9c2704c79",
        email: "customer@email.com",
        amount: totalAmount * 100,
        currency: "NGN",
        ref: "" + Math.floor(Math.random() * 1000000000 + 1),
        callback: function (response) {
          toast.success(`Payment complete! Reference: ${response.reference}`, {
            icon: "✅",
            duration: 3000,
          });
          clearStoredData(response.reference);
        },
        onClose: function () {
          toast.error("Transaction was not completed", {
            icon: "❌",
            duration: 3000,
          });
        },
      });
      handler.openIframe();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Payment initialization failed. Please try again.", {
        icon: "⚠️",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getSortedItems = (items) => {
    const sortedItems = [...items];

    switch (sortBy) {
      case "price":
        sortedItems.sort((a, b) => {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        });
        break;
      case "name":
        sortedItems.sort((a, b) => {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        });
        break;
      case "rating":
        sortedItems.sort((a, b) => {
          return sortOrder === "asc"
            ? a.rating - b.rating
            : b.rating - a.rating;
        });
        break;
      case "newest":
        // Assuming you add a date field to your items
        sortedItems.sort((a, b) => {
          return sortOrder === "asc"
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        });
        break;
      default:
        return sortedItems;
    }

    return sortedItems;
  };

  const filteredItems = getSortedItems(
    items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesPrice =
        item.price >= priceRange.min && item.price <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    })
  );

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/images/image2.jpeg")',
            }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-[#D6E752] mb-4 font-sans">
              Discover Your Style
            </h1>
            <p className="text-lg md:text-xl text-[#D6E752] mb-8 max-w-2xl">
              Explore our collection of premium clothing designed for comfort
              and style
            </p>
            {/* Shop Now Button */}
            <button
              onClick={() => {
                const productsSection = document.getElementById("products");
                productsSection.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#D6E752] text-black px-8 py-3 rounded-full hover:bg-white/90 transition-all duration-300 animate-bounce"
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
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

              {/* Price Range */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-20 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                  className="w-20 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      max: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
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
              Price: ${priceRange.min} - ${priceRange.max}
              <button
                onClick={() => setPriceRange({ min: 0, max: 1000 })}
                className="hover:text-black"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {/* Products Grid */}
        <div
          id="products"
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-[200px] md:h-[400px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2 md:p-4"
                  style={{
                    backgroundColor: "#f8f8f8",
                  }}
                />
                <button
                  onClick={() => toggleWishlist(item.id)}
                  className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white"
                >
                  {wishlist.includes(item.id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-500" />
                  )}
                </button>
                {!item.inStock && (
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-red-500/90 backdrop-blur-sm text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                    Out of Stock
                  </div>
                )}
                <button
                  onClick={() => setQuickViewProduct(item)}
                  className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-black px-2 md:px-4 py-1 md:py-2 rounded-full shadow-md hover:bg-white transition-all duration-300 text-xs md:text-sm w-[calc(100%-1rem)] md:w-auto mx-2"
                >
                  Quick View
                </button>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-lg font-semibold text-black truncate">
                  {item.name}
                </h3>
                <p className="text-xs md:text-sm text-black mt-1 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center mt-2 mb-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-3 h-3 md:w-4 md:h-4 ${
                          i < Math.floor(item.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 md:ml-2 text-xs md:text-sm text-black">
                    ({item.reviews})
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg md:text-xl font-bold text-black">
                    ${item.price}
                  </span>
                  <div className="flex gap-1">
                    {Object.values(item.colors)
                      .slice(0, 2)
                      .map((color, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs bg-gray-100 rounded-full"
                        >
                          {color}
                        </span>
                      ))}
                    {Object.values(item.colors).length > 2 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                        +{Object.values(item.colors).length - 2}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex gap-1.5 mb-2 justify-center">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`w-8 h-8 text-xs md:text-sm border rounded-full flex items-center justify-center transition-all duration-300 ${
                          selectedSize[item.id] === size
                            ? "bg-black text-white border-black font-bold"
                            : "border-black text-black hover:bg-black hover:text-white"
                        }`}
                        onClick={() =>
                          setSelectedSize({ ...selectedSize, [item.id]: size })
                        }
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="w-7 h-7 border border-black text-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm">
                        {itemQuantities[item.id] || 1}
                      </span>
                      <button
                        className="w-7 h-7 border border-black text-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.inStock}
                  className={`w-full mt-3 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    item.inStock
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-400 text-gray-100 cursor-not-allowed"
                  }`}
                >
                  {item.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto relative">
              <div className="sticky top-0 bg-white pb-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">Your Cart</h2>
                <FaTimes
                  className="cursor-pointer text-black hover:text-gray-700"
                  onClick={() => setShowCart(false)}
                />
              </div>
              <div className="mt-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-black">Your cart is empty</p>
                    <button
                      onClick={() => setShowCart(false)}
                      className="mt-4 text-black hover:text-gray-700"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 mb-4 p-3 border rounded-lg"
                      >
                        <div className="w-24 h-24 bg-gray-50 rounded overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-black">
                            {item.name}
                          </h3>
                          <p className="text-sm text-black">
                            Size: {item.size}
                          </p>
                          <p className="text-sm text-black">
                            Quantity: {item.quantity || 1}
                          </p>
                          <p className="font-bold text-black">
                            ${item.price * (item.quantity || 1)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-black hover:text-gray-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="mt-4 border-t pt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-bold text-black">Total:</span>
                        <span className="font-bold text-black">
                          ${totalAmount}
                        </span>
                      </div>
                      <button
                        onClick={initializePayment}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg transition-colors duration-300 ${
                          loading
                            ? "opacity-50 cursor-not-allowed bg-gray-400"
                            : "bg-green-600 hover:bg-green-700"
                        } text-white`}
                      >
                        {loading ? "Processing..." : "Proceed to Payment"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

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
