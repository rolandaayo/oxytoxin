"use client";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { motion } from "framer-motion";
import { useState } from "react";

export default function TermsConditionsPage() {
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
                  Terms & Conditions
                </h1>
                <p className="text-sm sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed px-2">
                  Please read these terms carefully before using our website and
                  services.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Terms & Conditions Content */}
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
                    {/* Terms & Conditions Content */}
                    <div className="bg-gray-50 p-6 md:p-8 rounded-xl">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6">
                        Terms & Conditions
                      </h2>
                      <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                        <p>
                          <strong>Eligibility:</strong> You must be at least 18
                          years old to use our website.
                        </p>
                        <p>
                          <strong>Orders & Payments:</strong> By placing an
                          order, you agree to provide accurate payment details.
                          We reserve the right to cancel orders if fraud is
                          suspected.
                        </p>
                        <p>
                          <strong>Shipping & Delivery:</strong> Estimated
                          delivery times are provided but not guaranteed.
                        </p>
                        <p>
                          <strong>Returns & Refunds:</strong> Items can be
                          returned within 7 days of delivery in their original
                          condition. Sale items are final and non-refundable.
                        </p>
                        <p>
                          <strong>Intellectual Property:</strong> All website
                          content (images, designs, logos) belongs to oxytoxin and may not be used without permission.
                        </p>
                        <p>
                          <strong>Limitation of Liability:</strong> We are not
                          responsible for delays, lost packages, or damages
                          beyond our control.
                        </p>
                        <p>
                          <strong>Governing Law:</strong> These terms are
                          governed by the laws of Nigeria.
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
