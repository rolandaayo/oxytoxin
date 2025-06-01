'use client'
import Categories from '../components/Categories'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState } from 'react'

export default function CategoriesPage() {
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)

  return (
    <>
      <Navbar 
        cartItems={cartItems} 
        setShowCart={setShowCart}
      />
      <Categories />
      <Footer />
    </>
  )
} 