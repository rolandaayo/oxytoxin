'use client'
import React from 'react'
import Image from 'next/image'
import { FaStar } from 'react-icons/fa'

export default function Recommendations({ products, category, currentProductId }) {
  const recommendations = products
    .filter(product => product.category === category && product.id !== currentProductId)
    .slice(0, 4)

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-black mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-square bg-gray-50">
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
                style={{ backgroundColor: '#f8f8f8', padding: '0.5rem' }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-black">{product.name}</h3>
              <div className="flex items-center mt-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-black ml-1">
                  ({product.reviews})
                </span>
              </div>
              <p className="text-sm font-bold text-black mt-2">
                ${product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 