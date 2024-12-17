"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
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

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      return savedWishlist ? JSON.parse(savedWishlist).length : 0;
    } catch {
      return 0;
    }
  });
  const { cartItems, showCart, setShowCart } = useCart();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      const wishlistIds = JSON.parse(savedWishlist);
      setWishlistCount(wishlistIds.length);
    }

    // Listen for wishlist updates
    const handleWishlistUpdate = (event) => {
      setWishlistCount(event.detail.count);
    };

    window.addEventListener("wishlistUpdate", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlistUpdate", handleWishlistUpdate);
    };
  }, []);

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
                <span>+1234567890</span>
              </a>
              <a
                href="mailto:info@oxtoyin.com"
                className="flex items-center hover:text-blue-500 transition-colors"
              >
                <FaEnvelope className="w-3 h-3 mr-2" />
                <span>info@oxtoyin.com</span>
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
                className="text-2xl font-bold text-black tracking-tight"
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
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm font-medium"
                >
                  {item.name}
                </a>
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
            <div className="md:hidden py-4 border-t border-gray-100">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-[calc(4rem+32px)]"></div>
    </>
  );
}
