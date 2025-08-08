"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Poppins } from "next/font/google";
import toast from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://oxytoxin-backend.vercel.app/api/public/gallery");
      const result = await response.json();
      
      if (result.status === "success") {
        setGalleryImages(result.data);
      } else {
        toast.error("Failed to load gallery images");
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast.error("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = galleryImages.filter(image =>
    image.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${poppins.className}`}>
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
              Explore our collection of stunning fashion photography and lifestyle images
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? "No images found" : "Gallery is empty"}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "Check back soon for new additions to our gallery"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={image.title || "Gallery image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 relative aspect-square md:aspect-auto">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title || "Gallery image"}
                  fill
                  className="object-contain"
                />
              </div>
              
              {(selectedImage.title || selectedImage.description) && (
                <div className="w-full md:w-80 p-6 bg-white">
                  {selectedImage.title && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {selectedImage.title}
                    </h2>
                  )}
                  {selectedImage.description && (
                    <p className="text-gray-600 leading-relaxed">
                      {selectedImage.description}
                    </p>
                  )}
                  {selectedImage.createdAt && (
                    <p className="text-sm text-gray-500 mt-4">
                      Added: {new Date(selectedImage.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 