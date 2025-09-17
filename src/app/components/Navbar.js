"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Goldman } from "next/font/google";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaHeart,
  FaSync,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Checkout from "./Checkout";

const goldman = Goldman({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const pathname = usePathname();
  const {
    cartItems,
    showCart,
    setShowCart,
    removeFromCart,
    totalAmount,
    loading,
    initializePayment,
    refreshCart,
    userEmail,
    isLoggedIn,
  } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth status and get user name on mount and when user menu is toggled
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("authToken"));
    setUserName(localStorage.getItem("userName") || "");
  }, [showUserMenu]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setShowUserMenu(false);
    // Optionally, refresh the page or redirect
    window.location.reload();
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Fixed Navbar Wrapper */}
      <div className="fixed w-full top-0 left-0 z-50">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white text-sm py-3 hidden md:block border-b border-gray-800">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <a
                  href="tel:+2348169408260"
                  className="flex items-center hover:text-blue-400 transition-all duration-300 group"
                >
                  <FaPhone className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-300 group-hover:text-white">
                    +2348169408260
                  </span>
                </a>
                <a
                  href="mailto:oxytoxinapparel@gmail.com"
                  className="flex items-center hover:text-blue-400 transition-all duration-300 group"
                >
                  <FaEnvelope className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-300 group-hover:text-white">
                    oxytoxinapparel@gmail.com
                  </span>
                </a>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-all duration-300 font-medium"
                >
                  Track Order
                </a>
                <span className="text-gray-600">|</span>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-all duration-300 font-medium"
                >
                  Help
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav
          className={`bg-white shadow-lg w-full transition-all duration-500 ${
            isScrolled ? "shadow-xl" : ""
          }`}
        >
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center">
                <Link
                  href="/"
                  className={`text-3xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent tracking-tight hover:from-blue-600 hover:to-purple-600 transition-all duration-500 ${goldman.className}`}
                >
                  Oxytoxin
                </Link>
              </div>

              {/* Search Bar - Desktop */}
              <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-6 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm font-medium transition-all duration-300 hover:border-gray-300"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 group ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-100 transition-transform duration-300"></span>
                      )}
                      <span
                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                          isActive ? "hidden" : ""
                        }`}
                      ></span>
                    </Link>
                  );
                })}

                {/* Quick Logout Button for Desktop */}
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-600 transition-all duration-300 flex items-center space-x-2"
                    title="Logout"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                )}
              </div>

              {/* Icons */}
              <div className="flex items-center space-x-4">
                <button
                  className="relative p-3 hover:bg-gray-100 rounded-full transition-all duration-300 group"
                  onClick={() => setShowCart(true)}
                >
                  <FaShoppingCart className="text-gray-700 w-5 h-5 group-hover:scale-110 transition-transform" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                      {cartItems.length}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <button
                    className="p-3 hover:bg-gray-100 rounded-full transition-all duration-300 group"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    {isAuthenticated && userName ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg uppercase shadow-lg group-hover:scale-110 transition-transform">
                        {userName.slice(0, 2)}
                      </span>
                    ) : (
                      <FaUser className="text-gray-700 w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 backdrop-blur-sm z-50">
                      {isAuthenticated ? (
                        <>
                          {/* User Info Header */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm uppercase shadow-lg">
                                {userName.slice(0, 2)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {userName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {userEmail}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              href="/profile"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <FaUser className="w-4 h-4 mr-3 text-gray-400" />
                              Profile Settings
                            </Link>

                            <Link
                              href="/orders"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <FaShoppingCart className="w-4 h-4 mr-3 text-gray-400" />
                              My Orders
                            </Link>

                            <Link
                              href="/wishlist"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <FaHeart className="w-4 h-4 mr-3 text-gray-400" />
                              Wishlist
                            </Link>

                            <button
                              onClick={() => {
                                console.log("Refreshing cart...");
                                refreshCart();
                                setShowUserMenu(false);
                              }}
                              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                            >
                              <FaSync className="w-4 h-4 mr-3 text-gray-400" />
                              Refresh Cart
                            </button>
                          </div>

                          {/* Logout Section */}
                          <div className="border-t border-gray-100 pt-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
                            >
                              <FaSignOutAlt className="w-4 h-4 mr-3 text-gray-400" />
                              Logout
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="py-2">
                          <Link
                            href="/login"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FaSignInAlt className="w-4 h-4 mr-3 text-gray-400" />
                            Login
                          </Link>
                          <Link
                            href="/signup"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FaUserPlus className="w-4 h-4 mr-3 text-gray-400" />
                            Sign Up
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <button
                  className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  {showMenu ? (
                    <FaTimes className="w-5 h-5 text-gray-600" />
                  ) : (
                    <FaBars className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Search - Show when menu is open */}
            {showMenu && (
              <div className="md:hidden py-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm font-medium transition-all duration-300"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            )}

            {/* Mobile Menu */}
            {showMenu && (
              <div className="md:hidden fixed top-0 right-0 h-screen w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto">
                <div className="p-6">
                  <button
                    className="mb-6 p-3 hover:bg-gray-100 rounded-full transition-all duration-300"
                    onClick={() => setShowMenu(false)}
                  >
                    <FaTimes className="w-5 h-5 text-gray-600" />
                  </button>
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-lg font-medium ${
                          isActive
                            ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                            : ""
                        }`}
                        onClick={() => setShowMenu(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-20 md:h-[calc(5rem+40px)]"></div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto relative shadow-2xl">
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
                          src={
                            item.mainImage ||
                            (Array.isArray(item.image)
                              ? item.image[0]
                              : item.image) ||
                            "/images/logo.png"
                          }
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-contain p-2"
                          style={{ backgroundColor: "#f8f8f8" }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">
                          {item.name}
                        </h3>
                        <p className="text-sm text-black">Size: {item.size}</p>
                        <p className="text-sm text-black">
                          Quantity: {item.quantity || 1}
                        </p>
                        <p className="font-bold text-black">
                          ₦
                          {(item.price * (item.quantity || 1)).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          console.log("=== REMOVE BUTTON CLICKED ===");
                          console.log("item.cartItemId:", item.cartItemId);
                          console.log("item:", item);
                          removeFromCart(item.cartItemId);
                        }}
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
                        ₦{totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowCart(false);
                        setShowCheckout(true);
                      }}
                      className="w-full py-3 rounded-lg transition-colors duration-300 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          onClose={() => setShowCheckout(false)}
          onProceedToPayment={() => setShowCheckout(false)}
        />
      )}
    </>
  );
}
