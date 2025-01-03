"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import items from '@/app/components/Data'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const [products, setProducts] = useState(items)
  const [editingProduct, setEditingProduct] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    inStock: true,
  })

  const handleImageUpload = (e, isEditing = false) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isEditing) {
          setEditingProduct({ ...editingProduct, image: reader.result })
        } else {
          setNewProduct({ ...newProduct, image: reader.result })
          setImagePreview(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
  }

  const handleUpdateProduct = (e) => {
    e.preventDefault()
    const updatedProducts = products.map((product) =>
      product.id === editingProduct.id ? editingProduct : product
    )
    setProducts(updatedProducts)
    setEditingProduct(null)
    toast.success('Product updated successfully!')
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    const productWithId = {
      ...newProduct,
      id: Date.now().toString(),
    }
    setProducts([...products, productWithId])
    setNewProduct({
      id: '',
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      inStock: true,
    })
    setImagePreview(null)
    toast.success('Product added successfully!')
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter((product) => product.id !== productId)
      setProducts(updatedProducts)
      toast.success('Product deleted successfully!')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Add New Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
                className="border p-2 rounded"
              />
              {imagePreview && (
                <div className="relative h-40 w-full">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="jackets">Jackets</option>
              <option value="pants">Pants</option>
              <option value="shirts">Shirts</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="border p-2 rounded md:col-span-2"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newProduct.inStock}
              onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
            />
            <label>In Stock</label>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Add Product
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Product List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              {editingProduct?.id === product.id ? (
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                  <div className="flex flex-col space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="border p-2 rounded"
                    />
                    <div className="relative h-40 w-full">
                      <Image
                        src={editingProduct.image}
                        alt={editingProduct.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="border p-2 rounded w-full"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="jackets">Jackets</option>
                    <option value="pants">Pants</option>
                    <option value="shirts">Shirts</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    />
                    <label>In Stock</label>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="relative h-40 mb-2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="font-bold mt-2">${product.price}</p>
                  <p className="text-sm mt-1">Category: {product.category}</p>
                  <p className="text-sm mt-1">Status: {product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
