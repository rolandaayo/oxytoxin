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
  // Robust image handling
  const mainImg =
    product.mainImage ||
    (Array.isArray(product.image) ? product.image[0] : product.image) ||
    (product.images && product.images[0]);
  const otherImgs =
    product.images && Array.isArray(product.images)
      ? product.images
      : Array.isArray(product.image)
      ? product.image.slice(1)
      : [];
  const images = [
    mainImg,
    ...otherImgs.filter((img) => img !== mainImg),
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
          className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Image Section */}
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden flex flex-col items-center justify-center">
                {images.length > 0 && (
                  <div className="relative w-full h-full flex flex-col items-center">
                    <img
                      src={images[carouselIndex]}
                      alt={product.name}
                      className="w-full h-80 object-contain rounded-lg transition-all duration-300"
                      style={{ backgroundColor: "#f8f8f8", padding: "1rem" }}
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10"
                          aria-label="Previous image"
                        >
                          &#8592;
                        </button>
                        <button
                          onClick={handleNext}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10"
                          aria-label="Next image"
                        >
                          &#8594;
                        </button>
                      </>
                    )}
                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div className="flex gap-2 mt-4 justify-center">
                        {images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className={`w-12 h-12 object-cover rounded border cursor-pointer transition-all duration-200 ${
                              carouselIndex === idx
                                ? "ring-2 ring-blue-500"
                                : "opacity-70"
                            }`}
                            style={{ backgroundColor: "#f8f8f8" }}
                            onClick={() => setCarouselIndex(idx)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">
                    {product.name}
                  </h2>
                  <p className="text-lg font-semibold text-black">
                    ${product.price}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-black">
                    ({product.reviews} reviews)
                  </span>
                </div>

                <p className="text-black">{product.description}</p>

                {/* Size Selection */}
                <div>
                  <h3 className="text-sm font-medium text-black mb-2">
                    Select Size
                  </h3>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`w-10 h-10 rounded-full border text-black transition-all duration-300 ${
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
                  <h3 className="text-sm font-medium text-black mb-2">
                    Quantity
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      className="w-10 h-10 border rounded-md flex items-center justify-center text-black hover:border-black hover:bg-black/5 transition-colors"
                      onClick={() => updateQuantity(product.id, -1)}
                    >
                      -
                    </button>
                    <span className="text-black">
                      {itemQuantities[product.id] || 1}
                    </span>
                    <button
                      className="w-10 h-10 border rounded-md flex items-center justify-center text-black hover:border-black hover:bg-black/5 transition-colors"
                      onClick={() => updateQuantity(product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
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
