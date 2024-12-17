'use client'
import About from '../components/About'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState } from 'react'

export default function AboutPage() {
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)

  return (
    <>
      <Navbar 
        cartItems={cartItems} 
        setShowCart={setShowCart}
      />
      <About />
      <Footer />
    </>
  )
} 