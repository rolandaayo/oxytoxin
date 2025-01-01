"use client";
import React from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaLock,
  FaTruck,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (!email) {
      toast.error("Please enter your email address", {
        icon: "📧",
        duration: 2000,
      });
      return;
    }
    // Handle subscription logic here
    toast.success("Thank you for subscribing!", {
      icon: "✨",
      duration: 2000,
    });
    e.target.reset();
  };

  return (
    <footer className="bg-[#304E21] text-white">
      {/* Trust Badges Section */}
      <div className="border-b border-[#3a5d28]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <FaTruck className="w-8 h-8 mb-3 text-blue-500" />
              <h4 className="font-semibold text-[#D6E752] mb-2">
                Free Shipping
              </h4>
              <p className="text-sm text-[#D6E752]">On orders over $100</p>
            </div>
            <div className="flex flex-col items-center">
              <FaCreditCard className="w-8 h-8 mb-3 text-blue-500" />
              <h4 className="font-semibold text-[#D6E752] mb-2">
                Secure Payment
              </h4>
              <p className="text-sm text-[#D6E752] ">100% secure payments</p>
            </div>
            <div className="flex flex-col items-center">
              <FaLock className="w-8 h-8 mb-3 text-blue-500" />
              <h4 className="font-semibold text-[#D6E752] mb-2">
                Shop with Confidence
              </h4>
              <p className="text-sm text-[#D6E752]">30 days free returns</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Newsletter (Optional) */}
          <div className="mt-12 border-t border-[#3a5d28] pt-8">
            <div className="max-w-md mx-auto text-left md:text-center">
              <h3 className="text-lg font-semibold mb-4">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-[#D6E752] mb-4">
                Stay updated with our latest trends and products
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none focus:border-blue-500"
                />
                <button className="px-6 py-2 bg-[#D6E752] text-black rounded-lg hover:bg-blue-600 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#3a5d28] text-left md:text-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Oxtoyin. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Terms & Conditions
              </a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Sitemap
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}

        {/* Bottom Bar */}
      </div>
    </footer>
  );
}
