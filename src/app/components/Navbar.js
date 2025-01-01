"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Goldman } from "next/font/google";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Image from "next/image";

const goldman = Goldman({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const {
    cartItems,
    showCart,
    setShowCart,
    removeFromCart,
    totalAmount,
    loading,
    initializePayment,
  } = useCart();

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        setWishlistCount(JSON.parse(savedWishlist).length);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }

    const handleWishlistUpdate = (event) => {
      setWishlistCount(event.detail.count);
    };

    window.addEventListener("wishlistUpdate", handleWishlistUpdate);
    return () =>
      window.removeEventListener("wishlistUpdate", handleWishlistUpdate);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "Orders", href: "/orders" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#304E21] text-white text-sm py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <a
                href="tel:+1234567890"
                className="flex items-center hover:text-blue-500 transition-colors"
              >
                <FaPhone className="w-3 h-3 mr-2" />
                <span className="text-white">+1234567890</span>
              </a>
              <a
                href="mailto:info@oxtoyin.com"
                className="flex items-center hover:text-blue-500 transition-colors"
              >
                <FaEnvelope className="w-3 h-3 mr-2" />
                <span className="text-white">info@oxtoyin.com</span>
              </a>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <a href="#" className="hover:text-blue-500 transition-colors">
                Track Order
              </a>
              <span className="text-gray-600">|</span>
              <a href="#" className="hover:text-blue-500 transition-colors">
                Help
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`bg-white/95 backdrop-blur-sm shadow-sm fixed w-full top-0 md:top-[32px] z-50 transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className={`text-2xl font-bold text-black tracking-tight ${goldman.className}`}
              >
                Oxtoyin
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 text-sm"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/wishlist"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaHeart className="text-gray-600 w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowCart(true)}
              >
                <FaShoppingCart className="text-gray-600 w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <FaUser className="text-gray-600 w-5 h-5" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Settings
                    </a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign out
                    </a>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 text-sm"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {showMenu && (
            <div className="md:hidden fixed top-0 right-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto">
              <div className="p-4">
                <button
                  className="mb-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <FaTimes className="w-5 h-5 text-gray-600" />
                </button>
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-[calc(4rem+32px)]"></div>

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
                        <p className="text-sm text-black">Size: {item.size}</p>
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
    </>
  );
}
