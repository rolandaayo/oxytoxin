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
    <footer className="bg-white text-black">
      {/* Trust Badges Section */}
      <div className="border-b border-[#3a5d28]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-center">
            <div className="flex flex-col items-center w-[calc(50%-1.5rem)] md:w-[calc(25%-2rem)]">
              <FaTruck className="w-8 h-8 mb-3 text-blue-500" />
              <h4 className="font-semibold text-black mb-2">Free Shipping</h4>
              <p className="text-sm text-black">On orders over $100</p>
            </div>
            <div className="flex flex-col items-center w-[calc(50%-1.5rem)] md:w-[calc(25%-2rem)]">
              <FaCreditCard className="w-8 h-8 mb-3 text-blue-500" />
              <h4 className="font-semibold text-black mb-2">Secure Payment</h4>
              <p className="text-sm text-black">100% secure payments</p>
            </div>
            <div className="flex flex-col items-center w-[calc(50%-1.5rem)] md:w-[calc(25%-2rem)]">
              <FaLock className="w-8 h-8 mb-3 text-blue-500" />
              <h4 className="font-semibold text-black mb-2">
                Shop with Confidence
              </h4>
              <p className="text-sm text-black">30 days free returns</p>
            </div>
            <div className="flex flex-col items-center w-[calc(50%-1.5rem)] md:w-[calc(25%-2rem)]">
              <FaEnvelope className="w-8 h-8 mb-3 text-blue-500" />
              <h4 className="font-semibold text-black mb-2">Customer Support</h4>
              <p className="text-sm text-black">24/7 help available</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Newsletter (Optional) */}
          <div className="border-t border-[#3a5d28] pt-8">
            <div className="max-w-md mx-auto text-left md:text-center">
              <h3 className="text-lg font-semibold mb-4">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-black mb-4">
                Stay updated with our latest trends and products
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none focus:border-blue-500"
                />
                <button className="px-6 py-2 bg-ray-900 border text-black rounded-lg hover:bg-blue-600 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#3a5d28] text-left md:text-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Oxytoxin. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-black text-sm">
                Terms & Conditions
              </a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-black text-sm">
                Privacy Policy
              </a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-black text-sm">
                Sitemap
              </a>
            </div>
            <div className="text-gray-400 text-sm pt-4 text-center">
              <h2>
                website built by{" "}
                <a href="https://rolandayo.vercel.app" target="_blank">
                  @rolandaayo
                </a>{" "}
                with ❤️
              </h2>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}

        {/* Bottom Bar */}
      </div>
    </footer>
  );
}
