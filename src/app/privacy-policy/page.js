"use client";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { motion } from "framer-motion";
import { useState } from "react";

export default function PrivacyPolicyPage() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navbar cartItems={cartItems} setShowCart={setShowCart} />
      <PageTransition>
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <div className="relative h-[30vh] md:h-[30vh] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("/images/image2.jpeg")',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
            </div>
            <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 tracking-tight">
                  Privacy Policy
                </h1>
                <p className="text-sm sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed px-2">
                  Your privacy is important to us. Learn how we collect, use,
                  and protect your information.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Privacy Policy Content */}
          <section className="py-8 md:py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="prose prose-lg max-w-none"
                >
                  <div className="space-y-8">
                    {/* Privacy Policy Content */}
                    <div className="bg-gray-50 p-6 md:p-8 rounded-xl">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6">
                        Privacy Policy
                      </h2>
                      <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                        <p>
                          <strong>Information We Collect:</strong> When you make
                          a purchase, we collect your name, email address,
                          shipping address, and payment information.
                        </p>
                        <p>
                          <strong>How We Use Your Data:</strong> To process your
                          orders, improve our services, and send you promotional
                          emails (if you opt in).
                        </p>
                        <p>
                          <strong>Sharing Information:</strong> We do not sell
                          your personal data. We may share it with trusted third
                          parties like payment processors and delivery
                          companies.
                        </p>
                        <p>
                          <strong>Cookies:</strong> We use cookies to improve
                          your browsing experience and remember your
                          preferences.
                        </p>
                        <p>
                          <strong>Your Rights:</strong> You can request to
                          access, correct, or delete your personal data by
                          contacting us at{" "}
                          <a
                            href="mailto:Oxytoxinapparel@gmail.com"
                            className="text-black font-semibold hover:underline"
                          >
                            Oxytoxinapparel@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </PageTransition>
      <Footer />
    </>
  );
}
