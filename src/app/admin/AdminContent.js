"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { adminApi } from "../services/api";

export default function AdminContent() {
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [otherImagesPreview, setOtherImagesPreview] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [otherImageFiles, setOtherImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    colors: [],
    features: [],
  });

  // Fetch products on component mount
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await adminApi.getProducts();
      setProducts(productsData);
    } catch (error) {
      toast.error(error.message || "Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchProducts();
  }, []);

  // Handle main image upload
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setMainImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle other images upload (accumulate files and previews)
  const handleOtherImagesUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    // Filter out duplicates by name (optional, or use lastModified)
    const uniqueNewFiles = newFiles.filter(
      (file) =>
        !otherImageFiles.some(
          (f) => f.name === file.name && f.size === file.size
        )
    );
    const updatedFiles = [...otherImageFiles, ...uniqueNewFiles];
    setOtherImageFiles(updatedFiles);
    // Generate previews for new files and accumulate
    const newPreviewsPromises = uniqueNewFiles.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(newPreviewsPromises).then((newPreviews) => {
      setOtherImagesPreview((prev) => [...prev, ...newPreviews]);
    });
  };

  // Remove an image from the other images selection
  const handleRemoveOtherImage = (idx) => {
    setOtherImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setOtherImagesPreview((prev) => prev.filter((_, i) => i !== idx));
  };

  // Handle product creation
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!mainImageFile) {
      toast.error("Please select a main image");
      return;
    }
    setLoading(true);
    try {
      // Upload main image
      const mainFormData = new FormData();
      mainFormData.append("images", mainImageFile);
      const mainUploadResult = await adminApi.uploadImage(mainFormData);
      if (
        !mainUploadResult ||
        !Array.isArray(mainUploadResult) ||
        mainUploadResult.length === 0
      ) {
        throw new Error("Failed to upload main image");
      }
      const mainImageUrl = mainUploadResult[0];

      // Upload other images (if any)
      let otherImagesUrls = [];
      if (otherImageFiles.length > 0) {
        const otherFormData = new FormData();
        otherImageFiles.forEach((file) => otherFormData.append("images", file));
        const otherUploadResult = await adminApi.uploadImage(otherFormData);
        if (Array.isArray(otherUploadResult)) {
          otherImagesUrls = otherUploadResult;
        }
      }

      // Create product with mainImage and images array
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        category: newProduct.category,
        stock: Number(newProduct.stock),
        colors: newProduct.colors || [],
        features: newProduct.features || [],
        mainImage: mainImageUrl,
        images: otherImagesUrls,
      };
      await adminApi.createProduct(productData);
      toast.success("Product created successfully!");
      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        colors: [],
        features: [],
      });
      setMainImagePreview(null);
      setOtherImagesPreview([]);
      setMainImageFile(null);
      setOtherImageFiles([]);
      fetchProducts();
    } catch (error) {
      toast.error(error.message || "Failed to create product");
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle product update
  const handleUpdateProduct = async (id, productData) => {
    try {
      setLoading(true);
      await adminApi.updateProduct(id, productData);
      toast.success("Product updated successfully!");
      fetchProducts();
    } catch (error) {
      toast.error(error.message || "Failed to update product");
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setLoading(true);
      await adminApi.deleteProduct(id);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Log render state
  console.log("AdminContent rendering, isClient:", isClient);

  if (!isClient) {
    console.log("AdminContent not yet mounted, returning null");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Total Products: {products.length}
              </span>
              <span className="text-sm text-gray-500">
                Last Updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Form Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
              </div>
              <form
                onSubmit={
                  editingProduct ? handleUpdateProduct : handleCreateProduct
                }
                className="p-6 space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={
                        editingProduct ? editingProduct.name : newProduct.name
                      }
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({
                              ...editingProduct,
                              name: e.target.value,
                            })
                          : setNewProduct({
                              ...newProduct,
                              name: e.target.value,
                            })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={
                        editingProduct ? editingProduct.price : newProduct.price
                      }
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({
                              ...editingProduct,
                              price: e.target.value,
                            })
                          : setNewProduct({
                              ...newProduct,
                              price: e.target.value,
                            })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="0.00"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={
                        editingProduct
                          ? editingProduct.category
                          : newProduct.category
                      }
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({
                              ...editingProduct,
                              category: e.target.value,
                            })
                          : setNewProduct({
                              ...newProduct,
                              category: e.target.value,
                            })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="jackets">Jackets</option>
                      <option value="pants">Pants</option>
                      <option value="shirts">Shirts</option>
                      <option value="shoes">Shoes</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={
                        editingProduct ? editingProduct.stock : newProduct.stock
                      }
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({
                              ...editingProduct,
                              stock: e.target.value,
                            })
                          : setNewProduct({
                              ...newProduct,
                              stock: e.target.value,
                            })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Enter stock quantity"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={
                        editingProduct
                          ? editingProduct.description
                          : newProduct.description
                      }
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({
                              ...editingProduct,
                              description: e.target.value,
                            })
                          : setNewProduct({
                              ...newProduct,
                              description: e.target.value,
                            })
                      }
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Enter product description"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Image
                    </label>
                    <div className="mt-1 flex flex-col items-center">
                      <input
                        id="main-image-upload"
                        name="main-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        className="mb-2"
                        disabled={loading}
                      />
                      {mainImagePreview && (
                        <div className="mb-4">
                          <Image
                            src={mainImagePreview}
                            alt="Main Image Preview"
                            width={200}
                            height={200}
                            className="rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Other Images
                    </label>
                    <div className="mt-1 flex flex-col items-center">
                      <input
                        id="other-images-upload"
                        name="other-images-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleOtherImagesUpload}
                        className="mb-2"
                        disabled={loading}
                        multiple
                      />
                      {otherImagesPreview.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                          {otherImagesPreview.map((preview, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={preview}
                                alt={`Other Image ${index + 1}`}
                                width={200}
                                height={200}
                                className="rounded-lg shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveOtherImage(index)}
                                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-600 shadow hover:bg-white z-10 opacity-80 group-hover:opacity-100"
                                title="Remove image"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : editingProduct ? (
                      "Update Product"
                    ) : (
                      "Add Product"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Products List Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Products
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => {
                      // Add sorting logic here
                    }}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Stock
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {product.mainImage &&
                                product.mainImage.length > 0 && (
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <Image
                                      src={product.mainImage}
                                      alt={product.name}
                                      width={40}
                                      height={40}
                                      className="rounded-full object-cover"
                                      unoptimized
                                    />
                                  </div>
                                )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              ${product.price.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded-md">
                                {product.stock} units
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 capitalize">
                              {product.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
