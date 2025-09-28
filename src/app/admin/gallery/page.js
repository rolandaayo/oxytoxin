"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaUpload, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { Poppins } from "next/font/google";
import toast from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function AdminGalleryPage() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://oxytoxin-backend.vercel.app/api/admin/gallery"
      );
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, WebP)");
        return;
      }

      setUploadForm({ ...uploadForm, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadForm.image) {
      toast.error("Please select an image to upload");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", uploadForm.image);
      formData.append("title", uploadForm.title);
      formData.append("description", uploadForm.description);

      const response = await fetch(
        "https://oxytoxin-backend.vercel.app/api/admin/gallery",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Image uploaded successfully!");
        setShowUploadModal(false);
        setUploadForm({ title: "", description: "", image: null });
        setImagePreview(null);
        fetchGalleryImages();
      } else {
        toast.error(result.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://oxytoxin-backend.vercel.app/api/admin/gallery/${imageId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Image deleted successfully!");
        fetchGalleryImages();
      } else {
        toast.error(result.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gallery Management
              </h1>
              <p className="text-gray-600 mt-2">
                Upload and manage gallery images
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Upload Image
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {galleryImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No gallery images yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by uploading your first image
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto"
            >
              <FaUpload className="w-4 h-4" />
              Upload First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={image.imageUrl}
                    alt={image.title || "Gallery image"}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => handleDelete(image._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
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
                  <p className="text-xs text-gray-500 mt-2">
                    Added: {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Upload Gallery Image
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadForm({ ...uploadForm, image: null });
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to select image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="mt-2 inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter image title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter image description"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadForm.image}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
