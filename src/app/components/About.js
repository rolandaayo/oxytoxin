"use client";
import React from "react";
import Image from "next/image";
import {
  FaCheckCircle,
  FaUsers,
  FaTrophy,
  FaShippingFast,
} from "react-icons/fa";
import { motion } from "framer-motion";
import PageTransition from "./PageTransition";

export default function About() {
  const stats = [
    { icon: <FaUsers />, number: "10K+", label: "Happy Customers" },
    { icon: <FaTrophy />, number: "50+", label: "Awards Won" },
    { icon: <FaShippingFast />, number: "24h", label: "Fast Delivery" },
  ];

  const values = [
    {
      title: "Quality First",
      description:
        "We never compromise on quality, ensuring each piece meets our high standards.",
    },
    {
      title: "Customer Satisfaction",
      description:
        "Your satisfaction is our priority, backed by our hassle-free return policy.",
    },
    {
      title: "Sustainable Fashion",
      description:
        "Committed to eco-friendly practices and sustainable manufacturing processes.",
    },
    {
      title: "Innovation",
      description:
        "Constantly evolving and adapting to bring you the latest in fashion technology.",
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-16 md:pt-[calc(4rem+32px)]">
        {/* Hero Section */}
        <div className="relative h-[400px] md:h-[500px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/images/image2.jpeg")',
            }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#D6E752] mb-4">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              Crafting quality fashion since 2015, we ve been dedicated to
              bringing you the finest clothing with style and comfort.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/95 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="text-center"
                >
                  <div className="text-4xl text-blue-600 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-black mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white/90 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-black mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-8">
                At Oxtoyin, our mission is to revolutionize the fashion industry
                by providing high-quality, sustainable clothing that empowers
                individuals to express their unique style while maintaining our
                commitment to environmental responsibility and ethical
                manufacturing practices.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h3 className="text-xl font-semibold text-black mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white/95 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-black text-center mb-12">
              Our Leadership
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((member) => (
                <div key={member} className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={`/images/team-${member}.jpg`}
                      alt="Team Member"
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">
                    John Doe
                  </h3>
                  <p className="text-gray-600">Co-founder & CEO</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-black mb-8">Get in Touch</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Have questions about our company or products? We&apos;d love to
              hear from you. Reach out to us and we&apos;ll get back to you as
              soon as possible.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
