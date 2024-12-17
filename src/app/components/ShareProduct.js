'use client'
import React from 'react'
import { FaTimes, FaFacebook, FaTwitter, FaWhatsapp, FaLink } from 'react-icons/fa'

export default function ShareProduct({ product, onClose }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(product.name)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out ${product.name}: ${shareUrl}`)}`,
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied to clipboard!')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-black">Share Product</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaFacebook />
              <span>Facebook</span>
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
            >
              <FaTwitter />
              <span>Twitter</span>
            </a>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FaWhatsapp />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <FaLink />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 