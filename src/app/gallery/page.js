"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Build a list of gallery images from the repo's public images folder.
    // The images folder has been normalized to `public/images/oxytoxin`.
    const IMAGES_DIR = "/images/oxytoxin/";
    const filenames = [
      "0x-6.JPG",
      "ox-1.JPG",
      "ox-3.JPG",
      "ox-4.JPG",
      "ox-5.JPG",
      "ox-7.JPG",
      "ox-8.JPG",
      "ox-9.JPG",
      "ox-10.JPG",
      "ox-11.JPG",
      "ox-12.JPG",
      "ox-13.JPG",
    ];

    // Use up to 12 images (you said you added up to ox-13). Change slice to
    // 10 if you prefer exactly 10 placeholders.
    const placeholders = filenames.slice(0, 12).map((name, i) => ({
      _id: `oxy-${i + 1}`,
      title: "",
      description: "",
      imageUrl: `${IMAGES_DIR}${name}`,
      createdAt: new Date().toISOString(),
    }));

    setGalleryImages(placeholders);
    setLoading(false);
  }, []);

  const filteredImages = galleryImages;

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gray-50 flex items-center justify-center ${poppins.className}`}
      >
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${poppins.className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Gallery
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of stunning fashion photography and
              lifestyle images
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative max-w-md mx-auto">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search gallery images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div> */}

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Gallery is empty
            </h3>
            <p className="text-gray-600">
              Check back soon for new additions to our gallery
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => openImageModal(image)}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Mobile: ensure a decent visible height so images don't shrink too small */}
                  <div className="relative overflow-hidden h-56 sm:h-[55vh] md:h-[45vh] lg:h-[50vh]">
                    <Image
                      src={image.imageUrl}
                      alt={image.title || "Gallery image"}
                      fill
                      className="object-cover object-center md:object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {(image.title || image.description) && (
                    <div className="p-4">
                      {image.title && (
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {image.title}
                        </h3>
                      )}
                      {image.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {image.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <FaTimes className="w-8 h-8" />
            </button>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.title || "Gallery image"}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
