"use client";
import React from "react";
import { motion } from "framer-motion";
import PageTransition from "./PageTransition";
import Link from "next/link";

export default function About() {
  return (
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
                About Oxytoxin
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed px-2">
                Lagos-born streetwear brand blending bold self-expression with
                African energy
              </p>
            </motion.div>
          </div>
        </div>

        {/* About Section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-8 md:mb-12"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6">
                  Our Story
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
                  <div className="text-left">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
                      Oxytoxin is a Lagos-born streetwear brand blending bold
                      self-expression with African energy. Inspired by the raw
                      rhythm of the city, we create fashion that&apos;s
                      unapologetic, edgy, and real for those who move culture,
                      not follow it.
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
                      The name fuses oxygen and toxin symbolizing the balance
                      between necessity and rebellion. Each piece tells a story,
                      crafted for the fearless, the creative, and the loud.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl">
                    <blockquote className="text-base sm:text-lg font-semibold text-black italic leading-relaxed">
                      &ldquo;At Oxytoxin, we don&apos;t just make clothes. We
                      craft identity. We dress the unapologetic. We fuel a
                      culture.&rdquo;
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6">
                  Our Mission
                </h2>
                <div className="max-w-3xl mx-auto">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 md:mb-6">
                    At Oxytoxin, our mission is to empower bold self-expression
                    through fashion that reflects the raw spirit of Lagos and
                    the voice of a new generation. We exist to challenge the
                    norm, amplify culture, and create pieces that inspire
                    individuality, confidence, and movement.
                  </p>
                  <div className="bg-black text-white p-4 md:p-6 rounded-xl">
                    <p className="text-base sm:text-lg font-semibold leading-relaxed">
                      We&apos;re not here to fit in <br />
                      we&apos;re here to stand out, speak loud, and stay real.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-6 md:mb-8"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6">
                  What We Stand For
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
                      <span className="text-white text-sm md:text-lg font-bold">
                        A
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-black mb-2 md:mb-3">
                      Authenticity
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      Every piece reflects the real spirit of Lagos street
                      culture and genuine self-expression.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
                      <span className="text-white text-sm md:text-lg font-bold">
                        B
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-black mb-2 md:mb-3">
                      Boldness
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      We create for the fearless, the creative, and those who
                      dare to be different.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
                      <span className="text-white text-sm md:text-lg font-bold">
                        C
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-black mb-2 md:mb-3">
                      Culture
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      We amplify and celebrate the vibrant culture that shapes
                      our identity and community.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
                      <span className="text-white text-sm md:text-lg font-bold">
                        D
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-black mb-2 md:mb-3">
                      Diversity
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      Embracing all voices and perspectives to create fashion
                      that speaks to everyone.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-black to-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-6 md:mb-8"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">
                  Why Choose Oxytoxin
                </h2>

                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                  {/* Free Shipping */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/20 w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)]"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
                      <span className="text-black text-sm md:text-lg font-bold">
                        🚚
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3 text-center">
                      Free Shipping
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed text-center">
                      On orders over $100
                    </p>
                  </motion.div>

                  {/* Secure Payment */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/20 w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)]"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
                      <span className="text-black text-sm md:text-lg font-bold">
                        🔒
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3 text-center">
                      Secure Payment
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed text-center">
                      100% secure payments
                    </p>
                  </motion.div>

                  {/* Shop with Confidence */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/20 w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)]"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
                      <span className="text-black text-sm md:text-lg font-bold">
                        ✅
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3 text-center">
                      Shop with Confidence
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed text-center">
                      30 days free returns
                    </p>
                  </motion.div>

                  {/* Customer Support */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/20 w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)]"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
                      <span className="text-black text-sm md:text-lg font-bold">
                        💬
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3 text-center">
                      Customer Support
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed text-center">
                      24/7 help available
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-3 md:mb-4">
                  Get in Touch
                </h2>
                <p className="text-sm sm:text-base text-gray-700 mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed">
                  Have questions about our brand or products? We&apos;d love to
                  hear from you. Reach out to us and we&apos;ll get back to you
                  as soon as possible.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact">
                    <button className="bg-black text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-gray-800 transition-colors font-semibold text-sm">
                      Contact Us
                    </button>
                  </Link>
                  <button className="border-2 border-black text-black px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-black hover:text-white transition-colors font-semibold text-sm">
                    Follow Us
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
