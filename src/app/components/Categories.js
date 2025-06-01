"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import PageTransition from "./PageTransition";

export default function Categories() {
  const categories = [
    {
      id: 1,
      name: "Jackets",
      description: "Premium quality jackets for all seasons",
      image: "/images/image0 (6).jpeg",
      itemCount: 5,
    },
    {
      id: 2,
      name: "Pants",
      description: "Comfortable and stylish pants collection",
      image: "/images/1.jpeg",
      itemCount: 4,
    },
    // Add more categories as needed
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-16 md:pt-[calc(4rem+32px)] bg-white">
        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[400px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/images/image2.jpeg")',
            }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Categories
            </h1>
            <p className="text-lg md:text-xl text-white max-w-2xl">
              Explore our wide range of fashion categories
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white backdrop-blur-sm"
              >
                {/* Category Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={500}
                    height={375}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                {/* Category Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm mb-4">
                        {category.description}
                      </p>
                      <p className="text-sm font-medium">
                        {category.itemCount} Items
                      </p>
                    </div>
                    <Link
                      href="/"
                      className="bg-white/20 backdrop-blur-sm p-3 rounded-full transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <FaArrowRight className="w-5 h-5 text-[#D6E752]" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Featured Collections */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-black text-center mb-12">
              Featured Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative h-[300px] rounded-2xl overflow-hidden group">
                <Image
                  src="/images/image0 (7).jpeg"
                  alt="New Arrivals"
                  width={600}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">New Arrivals</h3>
                  <p className="text-white/90 mb-4">
                    Check out our latest collection
                  </p>
                  <Link
                    href="/"
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-[#D6E752]/90 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>

              <div className="relative h-[300px] rounded-2xl overflow-hidden group">
                <Image
                  src="/images/image4.jpeg"
                  alt="Best Sellers"
                  width={600}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">Best Sellers</h3>
                  <p className="text-white/90 mb-4">Our most popular items</p>
                  <Link
                    href="/"
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-[#D6E752]/90 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-black mb-4">Stay Updated</h2>
            <p className="text-black mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive updates about new products
              and special offers.
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-[#D6E752]"
              />
              <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-slate-500 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
