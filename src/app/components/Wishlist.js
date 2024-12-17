'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaHeart, FaShoppingCart, FaTrash, FaStar } from 'react-icons/fa'
import items from './Data'
import toast from 'react-hot-toast'

export default function Wishlist({ addToCart, setShowCart }) {
  const [wishlistItems, setWishlistItems] = useState([])
  const [selectedSize, setSelectedSize] = useState({})
  const sizes = ["S", "M", "L", "XL"]

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      const wishlistIds = JSON.parse(savedWishlist)
      const wishlistProducts = items.filter(item => wishlistIds.includes(item.id))
      setWishlistItems(wishlistProducts)
    }
  }, [])

  const removeFromWishlist = (itemId) => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    const updatedWishlist = savedWishlist.filter(id => id !== itemId)
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
    setWishlistItems(prev => prev.filter(item => item.id !== itemId))
    window.dispatchEvent(new CustomEvent('wishlistUpdate', { 
      detail: { count: updatedWishlist.length } 
    }));
    toast.success('Item removed from wishlist', {
      icon: '💔',
      duration: 2000
    })
  }

  const handleAddToCart = (item) => {
    if (!selectedSize[item.id]) {
      toast.error('Please select a size first', {
        icon: '👕',
        duration: 2000
      })
      return
    }
    addToCart({
      ...item,
      size: selectedSize[item.id],
      quantity: 1
    })
    removeFromWishlist(item.id)
    setShowCart(true)
  }

  return (
    <div className="min-h-screen pt-16 md:pt-[calc(4rem+32px)]">
      {/* Hero Section */}
      <div className="relative h-[200px] md:h-[300px] mb-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/image2.jpeg")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#D6E752] mb-4">My Wishlist</h1>
          <p className="text-lg text-[#D6E752] max-w-2xl">
            Your favorite items, all in one place
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white/95 backdrop-blur-sm rounded-lg shadow-md">
            <FaHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">
              Save items you love to your wishlist
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-[300px]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundColor: '#f8f8f8' }}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition-colors group"
                    >
                      <FaTrash className="text-red-500 w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-black">{item.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(item.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({item.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <p className="text-2xl font-bold mb-4 text-black">${item.price}</p>
                  
                  <div className="flex gap-2 mb-4">
                    {Object.values(item.colors).map((color, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-600"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mb-4 justify-center">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`w-10 h-10 rounded-full border transition-all duration-300 ${
                          selectedSize[item.id] === size
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'hover:border-blue-600'
                        }`}
                        onClick={() => setSelectedSize(prev => ({ ...prev, [item.id]: size }))}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 