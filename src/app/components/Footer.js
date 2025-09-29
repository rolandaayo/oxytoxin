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
      <div className="border-b border-[#3a5d28] bg-gradient-to-b from-white to-gray-50/60">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Card 1 */}
            <div className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-4 md:p-5 flex items-center md:flex-col gap-3 md:gap-4 text-left md:text-center">
              <div className="shrink-0 rounded-full bg-black/90 text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center ring-1 ring-black/10 group-hover:ring-black/20 transition">
                <FaTruck className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-black leading-tight">
                  Free Shipping
                </h4>
                <p className="text-xs md:text-sm text-gray-600">
                  On orders over #200,000
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-4 md:p-5 flex items-center md:flex-col gap-3 md:gap-4 text-left md:text-center">
              <div className="shrink-0 rounded-full bg-black/90 text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center ring-1 ring-black/10 group-hover:ring-black/20 transition">
                <FaCreditCard className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-black leading-tight">
                  Secure Payment
                </h4>
                <p className="text-xs md:text-sm text-gray-600">
                  100% secure payments
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-4 md:p-5 flex items-center md:flex-col gap-3 md:gap-4 text-left md:text-center">
              <div className="shrink-0 rounded-full bg-black/90 text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center ring-1 ring-black/10 group-hover:ring-black/20 transition">
                <FaLock className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-black leading-tight">
                  Shop with Confidence
                </h4>
                <p className="text-xs md:text-sm text-gray-600">
                  30 days free returns
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-4 md:p-5 flex items-center md:flex-col gap-3 md:gap-4 text-left md:text-center">
              <div className="shrink-0 rounded-full bg-black/90 text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center ring-1 ring-black/10 group-hover:ring-black/20 transition">
                <FaEnvelope className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-black leading-tight">
                  Customer Support
                </h4>
                <p className="text-xs md:text-sm text-gray-600">
                  24/7 help available
                </p>
              </div>
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
              <a href="/terms-conditions" className="text-gray-400 hover:text-black text-sm">
                Terms & Conditions
              </a>
              <span className="text-gray-600">•</span>
              <a href="/privacy-policy" className="text-gray-400 hover:text-black text-sm">
                Privacy Policy
              </a>
              
            </div>
            <div className="text-gray-400 text-sm pt-4 text-center">
              <h2>
                website built by{" "}
                <a href="https://wa.me/2348122447364?text=Hello%20roland%20i%20need%20your%20website%20service" target="_blank">
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
