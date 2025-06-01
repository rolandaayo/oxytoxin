'use client'
import Contact from '../components/Contact'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState } from 'react'

export default function ContactPage() {
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)

  return (
    <>
      <Navbar 
        cartItems={cartItems} 
        setShowCart={setShowCart}
      />
      <Contact />
      <Footer />
    </>
  )
} 