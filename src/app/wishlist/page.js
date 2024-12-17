'use client'
import Wishlist from '../components/Wishlist'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState } from 'react'

export default function WishlistPage() {
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)

  const addToCart = (item) => {
    setCartItems(prev => [...prev, item])
    localStorage.setItem('cartItems', JSON.stringify([...cartItems, item]))
  }

  return (
    <>
      <Navbar 
        cartItems={cartItems} 
        setShowCart={setShowCart}
      />
      <Wishlist 
        addToCart={addToCart}
        setShowCart={setShowCart}
      />
      <Footer />
    </>
  )
} 