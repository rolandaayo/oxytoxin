"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaTimes, FaStar, FaRuler, FaTruck, FaShieldAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickView({
  product,
  onClose,
  addToCart,
  selectedSize,
  setSelectedSize,
  itemQuantities,
  updateQuantity,
}) {
  const sizes = ["S", "M", "L", "XL"];
  // Robust image handling with fallback
  const mainImg =
    product.mainImage ||
    (Array.isArray(product.image) ? product.image[0] : product.image) ||
    (product.images && product.images[0]) ||
    "/images/logo.png"; // Fallback image
  const otherImgs =
    product.images && Array.isArray(product.images)
      ? product.images
      : Array.isArray(product.image)
      ? product.image.slice(1)
      : [];
  const images = [
    mainImg,
    ...otherImgs.filter((img) => img !== mainImg && img), // Ensure img exists
  ].filter(Boolean);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCarouselIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!selectedSize[product.id]) {
      toast.error("Please select a size first", {
        icon: "👕",
        duration: 2000,
      });
      return;
    }
    addToCart(product);
    setSelectedSize((prev) => {
      const newSizes = { ...prev };
      delete newSizes[product.id];
      return newSizes;
    });
    onClose();
    toast.success(`${product.name} added to cart!`, {
      icon: "🛍️",
      duration: 2000,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto"
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-3 top-3 md:right-4 md:top-4 text-gray-500 hover:text-black z-10"
            >
              <FaTimes className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-6">
              {/* Image Section */}
              <div className="flex flex-row gap-4 items-start w-full">
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div
                    className="flex flex-col gap-2 overflow-y-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300"
                    style={{
                      WebkitOverflowScrolling: "touch",
                      maxHeight: "300px",
                    }}
                  >
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className={`w-12 h-12 md:w-16 md:h-16 object-cover rounded border cursor-pointer transition-all duration-200 mx-1 md:mx-0 md:my-1 ${
                          carouselIndex === idx
                            ? "ring-2 ring-blue-500"
                            : "opacity-70"
                        }`}
                        onClick={() => setCarouselIndex(idx)}
                      />
                    ))}
                  </div>
                )}
                {/* Main Image */}
                <div className="flex-1 flex items-center justify-center aspect-square overflow-hidden">
                  <img
                    src={images[carouselIndex]}
                    alt={product.name}
                    className="w-full h-64 md:h-80 object-contain transition-all duration-100"
                  />
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-black mb-1 md:mb-2">
                    {product.name}
                  </h2>
                  <p className="text-base md:text-lg font-semibold text-black">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>

                <p className="text-sm md:text-base text-black leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selection */}
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-black mb-2">
                    Select Size
                  </h3>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full border text-black transition-all duration-300 text-sm md:text-base ${
                          selectedSize[product.id] === size
                            ? "bg-black text-white border-black font-bold"
                            : "hover:border-black border-black hover:bg-black/10"
                        }`}
                        onClick={() =>
                          setSelectedSize((prev) => ({
                            ...prev,
                            [product.id]: size,
                          }))
                        }
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-black mb-2">
                    Quantity
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      className="w-8 h-8 md:w-10 md:h-10 border rounded-md flex items-center justify-center text-black hover:border-black hover:bg-black/5 transition-colors text-sm md:text-base"
                      onClick={() => updateQuantity(product.id, -1)}
                    >
                      -
                    </button>
                    <span className="text-black text-sm md:text-base min-w-[20px] text-center">
                      {itemQuantities[product.id] || 1}
                    </span>
                    <button
                      className="w-8 h-8 md:w-10 md:h-10 border rounded-md flex items-center justify-center text-black hover:border-black hover:bg-black/5 transition-colors text-sm md:text-base"
                      onClick={() => updateQuantity(product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm md:text-base font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
